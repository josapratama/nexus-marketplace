import { eq, like, and, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  categories,
  cartItems,
  orders,
  reviews,
  wishlist,
  productSpecifications,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = [
      "name",
      "email",
      "loginMethod",
      "passwordHash",
    ] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function isFirstUser(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select({ id: users.id }).from(users).limit(1);
  return result.length === 0;
}

// Product queries
export async function getProducts({
  search,
  categoryId,
  minPrice,
  maxPrice,
  sort = "newest",
  limit = 20,
  offset = 0,
}: {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-low" | "price-high" | "rating";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (search) {
    conditions.push(like(products.name, `%${search}%`));
  }
  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(products.price, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(products.price, maxPrice.toString()));
  }

  let query = db.select().from(products);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  let orderByClause = desc(products.createdAt);
  if (sort === "price-low") {
    orderByClause = asc(products.price);
  } else if (sort === "price-high") {
    orderByClause = desc(products.price);
  } else if (sort === "rating") {
    orderByClause = desc(products.rating);
  }

  return (query as any).orderBy(orderByClause).limit(limit).offset(offset);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// Category queries
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(categories);
}

// Cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(
  userId: number,
  productId: number,
  quantity: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    )
    .limit(1);

  if (existing.length > 0) {
    return db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  }

  return db.insert(cartItems).values({ userId, productId, quantity });
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

// Order queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(orders).where(eq(orders.userId, userId));
}

// Review queries
export async function getProductReviews(
  productId: number,
  limit = 10,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);
}

// Wishlist queries
export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(wishlist).where(eq(wishlist.userId, userId));
}

export async function addToWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(wishlist).values({ userId, productId });
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
}

// Create order from cart items
export async function createOrder(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get cart items with product info
  const userCartItems = await db
    .select({
      cartItemId: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      productName: products.name,
      productPrice: products.price,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

  if (userCartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const subtotal = userCartItems.reduce(
    (sum: number, item: { productPrice: string; quantity: number }) =>
      sum + parseFloat(item.productPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const orderItems = userCartItems.map(item => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: item.productPrice,
  }));

  await db.insert(orders).values({
    userId,
    orderNumber,
    status: "confirmed",
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: "0",
    total: total.toFixed(2),
    items: JSON.stringify(orderItems),
  });

  // Fetch the newly created order
  const newOrder = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  return newOrder[0];
}

// Get cart items with product details
export async function getCartItemsWithProducts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      productName: products.name,
      productPrice: products.price,
      productImageUrl: products.imageUrl,
      productSlug: products.slug,
      productCategory: categories.name,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(cartItems.userId, userId));
}

// Update cart item quantity
export async function updateCartItemQuantity(
  cartItemId: number,
  quantity: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId));
}

// Get wishlist with product details
export async function getUserWishlistWithProducts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: wishlist.id,
      userId: wishlist.userId,
      productId: wishlist.productId,
      productName: products.name,
      productPrice: products.price,
      productRating: products.rating,
      productReviewCount: products.reviewCount,
      productImageUrl: products.imageUrl,
      productSlug: products.slug,
      categoryName: categories.name,
    })
    .from(wishlist)
    .innerJoin(products, eq(wishlist.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(wishlist.userId, userId));
}

// Create a review
export async function createReview(data: {
  productId: number;
  userId: number;
  orderId: number;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(reviews).values(data);

  // Update product rating
  const allReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, data.productId));

  const avgRating =
    allReviews.reduce(
      (sum: number, r: { rating: number }) => sum + r.rating,
      0
    ) / allReviews.length;

  await db
    .update(products)
    .set({
      rating: avgRating.toFixed(2),
      reviewCount: allReviews.length,
    })
    .where(eq(products.id, data.productId));

  return { success: true };
}

// Get cart item count for a user
export async function getCartItemCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const items = await db
    .select({ quantity: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));

  return items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );
}

// Get products with category info (for wishlist "add all to cart")
export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(and(...ids.map(id => eq(products.id, id))));
}

// Admin: create a product
export async function createProduct(data: {
  sellerId: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  categoryId: number;
  stock: number;
  imageUrl?: string;
  tags?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(products).values(data);
  const result = await db
    .select()
    .from(products)
    .where(eq(products.slug, data.slug))
    .limit(1);
  return result[0];
}

// Admin: update a product
export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    price: string;
    categoryId: number;
    stock: number;
    imageUrl: string;
    tags: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(products).set(data).where(eq(products.id, id));
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0];
}

// Admin: delete a product
export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remove from carts and wishlists first to avoid FK constraint issues
  await db.delete(cartItems).where(eq(cartItems.productId, id));
  await db.delete(wishlist).where(eq(wishlist.productId, id));
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

// Admin: create a category
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(categories).values(data);
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, data.slug))
    .limit(1);
  return result[0];
}

// Admin: get all orders
export async function getAllOrders(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);
}

// Admin: update order status
export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return { success: true };
}

// Get product specifications
export async function getProductSpecifications(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(productSpecifications)
    .where(eq(productSpecifications.productId, productId));
}
