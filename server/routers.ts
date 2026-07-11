import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  publicProcedure,
  router,
  protectedProcedure,
  adminProcedure,
} from "./_core/trpc";
import { z } from "zod";
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
} from "./db";

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
  }),

  // Order routes
  orders: router({
    getUserOrders: protectedProcedure.query(({ ctx }) =>
      getUserOrders(ctx.user.id)
    ),
    createOrder: protectedProcedure.mutation(({ ctx }) =>
      createOrder(ctx.user.id)
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
    create: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          orderId: z.number(),
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
    createProduct: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          price: z.string(),
          categoryId: z.number(),
          stock: z.number().min(0).default(0),
          imageUrl: z.string().optional(),
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
