import type { Product, ProductFilterParams, ProductsResponse } from "../types";

const BASE_URL = "https://dummyjson.com/products";

export const fetchProducts = async (
  params: ProductFilterParams,
): Promise<ProductsResponse> => {
  const limit = params.limit || 12;
  const page = params.page || 1;
  const skip = (page - 1) * limit;

  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

  // Nếu có tìm kiếm
  if (params.search && params.search.trim() !== "") {
    url = `${BASE_URL}/search?q=${encodeURIComponent(params.search)}&limit=${limit}&skip=${skip}`;
  }
  // Nếu lọc theo danh mục
  else if (params.category && params.category !== "all") {
    url = `${BASE_URL}/category/${encodeURIComponent(params.category)}?limit=${limit}&skip=${skip}`;
  }

  // Sắp xếp
  if (params.sortBy) {
    url += `&sortBy=${params.sortBy}&order=${params.order || "asc"}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Không thể tải danh sách sản phẩm!");
  }
  const data = await response.json();
  return data;
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/category-list`);
    if (!response.ok) {
      throw new Error("Không thể tải danh mục!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Không thể tải danh mục!");
  }
};

export const fetchProductById = async (
  id: string | number,
): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Không tìm thấy thông tin sản phẩm!");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Không tìm thấy thông tin sản phẩm!");
  }
};
