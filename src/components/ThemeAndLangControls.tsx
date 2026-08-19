import { Sun, Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";

export const ThemeAndLangControls = () => {
  const { i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("vi") ? "en" : "vi";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Nút Đổi Ngôn Ngữ */}
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        title="Đổi ngôn ngữ / Change language"
      >
        <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        <span className="uppercase">
          {i18n.language.startsWith("vi") ? "VI" : "EN"}
        </span>
      </button>

      {/* Nút Bật/Tắt Dark Mode */}
      <button
        onClick={toggleTheme}
        className="rounded-lg border border-gray-200 p-1.5 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-yellow-400 dark:hover:bg-gray-800"
        title="Đổi giao diện Sáng/Tối"
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4 text-gray-600" />
        )}
      </button>
    </div>
  );
};
