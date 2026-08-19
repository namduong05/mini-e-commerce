import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import CartItem from "./CartItem";

export const CartDrawer = () => {
  const { t } = useTranslation();

  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
          {/* Header Giỏ hàng */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 px-6 py-4">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <span className="text-black dark:text-white">
                {t("cart.title")} ({getTotalItems()})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Danh sách món hàng */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 stroke-[1.5]" />
                <p className="mt-4 text-base font-semibold text-gray-700 dark:text-gray-300">
                  {t("cart.emptyTitle")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("cart.emptySubtitle")}
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <CartItem
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Tổng tiền & Nút Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-500 p-6 bg-gray-50 dark:bg-gray-800 space-y-4">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span className="text-black dark:text-white">
                  {t("cart.total")}
                </span>
                <span className="text-blue-500 text-xl">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400">{t("cart.subtext")}</p>

              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
              >
                <span>{t("cart.checkout")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
