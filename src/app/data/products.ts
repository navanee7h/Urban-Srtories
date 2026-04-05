export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  image_file?: string;
  color: string;
  description: string;
  sizes: Record<string, number>;
  fit: string;
  fabric: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  fit: 'Standard' | 'Custom';
  measurements?: Measurements;
  customCharge?: number;
}

export interface Measurements {
  chest: string;
  shoulder: string;
  sleeveLength: string;
  shirtLength: string;
  neck: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  items: CartItem[];
  total: number;
}


