import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
}

export const SearchBar = ({ initialValue = "", onSearch }: SearchBarProps) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync initialValue khi người dùng gõ URL trực tiếp hoặc F5
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Cập nhật filter khi giá trị debounced thay đổi
  useEffect(() => {
    if (debouncedSearch !== initialValue) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, initialValue]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t("filters.searchPlaceholder")}
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
