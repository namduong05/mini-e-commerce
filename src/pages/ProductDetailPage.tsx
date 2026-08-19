import { useParams, Link } from "react-router";
import { useProductDetail } from "../features/products/hooks/useProducts";
import { useCartStore } from "../store/cartStore";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Check,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ProductDetailPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProductDetail(id);
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/4 rounded bg-gray-200" />
            <div className="h-10 w-1/3 rounded bg-gray-200" />
            <div className="h-24 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("productDetail.notFound")}
        </h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {t("productDetail.backToHome")}
        </Link>
      </div>
    );
  }

  const currentImage = selectedImage || product.thumbnail;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("productDetail.back")}
        </Link>

        <div className="grid grid-cols-1 gap-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm md:grid-cols-2">
          {/* Bộ sưu tập Ảnh */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {/* Ảnh phụ Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      currentImage === img
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thông tin Chi tiết */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider">
                <span>{product.brand}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-600">
                  {product.category}
                </span>
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
                {product.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold">{product.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="h-4 w-4" />{" "}
                  {product.stock > 0
                    ? t("productDetail.inStock", { stock: product.stock })
                    : t("productDetail.outOfStock")}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    $
                    {(
                      product.price /
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mt-6 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Chọn số lượng & Thêm vào giỏ */}
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">
                  {t("productDetail.quantity")}
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="px-4 text-sm font-bold text-gray-800">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
              >
                <ShoppingBag className="h-5 w-5" />
                {t("productDetail.addToCart")} - $
                {(product.price * quantity).toFixed(2)}
              </button>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>{t("productDetail.freeShipping")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>{t("productDetail.warranty")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
