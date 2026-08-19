import { useProductFilters } from "../features/products/hooks/useProductFilters";
import { useProducts } from "../features/products/hooks/useProducts";
import { ProductGrid } from "../features/products/components/ProductGrid";
import { SearchBar } from "../features/products/components/SearchBar";
import { ProductFilters } from "../features/products/components/ProductFilters";
import { Pagination } from "../components/Pagination";
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const { t } = useTranslation();
  const { filters, setFilter, setFilters, clearFilters } = useProductFilters();

  const { data, isLoading, isError, isFetching } = useProducts(filters);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Search Bar */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-white">
              {t("home.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("home.subtitle")}
            </p>
          </div>

          <SearchBar
            initialValue={filters.search}
            onSearch={(val) => setFilter("search", val)}
          />
        </header>

        {/* Filter Toolbar */}
        <ProductFilters
          category={filters.category}
          sortBy={filters.sortBy}
          order={filters.order}
          onCategoryChange={(cat) => setFilter("category", cat)}
          onSortChange={(sort, ord) => {
            setFilters({ sortBy: sort, order: ord });
          }}
          onClearAll={clearFilters}
        />

        {/* Indicator khi React Query đang fetch ngầm (Background Fetching) */}
        {isFetching && !isLoading && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-blue-100">
            <div className="h-full w-1/3 animate-pulse bg-blue-600 rounded-full" />
          </div>
        )}

        {/* Hiển thị bối cảnh khi gặp lỗi */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {t("home.errorMessage")}
          </div>
        )}

        {/* Danh sách sản phẩm */}
        {!isError && (
          <ProductGrid products={data?.products} isLoading={isLoading} />
        )}

        {/* Phân trang */}
        {data && (
          <Pagination
            currentPage={filters.page}
            totalItems={data.total}
            pageSize={filters.limit}
            onPageChange={(page) => setFilter("page", page)}
          />
        )}
      </div>
    </div>
  );
};
