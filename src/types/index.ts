export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
