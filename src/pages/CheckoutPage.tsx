import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import {
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Wallet,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { createCheckoutSchema } from "../features/checkout/schemas/checkoutSchema";
import type { CheckoutFormData } from "../features/checkout/schemas/checkoutSchema";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shippingFee = cart.length > 0 ? 5.0 : 0;
  const subtotal = getTotalPrice();
  const grandTotal = subtotal + shippingFee;

  const schema = useMemo(() => createCheckoutSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const user = useAuthStore((state) => state.user);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const newOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        userId: user?.id,
        customerInfo: data,
        items: cart,
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        status: true,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Không thể tạo đơn hàng");

      const createdOrder = await response.json();

      setOrderId(createdOrder.id);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      toast.error("Lỗi khi gửi đơn hàng");
    }
  };

  // Nếu giỏ hàng trống và chưa đặt thành công -> Gợi ý quay lại trang mua sắm
  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="mx-auto max-w-7xl min-h-screen px-4 py-16 text-center dark:bg-black">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          {t("checkout.emptyCartTitle")}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t("checkout.emptyCartSubtitle")}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" /> {t("checkout.discoveryTitle")}
        </Link>
      </div>
    );
  }

  // Màn hình Đặt hàng Thành công
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 dark:bg-black">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-900 p-8 text-center shadow-lg">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
            {t("checkout.successMessage")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-100">
            {t("checkout.thankYou")}
          </p>
          <div className="my-4 inline-block rounded-lg bg-gray-100 px-4 py-2 font-mono text-base font-bold text-blue-500">
            #{orderId}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-300">
            {t("checkout.confirmationEmail")}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
          >
            {t("checkout.continueShopping")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4" /> {t("checkout.backToHome")}
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t("checkout.title")}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Cột trái: Form nhập thông tin */}
          <div className="space-y-6 lg:col-span-7">
            {/* Khối 1: Thông tin người nhận */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-500 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-600 pb-3">
                1. {t("checkout.deliveryInfo")}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                    {t("checkout.fullName")} *
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Nguyen Van A"
                    className={`mt-1 w-full dark:text-gray-200 rounded-lg border px-3 py-2 text-sm outline-none transition-all ${
                      errors.fullName
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                    {t("checkout.phoneNumber")} *
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="0912345678"
                    className={`mt-1 w-full dark:text-gray-200 rounded-lg border px-3 py-2 text-sm outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="nguyenvana@gmail.com"
                  className={`mt-1 w-full dark:text-gray-200 rounded-lg border px-3 py-2 text-sm outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                    {t("checkout.deliveryAddress")} *
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    placeholder="Số 123 Đường ABC, Phường X"
                    className={`mt-1 w-full dark:text-gray-200 rounded-lg border px-3 py-2 text-sm outline-none transition-all ${
                      errors.address
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                    {t("checkout.city")} *
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="Hà Nội / TP.HCM"
                    className={`mt-1 w-full dark:text-gray-200 rounded-lg border px-3 py-2 text-sm outline-none transition-all ${
                      errors.city
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-white">
                  {t("checkout.orderNote")}
                </label>
                <textarea
                  {...register("note")}
                  rows={2}
                  placeholder="Ghi chú (Note)..."
                  className="mt-1 w-full dark:text-gray-200 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Khối 2: Phương thức thanh toán */}
            <div className="rounded-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-600 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 dark:text-white dark:border-gray-500 pb-3">
                2. {t("checkout.paymentMethod")}
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="cod"
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {t("checkout.cod")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("checkout.codDesc")}
                      </p>
                    </div>
                  </div>
                  <Truck className="h-5 w-5 text-gray-400" />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="momo"
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {t("checkout.momo")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("checkout.momoDesc")}
                      </p>
                    </div>
                  </div>
                  <Wallet className="h-5 w-5 text-gray-400" />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="credit_card"
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {t("checkout.internationalCard")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("checkout.internationalCardDesc")}
                      </p>
                    </div>
                  </div>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </label>
              </div>

              {errors.paymentMethod && (
                <p className="text-xs text-red-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* Cột phải: Bảng Tóm tắt Đơn hàng */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-500 pb-3">
                {t("checkout.yourOrder", { items: cart.length })}
              </h3>

              {/* Danh sách sản phẩm */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg bg-gray-50 object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t("checkout.quantity")}: {quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tính toán chi phí */}
              <div className="border-t border-gray-100 dark:border-gray-500 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="text-black dark:text-white">
                    {t("checkout.subtotal")}
                  </span>
                  <span className="font-semibold dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-black dark:text-white">
                    {t("checkout.shippingFee")}
                  </span>
                  <span className="font-semibold dark:text-white">
                    ${shippingFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-gray-500 pt-3 text-base font-bold text-gray-900">
                  <span>{t("checkout.total")}</span>
                  <span className="text-xl text-blue-500">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Nút Đặt hàng */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? t("checkout.loading")
                  : t("checkout.orderConfirmation")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
