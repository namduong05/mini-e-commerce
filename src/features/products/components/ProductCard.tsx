import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "../types";
import { Link } from "react-router";
import { useCartStore } from "../../../store/cartStore";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard = ({
  product,
  priority = false,
}: ProductCardProps) => {
  const { t } = useTranslation();

  const addToCart = useCartStore((state) => state.addToCart);

  // Tính giá gốc trước khi giảm
  const originalPrice = (
    product.price /
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-900">
      {/* Badge Giảm giá */}
      {product.discountPercentage > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          -{Math.round(product.discountPercentage)}%
        </span>
      )}

      {/* Ảnh sản phẩm */}
      <Link
        to={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden bg-gray-100"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize dark:text-white">{product.category}</span>
          <div className="flex items-center gap-1 font-medium text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600 dark:text-gray-200">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("home.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};
