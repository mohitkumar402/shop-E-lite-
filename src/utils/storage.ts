import { User } from '../types';

const USERS_KEY = 'ecommerce_users';
const CURRENT_USER_KEY = 'ecommerce_current_user';
const SESSION_KEY = 'ecommerce_session';
const CART_KEY = 'ecommerce_cart';

export const storage = {
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUser(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  },

  setSession(user: User): void {
    const sessionExpiry = Date.now() + (15 * 60 * 1000);
    const session = {
      user,
      expiry: sessionExpiry
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  getSession(): { user: User; expiry: number } | null {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    
    const parsedSession = JSON.parse(session);
    
    if (Date.now() > parsedSession.expiry) {
      this.clearSession();
      return null;
    }
    
    return parsedSession;
  },

  getCurrentUser(): User | null {
    const session = this.getSession();
    return session ? session.user : null;
  },

  clearSession(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CART_KEY);
  },

  getCart(): CartItem[] {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }
};

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}
