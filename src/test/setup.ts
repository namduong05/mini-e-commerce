import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock sonner toast để không làm nhiễu test console
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));
