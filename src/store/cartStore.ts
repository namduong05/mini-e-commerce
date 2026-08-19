import { create } from "zustand";
import { toast } from "sonner";
import type { Product } from "../features/products/types";
import { useAuthStore } from "./authStore";
import {
  fetchServerCart,
  syncServerCart,
} from "../features/cart/api/cartServerApi";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  openCart: () => void;
  closeCart: () => void;

  initUserCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isOpen: false,
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // Tải giỏ hàng từ json-server khi user đăng nhập
  initUserCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ cart: [] });
      return;
    }

    set({ isLoading: true });
    const items = await fetchServerCart(user.id);
    set({ cart: items, isLoading: false });
  },

  addToCart: (product, quantity = 1) => {
    const user = useAuthStore.getState().user;

    // Yêu cầu đăng nhập trước khi mua hàng
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ!", {
        description: "Đăng nhập để lưu trữ giỏ hàng của riêng bạn.",
      });
      return false;
    }

    const { cart } = get();
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id,
    );
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity,
      };
    } else {
      updatedCart = [...cart, { product, quantity }];
    }

    set({ cart: updatedCart });
    syncServerCart(user.id, updatedCart);

    toast.success(`Đã thêm "${product.title}" vào giỏ hàng`);
    return true;
  },

  removeFromCart: (productId) => {
    const user = useAuthStore.getState().user;
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.product.id !== productId);

    set({ cart: updatedCart });
    if (user) syncServerCart(user.id, updatedCart);

    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const user = useAuthStore.getState().user;
    const { cart } = get();
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );

    set({ cart: updatedCart });
    if (user) syncServerCart(user.id, updatedCart);
  },

  clearCart: () => {
    const user = useAuthStore.getState().user;
    set({ cart: [] });
    if (user) syncServerCart(user.id, []);
  },

  getTotalItems: () =>
    get().cart.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ),
}));
