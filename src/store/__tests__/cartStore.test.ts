import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCartStore } from "../cartStore";
import { useAuthStore } from "../authStore";
import type { Product } from "../../features/products/types";

// Mock hàm syncServerCart để không gửi HTTP request thật trong test
vi.mock("../../api/cartServerApi", () => ({
  syncServerCart: vi.fn(),
  fetchServerCart: vi.fn().mockResolvedValue([]),
}));

// Mock sản phẩm mẫu
const mockProduct: Product = {
  id: 1,
  title: "iPhone 15 Pro",
  description: "Smartphone Apple",
  price: 1000,
  discountPercentage: 10,
  rating: 4.8,
  stock: 10,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "image.jpg",
  images: ["image.jpg"],
};

describe("Zustand cartStore Unit Tests", () => {
  beforeEach(() => {
    // Reset state trước mỗi test case
    useCartStore.setState({ cart: [], isOpen: false });
    useAuthStore.setState({ user: null });
  });

  it("phải CHẶN và trả về false khi khách chưa đăng nhập bấm thêm vào giỏ", () => {
    const result = useCartStore.getState().addToCart(mockProduct, 1);

    expect(result).toBe(false);
    expect(useCartStore.getState().cart).toHaveLength(0);
  });

  it("cho phép thêm sản phẩm vào giỏ khi User đã đăng nhập", () => {
    // Giả lập user đã đăng nhập
    useAuthStore.setState({
      user: {
        id: "5B7jGT3eWjc",
        username: "emilys",
        password: "n",
      },
    });

    const result = useCartStore.getState().addToCart(mockProduct, 2);

    expect(result).toBe(true);
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0].quantity).toBe(2);
    expect(useCartStore.getState().getTotalItems()).toBe(2);
  });

  it("phải cộng dồn số lượng nếu thêm cùng một sản phẩm nhiều lần", () => {
    useAuthStore.setState({
      user: {
        id: "5B7jGT3eWjc",
        username: "emilys",
        password: "n",
      },
    });

    useCartStore.getState().addToCart(mockProduct, 1);
    useCartStore.getState().addToCart(mockProduct, 3);

    const cart = useCartStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(4);
  });

  it("tính toán tổng tiền đơn hàng chính xác", () => {
    useAuthStore.setState({
      user: {
        id: "5B7jGT3eWjc",
        username: "emilys",
        password: "n",
      },
    });

    const productB: Product = { ...mockProduct, id: 2, price: 500 };

    useCartStore.getState().addToCart(mockProduct, 2); // 2 * 1000 = 2000
    useCartStore.getState().addToCart(productB, 3); // 3 * 500  = 1500

    expect(useCartStore.getState().getTotalPrice()).toBe(3500);
  });

  it("phải xóa sản phẩm khỏi giỏ hàng khi gọi removeFromCart", () => {
    useAuthStore.setState({
      user: {
        id: "5B7jGT3eWjc",
        username: "emilys",
        password: "n",
      },
    });

    useCartStore.getState().addToCart(mockProduct, 1);
    useCartStore.getState().removeFromCart(mockProduct.id);

    expect(useCartStore.getState().cart).toHaveLength(0);
    expect(useCartStore.getState().getTotalItems()).toBe(0);
  });
});
