// Dữ liệu của 1 sản phẩm
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Cấu trúc Response trả về khi gọi danh sách sản phẩm có phân trang
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Params cho query filters
export interface ProductFilterParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}
