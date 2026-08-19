# 🛒 TechStore - Modern E-Commerce Platform

<div align="left">

[![CI Pipeline](https://github.com/namduong05/mini-e-commerce/actions/workflows/ci.yml/badge.svg)](https://github.com/namduong05/mini-e-commerce/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

> Ứng dụng Thương mại Điện tử hiệu năng cao xây dựng bằng **React**, **TypeScript (Strict Mode)**, **TanStack Query**, **Zustand**, và **TailwindCSS**. Dự án giải quyết các bài toán kỹ thuật thực tế: Kiến trúc dữ liệu lai (Hybrid Architecture), đồng bộ bộ lọc với URL Params, Unit Testing tự động và tối ưu Core Web Vitals.

📁 **Repository:** [https://github.com/namduong05/mini-e-commerce](https://github.com/namduong05/mini-e-commerce)

---

## 🎯 Điểm Sáng Kỹ Thuật (Key Technical Highlights)

### 1. URL-Driven State Architecture

- **Đồng bộ hóa 2 chiều:** Toàn bộ trạng thái tìm kiếm (`search`), danh mục (`category`), sắp xếp (`sortBy`, `order`) và phân trang (`page`) được quản lý trực tiếp trên URL Search Params.
- **Xử lý Race Condition:** Giải quyết triệt để vấn đề mất param khi cập nhật nhiều bộ lọc liên tiếp bằng cơ chế `batch update` trong Custom Hook `useProductFilters`.

### 2. Kiến trúc Dữ liệu Lai (Hybrid Data Architecture)

- **Public Catalog API (DummyJSON):** Tận dụng API công khai để xử lý tìm kiếm, phân trang và lọc danh mục.
- **Private User Store (json-server RESTful API):** Dữ liệu giỏ hàng (`carts`) và lịch sử đặt hàng (`orders`) được cách ly độc lập theo từng `userId` và đồng bộ lưu trữ vào `db.json`.

### 3. Tối ưu Hiệu năng & Core Web Vitals (Lighthouse > 90)

- **Route-level Code Splitting:** Ứng dụng `React.lazy` và `<Suspense>` giúp giảm kích thước bundle ban đầu (Initial Bundle Size < 160KB gzip).
- **Vendor Chunk Splitting:** Phân tách các thư viện nặng (`vendor-react`, `vendor-query`, `vendor-forms`) trong cấu hình Rollup để tận dụng tối đa HTTP Cache của trình duyệt.
- **LCP & FCP Optimization:** Ưu tiên tải eager (`fetchPriority="high"`) cho các ảnh trong viewport đầu tiên, kết hợp `preconnect` và `dns-prefetch` tới API CDN.

### 4. Kiểm thử Tự động (Automated Unit Testing)

- Thiết lập bộ kiểm thử với **Vitest** và **React Testing Library**.
- Bao phủ các logic cốt lõi: Timer giả lập (`useFakeTimers`) trong `useDebounce`, phân quyền thêm vào giỏ, tăng giảm số lượng và tính toán tổng tiền trong `cartStore`.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lĩnh vực                 | Thư viện / Công cụ            | Mục đích sử dụng                                  |
| :----------------------- | :---------------------------- | :------------------------------------------------ |
| **Core Framework**       | React 18, TypeScript (Strict) | Nền tảng ứng dụng Type-safe 100%                  |
| **Build Tool**           | Vite                          | Tốc độ dev server & build tối ưu                  |
| **Data Fetching**        | @tanstack/react-query v5      | Quản lý Server State, Caching, `keepPreviousData` |
| **Client State**         | Zustand                       | Quản lý Giỏ hàng và Auth Session                  |
| **Routing**              | react-router v7               | Điều hướng SPA và bảo vệ Route (`ProtectedRoute`) |
| **Form Handling**        | react-hook-form + zod         | Validate thông tin giao hàng chuẩn Regex VN       |
| **UI & Styling**         | Tailwind CSS + Lucide Icons   | Giao diện responsive, Dark Mode mượt mà           |
| **Internationalization** | react-i18next                 | Hỗ trợ chuyển đổi đa ngôn ngữ EN / VI             |
| **Testing**              | Vitest + Testing Library      | Chạy Unit Test kiểm thử logic                     |
| **CI/CD**                | GitHub Actions                | Tự động Typecheck, Test & Build                   |

---

## 📂 Cấu Trúc Thư Mục (Feature-Based Structure)

```text
src/
├── components/           # Reusable UI (Header, Pagination, ThemeControls,...)
├── features/
│   ├── products/         # Product Feature (API, Components, Hooks, Types)
│   ├── cart/             # Cart Feature (CartDrawer, CartItem)
│   └── checkout/         # Checkout Feature (CheckoutForm, Zod Schema)
├── hooks/                # Global Custom Hooks (useDebounce, useTheme)
├── i18n/                 # Cấu hình đa ngôn ngữ (locales en/vi)
├── pages/                # Page Components (HomePage, ProductDetail, Checkout,...)
├── store/                # Zustand Global Stores (authStore, cartStore)
├── test/                 # Test setup & configuration
└── types/                # Type definitions dùng chung
```
