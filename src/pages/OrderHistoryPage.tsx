import { PackageCheck, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const OrderHistoryPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3001/orders?userId=${user?.id}`,
      );
      if (!res.ok) throw new Error("Không thể lấy lịch sử đơn hàng");
      return res.json();
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" /> {t("orders.backToHome")}
        </Link>

        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t("orders.title")}
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("orders.accountInfo")}
            <span className="font-semibold text-blue-600">
              {user?.username}
            </span>
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("orders.emptyTitle")}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-mono text-base font-bold text-gray-900 dark:text-white">
                    #{order.id}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {order.status
                      ? t("orders.statusConfirmed")
                      : t("orders.statusPending")}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span>•</span>
                  <span>
                    {t("orders.items", { items: order.items?.length || 0 })}
                  </span>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6 dark:sm:border-gray-800">
                <span className="text-xs text-gray-400 block">
                  {t("orders.total")}
                </span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
