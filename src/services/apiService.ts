import { Product, Category } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lp_admin_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('lp_admin_token');
            localStorage.removeItem('lp_admin_user');
            // Eliminar cookie
            document.cookie = 'lp_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/admin/login';
        }
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Error: ${response.status}`);
    }

    return response.json();
};

export const apiService = {
    // Productos
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Error fetching products');
            return response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getProductById(id: string): Promise<Product | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Error fetching product');
            return response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(product),
        });
        return handleResponse(response);
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(product),
        });
        return handleResponse(response);
    },

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (response.status === 401) {
            await handleResponse(response);
        }
        if (!response.ok) {
            throw new Error('Error deleting product');
        }
    },

    // Categorías
    async getCategories(): Promise<Category[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Error fetching categories');
            return response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async createCategory(category: { nombre: string }): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(category),
        });
        return handleResponse(response);
    },

    async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(category),
        });
        return handleResponse(response);
    },

    async deleteCategory(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (response.status === 401) {
            await handleResponse(response);
        }
        if (!response.ok) throw new Error('Error deleting category');
    },

    // Subida de Imágenes
    async getPresignedUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
        const response = await fetch(`${API_BASE_URL}/upload/presigned-url`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ fileName, contentType }),
        });
        return handleResponse(response);
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
    }
};
