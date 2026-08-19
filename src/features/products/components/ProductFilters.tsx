import { Filter, ArrowUpDown } from "lucide-react";
import { useCategories } from "../hooks/useProducts";
import { useTranslation } from "react-i18next";

interface ProductFiltersProps {
  category: string;
  sortBy: string;
  order: "asc" | "desc";
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
  onClearAll: () => void;
}

export const ProductFilters = ({
  category,
  sortBy,
  order,
  onCategoryChange,
  onSortChange,
  onClearAll,
}: ProductFiltersProps) => {
  const { t } = useTranslation();

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onSortChange("", "asc");
      return;
    }
    const [field, sortOrder] = value.split("-");
    onSortChange(field, sortOrder as "asc" | "desc");
  };

  const currentSortValue = sortBy ? `${sortBy}-${order}` : "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Select Danh mục */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="all">{t("filters.allCategories")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Select Sắp xếp */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 h-4 w-4 text-gray-400" />
          <select
            value={currentSortValue}
            onChange={handleSortSelect}
            className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="">{t("filters.defaultSort")}</option>
            <option value="price-asc">{t("filters.priceLowHigh")}</option>
            <option value="price-desc">{t("filters.priceHighLow")}</option>
            <option value="title-asc">{t("filters.nameAZ")}</option>
            <option value="title-desc">{t("filters.nameZA")}</option>
            <option value="rating-desc">{t("filters.ratingHigh")}</option>
          </select>
        </div>
      </div>

      {/* Nút Xóa bộ lọc */}
      {(category !== "all" || sortBy !== "") && (
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-red-500 transition-colors hover:text-red-700 underline"
        >
          {t("filters.clearAll")}
        </button>
      )}
    </div>
  );
};
