import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Store,
  User as UserIcon,
  LogOut,
  Package,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { ThemeAndLangControls } from "./ThemeAndLangControls";
import { toast } from "sonner";

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openCart, getTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    useCartStore.getState().initUserCart(); // Tải giỏ hàng từ server khi user đăng nhập
  }, []);

  const handleOpenCart = () => {
    openCart();
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.info("Đã đăng xuất tài khoản");
    useCartStore.getState().clearCart();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        {/* 1. Logo ứng dụng */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white sm:text-xl"
        >
          <div className="rounded-lg bg-blue-600 p-1.5 sm:p-2 text-white">
            <Store className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span>Store</span>
        </Link>

        {/* 2. Controls trên DESKTOP */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeAndLangControls />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/orders"
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                title="Lịch sử đơn hàng"
              >
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:hover:bg-red-950/30"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <UserIcon className="h-4 w-4" />
                <span>{t("header.login")}</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span>{t("header.register")}</span>
              </Link>
            </>
          )}

          {location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
        </div>

        {/* 3. Controls rút gọn trên MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Nút Giỏ hàng trên Mobile */}
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <button
                onClick={handleOpenCart}
                className="relative rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

          {/* Nút Open / Close Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 shadow-sm active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* 4. Dropdown Menu trên Mobile */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-4 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:hidden animate-in slide-in-from-top-2 duration-200">
          {/* Phần Thông tin User */}
          {user ? (
            <div className="space-y-2 border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    {t("header.currentAccount")}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t("header.logout")}
                </button>
              </div>

              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>{t("header.orderHistory")}</span>
                </div>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white shadow-sm dark:bg-gray-100 dark:text-gray-900"
              >
                <UserIcon className="h-4 w-4" />
                <span>{t("header.login")}</span>
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-1.5 mt-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span>{t("header.register")}</span>
              </Link>
            </div>
          )}

          {/* Phần Đổi Ngôn ngữ & Theme */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t("header.themeAndLanguage")}
            </span>
            <ThemeAndLangControls />
          </div>
        </div>
      )}
    </header>
  );
};
