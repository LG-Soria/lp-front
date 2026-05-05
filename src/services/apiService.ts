import { Product, Category, HomeConfig, PaginatedResponse, ProductSearchResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PUBLIC_REVALIDATE_SECONDS = 120;

type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue>;
type NextFetchOptions = RequestInit & {
    next?: {
        revalidate?: number;
        tags?: string[];
    };
};

type JsonRecord = Record<string, unknown>;

interface ShippingQuote {
    mode?: string;
    provider?: string;
    costCents?: number;
    description?: string;
    [key: string]: unknown;
}

interface ShippingQuotesResponse {
    quotes: ShippingQuote[];
}

interface CheckoutResponse {
    orderId: string;
    [key: string]: unknown;
}

interface MPPreferenceResponse {
    mpPreferenceId: string;
    initPointUrl: string;
}

interface PresignedUrlResponse {
    uploadUrl: string;
    publicUrl: string;
    key: string;
}

interface HomeConfigResponse extends HomeConfig {
    updatedAt?: string;
    [key: string]: unknown;
}

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lp_admin_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const buildQueryString = (params: QueryParams = {}): string => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value.toString());
        }
    });
    return query.toString();
};

const handleResponse = async <T = unknown>(response: Response): Promise<T> => {
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('lp_admin_token');
            localStorage.removeItem('lp_admin_user');
            document.cookie = 'lp_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/admin/login';
        }
        throw new Error('Sesion expirada. Por favor, inicie sesion nuevamente.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({} as { message?: string }));
        throw new Error(error.message || `Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
};

const withPublicCache = (options: NextFetchOptions = {}): NextFetchOptions => {
    if (typeof window === 'undefined') {
        return {
            ...options,
            next: {
                ...options.next,
                revalidate: options.next?.revalidate ?? PUBLIC_REVALIDATE_SECONDS,
            },
        };
    }

    return options;
};

const withNoStore = (options: NextFetchOptions = {}): NextFetchOptions => {
    if (typeof window === 'undefined') {
        return {
            ...options,
            cache: 'no-store',
        };
    }

    return options;
};

export const apiService = {
    // Productos
    async getProducts(params: QueryParams = {}): Promise<PaginatedResponse<Product>> {
        const queryString = buildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`, withPublicCache());
        return handleResponse<PaginatedResponse<Product>>(response).catch(() => ({
            items: [],
            meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        }));
    },

    async getProductById(id: string): Promise<Product | null> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, withPublicCache());
        return handleResponse<Product>(response).catch(() => null);
    },

    async searchProducts(query: string, limit = 8): Promise<ProductSearchResult[]> {
        if (!query || query.trim() === '') {
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`, withNoStore());
        return handleResponse<ProductSearchResult[]>(response).catch(() => []);
    },

    async getEligibleFeaturedProducts(params: { limit?: number; ids?: string[]; imageMode?: 'cover' | 'gallery' } = {}): Promise<Product[]> {
        const { ids, ...rest } = params;
        const query = buildQueryString({
            ...rest,
            ...(ids && ids.length > 0 ? { ids: ids.join(',') } : {}),
        });
        const response = await fetch(`${API_BASE_URL}/products/eligible-featured${query ? `?${query}` : ''}`, withPublicCache());
        return handleResponse<Product[]>(response).catch(() => []);
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(product),
        });
        return handleResponse<Product>(response);
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(product),
        });
        return handleResponse<Product>(response);
    },

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        await handleResponse(response);
    },

    // Categorias
    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories`, withPublicCache());
        return handleResponse<Category[]>(response).catch(() => []);
    },

    async createCategory(category: { nombre: string }): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(category),
        });
        return handleResponse<Category>(response);
    },

    async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(category),
        });
        return handleResponse<Category>(response);
    },

    async deleteCategory(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        await handleResponse(response);
    },

    // Subida de imagenes
    async getPresignedUrl(fileName: string, contentType: string): Promise<PresignedUrlResponse> {
        const response = await fetch(`${API_BASE_URL}/upload/presigned-url`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ fileName, contentType }),
        });
        return handleResponse<PresignedUrlResponse>(response);
    },

    async uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
        if (!response.ok) throw new Error('Error uploading file to R2');
    },

    // Envio
    async getShippingQuotes(postalCode: string, items: { productId: string; quantity: number }[]): Promise<ShippingQuotesResponse> {
        const response = await fetch(`${API_BASE_URL}/shipping/quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postalCode, items }),
        });
        return handleResponse<ShippingQuotesResponse>(response);
    },

    // Checkout
    async createCheckout(data: JsonRecord): Promise<CheckoutResponse> {
        const response = await fetch(`${API_BASE_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<CheckoutResponse>(response);
    },

    // Pagos
    async createMPPreference(orderId: string): Promise<MPPreferenceResponse> {
        const response = await fetch(`${API_BASE_URL}/payments/mercadopago/create-preference`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        return handleResponse<MPPreferenceResponse>(response);
    },

    // Consultas/Pedidos (Tipo PEDIDO)
    async createRequest(data: JsonRecord): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // Admin - Pedidos (STOCK)
    async getAdminOrders(params: QueryParams = {}): Promise<unknown> {
        const query = buildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/admin/orders${query ? `?${query}` : ''}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Admin - Consultas (PEDIDO)
    async getAdminRequests(params: QueryParams = {}): Promise<unknown> {
        const query = buildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/admin/requests${query ? `?${query}` : ''}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    async getAdminRequestById(id: string): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${id}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    async updateAdminRequestStatus(id: string, status: string): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },

    // Admin - Pedidos (STOCK) Detalles
    async getAdminOrderById(id: string): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    async updateAdminOrderStatus(id: string, status: string): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },

    async updateAdminOrderTracking(id: string, trackingCard: { trackingCode?: string; trackingUrl?: string }): Promise<unknown> {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/tracking`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(trackingCard),
        });
        return handleResponse(response);
    },

    // Configuracion de Home
    async getHomeConfig(): Promise<HomeConfigResponse> {
        const response = await fetch(`${API_BASE_URL}/home-config`, withPublicCache());
        return handleResponse<HomeConfigResponse>(response);
    },

    async updateHomeConfig(data: JsonRecord): Promise<HomeConfigResponse> {
        const response = await fetch(`${API_BASE_URL}/home-config`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<HomeConfigResponse>(response);
    }
};
