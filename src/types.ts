
export enum ProductType {
  STOCK = 'STOCK',
  PEDIDO = 'PEDIDO',
  PERSONALIZADO = 'PERSONALIZADO'
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
  categoryId: string;
  category?: Category;
}

export interface CartItem extends Product {
  quantity: number;
}
