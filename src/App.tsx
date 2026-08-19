import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CartDrawer } from "./features/cart/components/CartDrawer";
import { PageLoader } from "./components/PageLoader";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetailPage").then((module) => ({
    default: module.ProductDetailPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const OrderHistoryPage = lazy(() =>
  import("./pages/OrderHistoryPage").then((module) => ({
    default: module.OrderHistoryPage,
  })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);

function App() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Toaster richColors closeButton position="top-center" />
      <Header />
      <CartDrawer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
