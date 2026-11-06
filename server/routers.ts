import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  publicProcedure,
  router,
  protectedProcedure,
  adminProcedure,
} from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { storagePut } from "./storage";
import {
  getProducts,
  getProductById,
  getCategories,
  getCartItemsWithProducts,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCartItemCount,
  getUserOrders,
  getProductReviews,
  createReview,
  getUserWishlistWithProducts,
  addToWishlist,
  removeFromWishlist,
  createOrder,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  getAllOrders,
  updateOrderStatus,
  getProductSpecifications,
  hasUserPurchasedProduct,
  getDownloadAsset,
} from "./db";

const VALID_COUPONS: Record<
  string,
  { type: "percent" | "fixed"; value: number; label: string }
> = {
  NEXUS10: { type: "percent", value: 0.1, label: "10% Cyber Discount" },
  CYBER20: { type: "percent", value: 0.2, label: "20% Flash Sale" },
  SUPER50: { type: "fixed", value: 50, label: "$50 Community Voucher" },
  FREEASSET: { type: "percent", value: 1.0, label: "100% Free VIP Voucher" },
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product routes
  products: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          categoryId: z.number().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          sort: z
            .enum(["newest", "price-low", "price-high", "rating"])
            .optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) =>
        getProducts({
          search: input.search,
          categoryId: input.categoryId,
          minPrice: input.minPrice,
          maxPrice: input.maxPrice,
          sort: input.sort,
          limit: input.limit,
          offset: input.offset,
        })
      ),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getProductById(input)),
    getSpecifications: publicProcedure
      .input(z.number())
      .query(({ input }) => getProductSpecifications(input)),
  }),

  // Category routes
  categories: router({
    list: publicProcedure.query(() => getCategories()),
  }),

  // Cart routes
  cart: router({
    getItems: protectedProcedure.query(({ ctx }) =>
      getCartItemsWithProducts(ctx.user.id)
    ),
    getCount: protectedProcedure.query(({ ctx }) =>
      getCartItemCount(ctx.user.id)
    ),
    addItem: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })
      )
      .mutation(({ ctx, input }) =>
        addToCart(ctx.user.id, input.productId, input.quantity)
      ),
    updateQuantity: protectedProcedure
      .input(
        z.object({
          cartItemId: z.number(),
          quantity: z.number().min(1),
        })
      )
      .mutation(({ input }) =>
        updateCartItemQuantity(input.cartItemId, input.quantity)
      ),
    removeItem: protectedProcedure
      .input(z.number())
      .mutation(({ input }) => removeFromCart(input)),
    validateCoupon: publicProcedure
      .input(z.object({ code: z.string(), subtotal: z.number() }))
      .mutation(({ input }) => {
        const code = input.code.trim().toUpperCase();
        const coupon = VALID_COUPONS[code];
        if (!coupon) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid promo code. Try NEXUS10, CYBER20, or SUPER50",
          });
        }
        const discountAmount =
          coupon.type === "percent"
            ? input.subtotal * coupon.value
            : Math.min(input.subtotal, coupon.value);
        return {
          valid: true,
          code,
          discountAmount: Number(discountAmount.toFixed(2)),
          label: coupon.label,
        };
      }),
  }),

  // Order routes
  orders: router({
    getUserOrders: protectedProcedure.query(({ ctx }) =>
      getUserOrders(ctx.user.id)
    ),
    createOrder: protectedProcedure
      .input(
        z
          .object({
            customerName: z.string().optional(),
            customerEmail: z.string().optional(),
            shippingAddress: z.string().optional(),
            paymentMethod: z.string().optional(),
            couponCode: z.string().optional(),
            discountAmount: z.number().optional(),
          })
          .optional()
      )
      .mutation(({ ctx, input }) => createOrder(ctx.user.id, input)),
    getDownloadAsset: protectedProcedure
      .input(
        z.object({
          orderNumber: z.string(),
          productId: z.number(),
        })
      )
      .query(({ ctx, input }) =>
        getDownloadAsset(
          ctx.user.id,
          ctx.user.role,
          input.orderNumber,
          input.productId
        )
      ),
  }),

  // Review routes
  reviews: router({
    getByProduct: publicProcedure
      .input(
        z.object({
          productId: z.number(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) =>
        getProductReviews(input.productId, input.limit, input.offset)
      ),
    checkPurchase: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ ctx, input }) => {
        const res = await hasUserPurchasedProduct(ctx.user.id, input.productId);
        return {
          purchased: res.purchased || ctx.user.role === "admin",
          orderId: res.orderId,
        };
      }),
    create: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          orderId: z.number().default(0),
          rating: z.number().min(1).max(5),
          title: z.string().optional(),
          comment: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createReview({
          ...input,
          userId: ctx.user.id,
        })
      ),
  }),

  // Wishlist routes
  wishlist: router({
    getItems: protectedProcedure.query(({ ctx }) =>
      getUserWishlistWithProducts(ctx.user.id)
    ),
    addItem: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => addToWishlist(ctx.user.id, input)),
    removeItem: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => removeFromWishlist(ctx.user.id, input)),
  }),

  // Admin routes — require admin role
  admin: router({
    uploadFile: adminProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileBase64: z.string(),
          mimeType: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // If S3 storage is available, use storagePut
        if (process.env.STORAGE_API_URL && process.env.STORAGE_API_KEY) {
          const buffer = Buffer.from(
            input.fileBase64.replace(/^data:[^;]+;base64,/, ""),
            "base64"
          );
          const res = await storagePut(
            input.fileName,
            buffer,
            input.mimeType || "application/octet-stream"
          );
          return { url: res.url, key: res.key };
        }

        // Fallback: save to public/uploads
        const ext = path.extname(input.fileName) || ".png";
        const baseName = path
          .basename(input.fileName, ext)
          .replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueName = `${baseName}_${Date.now()}${ext}`;
        const buffer = Buffer.from(
          input.fileBase64.replace(/^data:[^;]+;base64,/, ""),
          "base64"
        );

        const uploadsDir = path.resolve(
          process.cwd(),
          "dist",
          "public",
          "uploads"
        );
        const clientUploadsDir = path.resolve(
          process.cwd(),
          "client",
          "public",
          "uploads"
        );

        for (const dir of [uploadsDir, clientUploadsDir]) {
          try {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, uniqueName), buffer);
          } catch (e) {
            // ignore
          }
        }

        return { url: `/uploads/${uniqueName}`, key: uniqueName };
      }),

    createProduct: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.string(),
          categoryId: z.number(),
          stock: z.number().min(0).default(0),
          imageUrl: z.string().optional(),
          fileUrl: z.string().optional(),
          fileSize: z.string().optional(),
          demoUrl: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const slug =
          input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
          "-" +
          Date.now();
        return createProduct({ ...input, sellerId: ctx.user.id, slug });
      }),

    updateProduct: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          categoryId: z.number().optional(),
          stock: z.number().optional(),
          imageUrl: z.string().optional(),
          fileUrl: z.string().optional(),
          fileSize: z.string().optional(),
          demoUrl: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),

    deleteProduct: adminProcedure
      .input(z.number())
      .mutation(({ input }) => deleteProduct(input)),

    createCategory: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const slug = input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return createCategory({ ...input, slug });
      }),

    getAllOrders: adminProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) => getAllOrders(input.limit, input.offset)),

    updateOrderStatus: adminProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum([
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
          ]),
        })
      )
      .mutation(({ input }) => updateOrderStatus(input.orderId, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
