export enum ProductType {
  STOCK = 'STOCK',
  PEDIDO = 'PEDIDO',
  PERSONALIZADO = 'PERSONALIZADO'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  IN_PREPARATION = 'IN_PREPARATION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum RequestStatus {
  NEW = 'NEW',
  REVIEWING = 'REVIEWING',
  QUOTED = 'QUOTED',
  ACCEPTED = 'ACCEPTED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  LOST = 'LOST'
}

export interface Category {
  id: string;
  nombre: string;
  imageUrl?: string | null;
  color?: string | null;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  tipo: ProductType;
  label?: string | null;
  imagenes: string[];
  tiempoProduccion: string | null;
  personalizable: boolean;
  weightGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  categoryId: string;
  category?: Category;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HomeConfig {
  id: string;
  heroImageUrl: string | null;
  featuredProductIds: string[];
}
