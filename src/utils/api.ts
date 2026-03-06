import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productAPI = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  async getLimitedProducts(limit: number): Promise<Product[]> {
    try {
      const response = await api.get(`/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching limited products:', error);
      throw new Error('Failed to fetch limited products');
    }
  }
};
