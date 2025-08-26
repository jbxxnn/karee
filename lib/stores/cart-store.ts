import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { Product, ProductImage, Category } from '@/lib/types/database';

export interface CartItem {
  id: string;
  product: Product & {
    product_images: ProductImage[];
    category?: Category;
  };
  quantity: number;
  selectedVariant?: {
    id: string;
    name: string;
    price: number;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product & { product_images: ProductImage[]; category?: Category }, quantity?: number, variant?: { id: string; name: string; price: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  totalItems: number;
  subtotal: number;
  totalPrice: number; // Added this alias for subtotal
  total: number;
  shipping: number;
  tax: number;
}

const SHIPPING_THRESHOLD = 50; // Free shipping over $50
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08; // 8% tax rate

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

             addItem: (product, quantity = 1, variant) => {
         set((state) => {
           const existingItem = state.items.find(item => 
             item.product.id === product.id && 
             item.selectedVariant?.id === variant?.id
           );

           if (existingItem) {
             // Update existing item quantity
             const newQuantity = existingItem.quantity + quantity;
             toast.success(`Updated quantity to ${newQuantity}`);
             return {
               items: state.items.map(item =>
                 item.id === existingItem.id
                   ? { ...item, quantity: newQuantity }
                   : item
               )
             };
           } else {
             // Add new item
             const newItem: CartItem = {
               id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
               product,
               quantity,
               selectedVariant: variant
             };
             toast.success(`Added ${product.name} to cart`);
             return { items: [...state.items, newItem] };
           }
         });
       },

      removeItem: (itemId: string) => {
        set((state) => {
          const item = state.items.find(item => item.id === itemId);
          if (item) {
            toast.success(`Removed ${item.product.name} from cart`);
          }
          return {
            items: state.items.filter(item => item.id !== itemId)
          };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        toast.success('Cart cleared');
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      // Computed values - implement as getters
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((total, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      get totalPrice() {
        return get().subtotal; // Alias for subtotal
      },

      get shipping() {
        const subtotal = get().subtotal;
        return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      get tax() {
        return get().subtotal * TAX_RATE;
      },

      get total() {
        return get().subtotal + get().shipping + get().tax;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist cart items
    }
  )
);
