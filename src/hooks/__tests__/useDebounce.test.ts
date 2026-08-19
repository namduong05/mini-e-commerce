import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Giả lập thời gian
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("nên trả về giá trị ban đầu ngay lập tức", () => {
    const { result } = renderHook(() => useDebounce("laptop", 500));
    expect(result.current).toBe("laptop");
  });

  it("không nên cập nhật giá trị mới trước khi hết thời gian delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "laptop", delay: 500 } },
    );

    // Thay đổi giá trị mới
    rerender({ value: "phone", delay: 500 });

    // Trôi qua 300ms (chưa đủ 500ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Giá trị vẫn phải là giá trị cũ
    expect(result.current).toBe("laptop");
  });

  it("phải cập nhật giá trị mới sau khi hết thời gian debounce", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "laptop", delay: 500 } },
    );

    // Cập nhật giá trị
    rerender({ value: "phone", delay: 500 });

    // Cho thời gian trôi qua đúng 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Giá trị đã được cập nhật thành công
    expect(result.current).toBe("phone");
  });
});
