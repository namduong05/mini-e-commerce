import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <Loader2 className="absolute h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
        Đang tải trang...
      </p>
    </div>
  );
};
