import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const { t } = useTranslation();

  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("home.previous")}
        </button>

        <span className="px-3 text-sm font-semibold text-gray-700 dark:text-white">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-white"
        >
          {t("home.next")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
