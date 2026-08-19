import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchCategories,
  fetchProductById,
} from "../api/productApi";
import type { ProductFilterParams } from "../types";

// Hook lấy danh sách sản phẩm theo filters
export const useProducts = (params: ProductFilterParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook lấy danh sách danh mục)
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // Cache danh mục trong 1 giờ
  });
};

// Hook lấy chi tiết sản phẩm theo ID
export const useProductDetail = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id, // Chỉ kích hoạt query khi có id
    staleTime: 1000 * 60 * 5,
  });
};
