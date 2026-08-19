import type { CartItem } from "../../../store/cartStore";

const SERVER_URL = "http://localhost:3001";

// Lấy giỏ hàng của User từ json-server
export const fetchServerCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const res = await fetch(`${SERVER_URL}/carts?userId=${userId}`);
    if (!res.ok) {
      if (res.status === 404) {
        // Nếu chưa có record giỏ hàng, tạo mới cho user
        await createServerCart(userId, []);
        return [];
      }
      throw new Error("Lỗi tải giỏ hàng");
    }
    const data = await res.json();

    return data[0]?.items || [];
  } catch (error) {
    console.error("Không thể fetch cart từ json-server:", error);
    return [];
  }
};

// Tạo giỏ hàng mới cho User
export const createServerCart = async (userId: string, items: CartItem[]) => {
  await fetch(`${SERVER_URL}/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, items }),
  });
};

// Đồng bộ danh sách items mới lên json-server
export const syncServerCart = async (userId: string, items: CartItem[]) => {
  try {
    const res = await fetch(`${SERVER_URL}/carts?userId=${userId}`);
    if (!res.ok) {
      if (res.status === 404) {
        // Nếu chưa có record giỏ hàng, tạo mới cho user
        await createServerCart(userId, items);
        return;
      }
    }

    const existingCart = await res.json();
    if (existingCart.length === 0) {
      // Nếu chưa có record giỏ hàng, tạo mới cho user
      await createServerCart(userId, items);
      return;
    }

    const existingCartId = existingCart[0].id;

    const updateRes = await fetch(`${SERVER_URL}/carts/${existingCartId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items }),
    });

    if (updateRes.status === 404) {
      await createServerCart(userId, items);
    }
  } catch (error) {
    console.error("Lỗi khi đồng bộ giỏ hàng lên json-server:", error);
  }
};
