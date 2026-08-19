import { useSearchParams } from "react-router";

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc dữ liệu từ URL Params
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";

  // Hàm cập nhật một bộ lọc cụ thể lên URL
  const setFilters = (
    newFilterObj: Record<string, string | number | undefined | null>,
  ) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      Object.entries(newFilterObj).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });

      // Nếu thay đổi bất kỳ bộ lọc nào khác 'page', tự động reset về trang 1
      const updatedKeys = Object.keys(newFilterObj);
      if (updatedKeys.some((k) => k !== "page")) {
        newParams.set("page", "1");
      }

      return newParams;
    });
  };

  // Hàm tiện ích nếu chỉ muốn cập nhật 1 filter đơn lẻ
  const setFilter = (key: string, value: string | number) => {
    setFilters({ [key]: value });
  };

  // Hàm xóa toàn bộ bộ lọc
  const clearFilters = () => {
    setSearchParams({});
  };

  return {
    filters: { search, category, page, sortBy, order, limit: 12 },
    setFilter,
    setFilters,
    clearFilters,
  };
};
