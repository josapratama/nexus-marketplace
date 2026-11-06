import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

describe("Marketplace Features & Improvements", () => {
  it("validates promo coupons correctly", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    // Valid percent coupon: NEXUS10 (10%)
    const res10 = await caller.cart.validateCoupon({
      code: "NEXUS10",
      subtotal: 100,
    });
    expect(res10.valid).toBe(true);
    expect(res10.discountAmount).toBe(10);
    expect(res10.code).toBe("NEXUS10");

    // Valid percent coupon: CYBER20 (20%)
    const res20 = await caller.cart.validateCoupon({
      code: "CYBER20",
      subtotal: 50,
    });
    expect(res20.valid).toBe(true);
    expect(res20.discountAmount).toBe(10);

    // Valid fixed coupon: SUPER50 ($50)
    const res50 = await caller.cart.validateCoupon({
      code: "SUPER50",
      subtotal: 120,
    });
    expect(res50.valid).toBe(true);
    expect(res50.discountAmount).toBe(50);

    // Case insensitivity
    const resCase = await caller.cart.validateCoupon({
      code: "nexus10",
      subtotal: 200,
    });
    expect(resCase.valid).toBe(true);
    expect(resCase.discountAmount).toBe(20);

    // Invalid coupon throws
    await expect(
      caller.cart.validateCoupon({
        code: "INVALID_CODE_XYZ",
        subtotal: 100,
      })
    ).rejects.toThrow("Invalid promo code");
  });
});

