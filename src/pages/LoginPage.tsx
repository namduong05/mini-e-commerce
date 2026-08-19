import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router";
import { User as UserIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Lấy đường dẫn trước đó nếu người dùng bị nảy ra từ Protected Route
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch(
        `http://localhost:3001/users?username=${data.username}&password=${data.password}`,
      );

      const users = await res.json();

      if (users.length === 0) {
        throw new Error("Sai username hoặc password");
      }

      const user = users[0];

      login(user);

      await useCartStore.getState().initUserCart();

      toast.success(`Chào mừng trở lại, ${user.username}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
            {t("common.loginTitle")}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("common.loginDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t("common.username")}
            </label>
            <div className="relative mt-1">
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                {...register("username")}
                placeholder="emilys"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t("common.password")}
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? t("common.loading") : t("common.login")}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <Link
            to="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};
