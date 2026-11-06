import { eq, like, and, gte, lte, desc, asc, sql } from "drizzle-orm";
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
let _schemaInitialized = false;

async function ensureTablesExist(db: ReturnType<typeof drizzle>) {
  if (_schemaInitialized) return;
  _schemaInitialized = true;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`openId\` varchar(64) NOT NULL,
        \`name\` text,
        \`email\` varchar(320),
        \`loginMethod\` varchar(64),
        \`passwordHash\` text,
        \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        \`lastSignedIn\` timestamp NOT NULL DEFAULT (now()),
        CONSTRAINT \`users_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`users_openId_unique\` UNIQUE(\`openId\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`description\` text,
        \`imageUrl\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`categories_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`categories_slug_unique\` UNIQUE(\`slug\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`sellerId\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`description\` text,
        \`price\` decimal(10,2) NOT NULL,
        \`categoryId\` int NOT NULL,
        \`imageUrl\` text,
        \`imageUrls\` text,
        \`tags\` text,
        \`stock\` int NOT NULL DEFAULT 0,
        \`fileUrl\` text,
        \`fileSize\` varchar(64),
        \`demoUrl\` text,
        \`rating\` decimal(3,2) DEFAULT '0',
        \`reviewCount\` int NOT NULL DEFAULT 0,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`products_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`products_slug_unique\` UNIQUE(\`slug\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`cartItems\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`userId\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`quantity\` int NOT NULL DEFAULT 1,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`cartItems_id\` PRIMARY KEY(\`id\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`userId\` int NOT NULL,
        \`orderNumber\` varchar(64) NOT NULL,
        \`status\` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
        \`subtotal\` decimal(10,2) NOT NULL,
        \`tax\` decimal(10,2) DEFAULT '0',
        \`shipping\` decimal(10,2) DEFAULT '0',
        \`discountAmount\` decimal(10,2) DEFAULT '0',
        \`couponCode\` varchar(64),
        \`customerName\` varchar(255),
        \`customerEmail\` varchar(320),
        \`shippingAddress\` text,
        \`paymentMethod\` varchar(64),
        \`total\` decimal(10,2) NOT NULL,
        \`items\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`orders_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`orders_orderNumber_unique\` UNIQUE(\`orderNumber\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`productId\` int NOT NULL,
        \`userId\` int NOT NULL,
        \`orderId\` int NOT NULL,
        \`rating\` int NOT NULL,
        \`title\` varchar(255),
        \`comment\` text,
        \`helpful\` int NOT NULL DEFAULT 0,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`reviews_id\` PRIMARY KEY(\`id\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`wishlist\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`userId\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        CONSTRAINT \`wishlist_id\` PRIMARY KEY(\`id\`)
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`productSpecifications\` (
        \`id\` int AUTO_INCREMENT NOT NULL,
        \`productId\` int NOT NULL,
        \`specKey\` varchar(255) NOT NULL,
        \`specValue\` text NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT (now()),
        \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`productSpecifications_id\` PRIMARY KEY(\`id\`)
      )
    `);

    // Safe column additions for existing MySQL databases
    const safeAlter = async (query: string) => {
      try {
        await db.execute(sql.raw(query));
      } catch (err) {
        // Silently ignore duplicate column error
      }
    };
    await safeAlter("ALTER TABLE `products` ADD COLUMN `fileUrl` text");
    await safeAlter("ALTER TABLE `products` ADD COLUMN `fileSize` varchar(64)");
    await safeAlter("ALTER TABLE `products` ADD COLUMN `demoUrl` text");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `customerName` varchar(255)");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `customerEmail` varchar(320)");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `shippingAddress` text");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `paymentMethod` varchar(64)");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `discountAmount` decimal(10,2) DEFAULT '0'");
    await safeAlter("ALTER TABLE `orders` ADD COLUMN `couponCode` varchar(64)");
  } catch (e) {
    console.warn("[Database] Schema check notice:", e);
  }
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
      await ensureTablesExist(_db);
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

// Create order from cart items with stock validation, coupon discounts, and customer billing info
export type CreateOrderOptions = {
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  couponCode?: string;
  discountAmount?: number;
};

export async function createOrder(userId: number, options?: CreateOrderOptions) {
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
      productStock: products.stock,
      productFileUrl: products.fileUrl,
      productSlug: products.slug,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

  if (userCartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // 1. Stock verification
  for (const item of userCartItems) {
    if (item.productStock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${item.productName}". Available: ${item.productStock}, Requested: ${item.quantity}`
      );
    }
  }

  // 2. Decrement product stock
  for (const item of userCartItems) {
    await db
      .update(products)
      .set({ stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})` })
      .where(eq(products.id, item.productId));
  }

  const subtotal = userCartItems.reduce(
    (sum: number, item) => sum + parseFloat(item.productPrice) * item.quantity,
    0
  );

  const discountAmount = Math.min(
    subtotal,
    Math.max(0, options?.discountAmount || 0)
  );
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.1;
  const total = discountedSubtotal + tax;

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const orderItems = userCartItems.map(item => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: item.productPrice,
    slug: item.productSlug,
    fileUrl: item.productFileUrl || null,
  }));

  await db.insert(orders).values({
    userId,
    orderNumber,
    status: "confirmed",
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    couponCode: options?.couponCode || null,
    tax: tax.toFixed(2),
    shipping: "0",
    total: total.toFixed(2),
    customerName: options?.customerName || null,
    customerEmail: options?.customerEmail || null,
    shippingAddress: options?.shippingAddress || null,
    paymentMethod: options?.paymentMethod || "Credit Card (Simulated)",
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
      productStock: products.stock,
      productFileUrl: products.fileUrl,
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

// Check if a user has purchased a product
export async function hasUserPurchasedProduct(
  userId: number,
  productId: number
): Promise<{ purchased: boolean; orderId: number }> {
  const db = await getDb();
  if (!db) return { purchased: false, orderId: 0 };

  const userOrders = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), sql`${orders.status} != 'cancelled'`));

  for (const ord of userOrders) {
    try {
      const items = JSON.parse(ord.items || "[]");
      if (items.some((it: any) => it.productId === productId)) {
        return { purchased: true, orderId: ord.id };
      }
    } catch {
      // ignore JSON parse error
    }
  }

  return { purchased: false, orderId: 0 };
}

// Download digital asset with ownership verification
export async function getDownloadAsset(
  userId: number,
  userRole: string | undefined,
  orderNumber: string,
  productId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const orderList = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (orderList.length === 0) {
    throw new Error("Order not found");
  }

  const order = orderList[0];
  if (order.userId !== userId && userRole !== "admin") {
    throw new Error("Unauthorized: This order does not belong to your account.");
  }

  if (order.status === "cancelled") {
    throw new Error("Cannot download assets for a cancelled order.");
  }

  const items = JSON.parse(order.items || "[]");
  const item = items.find((it: any) => it.productId === productId);
  if (!item) {
    throw new Error("Product was not found in this order.");
  }

  const productList = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  const product = productList[0];
  const fileUrl = product?.fileUrl || item.fileUrl;

  return {
    success: true,
    productName: product?.name || item.productName,
    fileName: `${(product?.slug || "nexus-asset")}.zip`,
    fileUrl: fileUrl || null,
    fileSize: product?.fileSize || "48.5 MB",
    licenseKey: `NX-LIC-${order.orderNumber.replace(/[^A-Z0-9]/gi, "").slice(-8)}-${productId}`,
    purchasedAt: order.createdAt,
  };
}

// Create a review with purchase verification
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

  // Verify ownership
  const purchase = await hasUserPurchasedProduct(data.userId, data.productId);
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.id, data.userId))
    .limit(1);
  const user = userList[0];

  if (!purchase.purchased && user?.role !== "admin") {
    throw new Error(
      "Verified Purchase Required: You must purchase this digital asset before writing a review."
    );
  }

  const resolvedOrderId =
    data.orderId > 0 ? data.orderId : purchase.orderId || 1;

  await db.insert(reviews).values({
    ...data,
    orderId: resolvedOrderId,
  });

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
  fileUrl?: string;
  fileSize?: string;
  demoUrl?: string;
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
    fileUrl: string;
    fileSize: string;
    demoUrl: string;
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
