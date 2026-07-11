/**
 * Database Seeder — Digital Assets Marketplace
 * Run: pnpm tsx scripts/seed.ts
 *
 * Seeds: users, categories, products, productSpecifications,
 *        orders, cartItems, wishlist, reviews
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import bcrypt from "bcryptjs";
import {
  users,
  categories,
  products,
  orders,
  reviews,
  wishlist,
  cartItems,
  productSpecifications,
} from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL!);

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const fakeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// ─────────────────────────────────────────
// 1. USERS
// ─────────────────────────────────────────
const RAW_USERS = [
  {
    name: "Alice Admin",
    email: "alice@example.com",
    role: "admin" as const,
    password: "Admin1234!",
  },
  {
    name: "Bob Builder",
    email: "bob@example.com",
    role: "user" as const,
    password: "Bob1234!",
  },
  {
    name: "Carol Chen",
    email: "carol@example.com",
    role: "user" as const,
    password: "Carol1234!",
  },
  {
    name: "David Diaz",
    email: "david@example.com",
    role: "user" as const,
    password: "David1234!",
  },
  {
    name: "Eva Eriksson",
    email: "eva@example.com",
    role: "user" as const,
    password: "Eva1234!",
  },
  {
    name: "Frank Ferrer",
    email: "frank@example.com",
    role: "user" as const,
    password: "Frank1234!",
  },
  {
    name: "Grace Gupta",
    email: "grace@example.com",
    role: "user" as const,
    password: "Grace1234!",
  },
  {
    name: "Hiro Hayashi",
    email: "hiro@example.com",
    role: "user" as const,
    password: "Hiro1234!",
  },
  {
    name: "Isla Ibrahim",
    email: "isla@example.com",
    role: "user" as const,
    password: "Isla1234!",
  },
  {
    name: "Jake Jensen",
    email: "jake@example.com",
    role: "user" as const,
    password: "Jake1234!",
  },
  {
    name: "Kira Kim",
    email: "kira@example.com",
    role: "user" as const,
    password: "Kira1234!",
  },
  {
    name: "Liam Lopez",
    email: "liam@example.com",
    role: "user" as const,
    password: "Liam1234!",
  },
];

// ─────────────────────────────────────────
// 2. CATEGORIES
// ─────────────────────────────────────────
const RAW_CATEGORIES = [
  {
    name: "UI Kits",
    description: "Complete UI component kits for web and mobile apps.",
    imageUrl: "https://picsum.photos/seed/uikit/400/300",
  },
  {
    name: "Templates",
    description: "Ready-to-use website and app templates.",
    imageUrl: "https://picsum.photos/seed/template/400/300",
  },
  {
    name: "Icons",
    description: "Premium icon packs in multiple formats.",
    imageUrl: "https://picsum.photos/seed/icons/400/300",
  },
  {
    name: "Fonts",
    description: "Unique typefaces and font families.",
    imageUrl: "https://picsum.photos/seed/fonts/400/300",
  },
  {
    name: "3D Assets",
    description: "High-quality 3D models, scenes, and materials.",
    imageUrl: "https://picsum.photos/seed/3d/400/300",
  },
  {
    name: "Illustrations",
    description: "Beautiful vector and raster illustration packs.",
    imageUrl: "https://picsum.photos/seed/illus/400/300",
  },
  {
    name: "Mockups",
    description: "Photorealistic product and device mockups.",
    imageUrl: "https://picsum.photos/seed/mockup/400/300",
  },
  {
    name: "Motion",
    description: "After Effects templates, Lottie animations, and more.",
    imageUrl: "https://picsum.photos/seed/motion/400/300",
  },
  {
    name: "Code Snippets",
    description: "Reusable code components and utilities.",
    imageUrl: "https://picsum.photos/seed/code/400/300",
  },
  {
    name: "Audio",
    description: "Sound effects, loops, and music tracks.",
    imageUrl: "https://picsum.photos/seed/audio/400/300",
  },
];

// ─────────────────────────────────────────
// 3. PRODUCTS (50 items)
// ─────────────────────────────────────────
const PRODUCT_CATALOG = [
  // UI Kits (cat index 0)
  {
    name: "Neon Dashboard Kit",
    cat: 0,
    price: "49.00",
    desc: "Dark-theme dashboard with 200+ neon components.",
    tags: ["dashboard", "dark", "neon"],
    stock: 999,
  },
  {
    name: "Glassmorphism UI Pack",
    cat: 0,
    price: "39.00",
    desc: "Frosted glass UI components for modern designs.",
    tags: ["glass", "modern", "ui"],
    stock: 999,
  },
  {
    name: "Neumorphism System",
    cat: 0,
    price: "44.00",
    desc: "Soft-shadow neumorphic component library.",
    tags: ["neumorphic", "soft", "system"],
    stock: 999,
  },
  {
    name: "Brutalist UI Kit",
    cat: 0,
    price: "29.00",
    desc: "Bold, raw brutalist design components.",
    tags: ["brutalist", "bold", "raw"],
    stock: 999,
  },
  {
    name: "Material Pro Kit",
    cat: 0,
    price: "55.00",
    desc: "Material Design 3 component kit with full theming.",
    tags: ["material", "google", "pro"],
    stock: 999,
  },
  // Templates (cat index 1)
  {
    name: "Nexus SaaS Template",
    cat: 1,
    price: "79.00",
    desc: "Full SaaS landing page + dashboard template.",
    tags: ["saas", "landing", "dashboard"],
    stock: 999,
  },
  {
    name: "Portfolio Grid",
    cat: 1,
    price: "35.00",
    desc: "Minimal grid portfolio for creatives.",
    tags: ["portfolio", "grid", "minimal"],
    stock: 999,
  },
  {
    name: "E-Commerce Starter",
    cat: 1,
    price: "89.00",
    desc: "Complete e-commerce front-end template.",
    tags: ["ecommerce", "shop", "starter"],
    stock: 999,
  },
  {
    name: "Agency Multipurpose",
    cat: 1,
    price: "65.00",
    desc: "Multi-page agency website template.",
    tags: ["agency", "multipurpose", "web"],
    stock: 999,
  },
  {
    name: "Blog & Magazine",
    cat: 1,
    price: "45.00",
    desc: "Content-rich blog and magazine layout.",
    tags: ["blog", "magazine", "content"],
    stock: 999,
  },
  {
    name: "Startup Landing",
    cat: 1,
    price: "59.00",
    desc: "High-converting startup landing page template.",
    tags: ["startup", "landing", "conversion"],
    stock: 999,
  },
  // Icons (cat index 2)
  {
    name: "Lucid Icon Set 500",
    cat: 2,
    price: "19.00",
    desc: "500 crisp line icons in SVG and PNG.",
    tags: ["icons", "svg", "line"],
    stock: 999,
  },
  {
    name: "Filled Icon Pack 800",
    cat: 2,
    price: "24.00",
    desc: "800 solid filled icons for apps.",
    tags: ["icons", "filled", "app"],
    stock: 999,
  },
  {
    name: "Duotone Icons 400",
    cat: 2,
    price: "29.00",
    desc: "400 two-color duotone icons.",
    tags: ["icons", "duotone", "color"],
    stock: 999,
  },
  {
    name: "3D Icon Collection",
    cat: 2,
    price: "39.00",
    desc: "100 premium 3D icon renders.",
    tags: ["icons", "3d", "premium"],
    stock: 999,
  },
  {
    name: "Emoji Style Icons",
    cat: 2,
    price: "22.00",
    desc: "200 expressive emoji-style icons.",
    tags: ["icons", "emoji", "expressive"],
    stock: 999,
  },
  // Fonts (cat index 3)
  {
    name: "Cyberpunk Display Font",
    cat: 3,
    price: "18.00",
    desc: "Futuristic display font with 4 weights.",
    tags: ["font", "display", "cyberpunk"],
    stock: 999,
  },
  {
    name: "Serene Serif Family",
    cat: 3,
    price: "25.00",
    desc: "Elegant serif family with 8 styles.",
    tags: ["font", "serif", "elegant"],
    stock: 999,
  },
  {
    name: "Mono Code Pro",
    cat: 3,
    price: "15.00",
    desc: "Programmer-optimized monospace font.",
    tags: ["font", "mono", "code"],
    stock: 999,
  },
  {
    name: "Rounded Sans Pack",
    cat: 3,
    price: "20.00",
    desc: "Friendly rounded sans-serif, 6 weights.",
    tags: ["font", "sans", "rounded"],
    stock: 999,
  },
  // 3D Assets (cat index 4)
  {
    name: "Cyberpunk City Scene",
    cat: 4,
    price: "89.00",
    desc: "Detailed 3D cyberpunk cityscape (Blender + OBJ).",
    tags: ["3d", "city", "blender"],
    stock: 999,
  },
  {
    name: "Abstract Geo Shapes",
    cat: 4,
    price: "34.00",
    desc: "50 abstract geometric 3D shapes.",
    tags: ["3d", "abstract", "geometry"],
    stock: 999,
  },
  {
    name: "Product Shelf Scene",
    cat: 4,
    price: "49.00",
    desc: "Clean product display shelf scene.",
    tags: ["3d", "product", "scene"],
    stock: 999,
  },
  {
    name: "Character Avatar Base",
    cat: 4,
    price: "69.00",
    desc: "Rigged character base mesh for customisation.",
    tags: ["3d", "character", "avatar"],
    stock: 999,
  },
  {
    name: "Nature Pack Vol.1",
    cat: 4,
    price: "55.00",
    desc: "Trees, rocks, and ground textures.",
    tags: ["3d", "nature", "environment"],
    stock: 999,
  },
  // Illustrations (cat index 5)
  {
    name: "Isometric Office Pack",
    cat: 5,
    price: "32.00",
    desc: "30 isometric office illustration scenes.",
    tags: ["illustration", "isometric", "office"],
    stock: 999,
  },
  {
    name: "People & Diversity Set",
    cat: 5,
    price: "28.00",
    desc: "40 diverse people vector illustrations.",
    tags: ["illustration", "people", "vector"],
    stock: 999,
  },
  {
    name: "Tech & Device Scenes",
    cat: 5,
    price: "36.00",
    desc: "20 device-in-context illustration scenes.",
    tags: ["illustration", "tech", "device"],
    stock: 999,
  },
  {
    name: "Nature Watercolor Pack",
    cat: 5,
    price: "24.00",
    desc: "50 hand-painted watercolor nature elements.",
    tags: ["illustration", "watercolor", "nature"],
    stock: 999,
  },
  {
    name: "Abstract Art Bundle",
    cat: 5,
    price: "44.00",
    desc: "60 abstract art vector compositions.",
    tags: ["illustration", "abstract", "art"],
    stock: 999,
  },
  // Mockups (cat index 6)
  {
    name: "MacBook Pro Mockup",
    cat: 6,
    price: "16.00",
    desc: 'Photorealistic MacBook Pro 14" mockup set.',
    tags: ["mockup", "macbook", "apple"],
    stock: 999,
  },
  {
    name: "iPhone 15 Mockup Pack",
    cat: 6,
    price: "18.00",
    desc: "25 iPhone 15 mockup angles.",
    tags: ["mockup", "iphone", "mobile"],
    stock: 999,
  },
  {
    name: "Packaging Box Mockups",
    cat: 6,
    price: "22.00",
    desc: "12 product packaging box mockup scenes.",
    tags: ["mockup", "packaging", "box"],
    stock: 999,
  },
  {
    name: "Branding Stationery",
    cat: 6,
    price: "29.00",
    desc: "Complete branding stationery mockup kit.",
    tags: ["mockup", "branding", "stationery"],
    stock: 999,
  },
  {
    name: "Social Media Mockup",
    cat: 6,
    price: "14.00",
    desc: "Instagram, Twitter, and LinkedIn post mockups.",
    tags: ["mockup", "social", "instagram"],
    stock: 999,
  },
  // Motion (cat index 7)
  {
    name: "Logo Reveal AE Pack",
    cat: 7,
    price: "39.00",
    desc: "10 After Effects logo reveal templates.",
    tags: ["motion", "logo", "after-effects"],
    stock: 999,
  },
  {
    name: "Lottie UI Animations",
    cat: 7,
    price: "29.00",
    desc: "50 Lottie JSON micro-interaction animations.",
    tags: ["motion", "lottie", "ui"],
    stock: 999,
  },
  {
    name: "Transition Pack AE",
    cat: 7,
    price: "35.00",
    desc: "40 seamless video transitions for After Effects.",
    tags: ["motion", "transition", "video"],
    stock: 999,
  },
  {
    name: "Glitch FX Bundle",
    cat: 7,
    price: "45.00",
    desc: "Glitch and distortion effects for video editors.",
    tags: ["motion", "glitch", "fx"],
    stock: 999,
  },
  // Code Snippets (cat index 8)
  {
    name: "React Hook Collection",
    cat: 8,
    price: "12.00",
    desc: "30 production-ready custom React hooks.",
    tags: ["react", "hooks", "typescript"],
    stock: 999,
  },
  {
    name: "CSS Animation Library",
    cat: 8,
    price: "9.00",
    desc: "100 pure CSS animation snippets.",
    tags: ["css", "animation", "snippets"],
    stock: 999,
  },
  {
    name: "Tailwind Components Kit",
    cat: 8,
    price: "19.00",
    desc: "50 copy-paste Tailwind component patterns.",
    tags: ["tailwind", "components", "kit"],
    stock: 999,
  },
  {
    name: "Node.js Utilities Pack",
    cat: 8,
    price: "14.00",
    desc: "Utility functions for Node.js backends.",
    tags: ["nodejs", "utils", "backend"],
    stock: 999,
  },
  {
    name: "TypeScript Types Pack",
    cat: 8,
    price: "11.00",
    desc: "Reusable TypeScript type definitions.",
    tags: ["typescript", "types", "utils"],
    stock: 999,
  },
  // Audio (cat index 9)
  {
    name: "Ambient Loop Pack",
    cat: 9,
    price: "22.00",
    desc: "20 seamless ambient background loops.",
    tags: ["audio", "ambient", "loop"],
    stock: 999,
  },
  {
    name: "UI Sound Effects 200",
    cat: 9,
    price: "18.00",
    desc: "200 UI click, hover, and notification sounds.",
    tags: ["audio", "sfx", "ui"],
    stock: 999,
  },
  {
    name: "Epic Trailer Music",
    cat: 9,
    price: "35.00",
    desc: "5 cinematic trailer music tracks.",
    tags: ["audio", "music", "cinematic"],
    stock: 999,
  },
  {
    name: "Podcast Intro Pack",
    cat: 9,
    price: "28.00",
    desc: "10 professional podcast intro and outro tracks.",
    tags: ["audio", "podcast", "intro"],
    stock: 999,
  },
  {
    name: "Chillhop Beats Vol.1",
    cat: 9,
    price: "20.00",
    desc: "8 lo-fi chill-hop background tracks.",
    tags: ["audio", "lofi", "beats"],
    stock: 999,
  },
  {
    name: "Game SFX Bundle",
    cat: 9,
    price: "32.00",
    desc: "300 game sound effects — UI, combat, ambient.",
    tags: ["audio", "sfx", "game"],
    stock: 999,
  },
];

// ─────────────────────────────────────────
// 4. PRODUCT SPECIFICATIONS per category
// ─────────────────────────────────────────
const SPECS_BY_CAT: Record<number, { key: string; val: () => string }[]> = {
  0: [
    // UI Kits
    {
      key: "Format",
      val: () => pick(["Figma", "Sketch", "Adobe XD", "Figma + Sketch"]),
    },
    { key: "Components", val: () => `${rand(80, 400)}+` },
    { key: "Dark Mode", val: () => pick(["Yes", "No"]) },
    { key: "Responsive", val: () => "Yes" },
    { key: "Last Updated", val: () => "2025" },
  ],
  1: [
    // Templates
    {
      key: "Framework",
      val: () => pick(["React", "Next.js", "Vue", "HTML/CSS"]),
    },
    { key: "Pages", val: () => `${rand(5, 30)}` },
    {
      key: "CSS",
      val: () => pick(["Tailwind CSS", "CSS Modules", "Styled Components"]),
    },
    { key: "Responsive", val: () => "Yes" },
    { key: "Browser Support", val: () => "Chrome, Firefox, Safari, Edge" },
  ],
  2: [
    // Icons
    { key: "Total Icons", val: () => `${rand(100, 1000)}` },
    {
      key: "Formats",
      val: () => pick(["SVG, PNG", "SVG, PNG, WebP", "SVG, Figma"]),
    },
    { key: "Sizes", val: () => "16px, 24px, 32px, 64px" },
    { key: "Style", val: () => pick(["Line", "Filled", "Duotone", "Outline"]) },
    { key: "License", val: () => "Commercial & Personal" },
  ],
  3: [
    // Fonts
    { key: "Weights", val: () => `${rand(2, 9)}` },
    {
      key: "Styles",
      val: () => pick(["Regular, Bold", "Regular, Italic, Bold", "All styles"]),
    },
    { key: "Formats", val: () => "OTF, TTF, WOFF, WOFF2" },
    { key: "Characters", val: () => `${rand(200, 800)}+` },
    {
      key: "Language Support",
      val: () => pick(["Latin", "Latin + Cyrillic", "Latin + Greek"]),
    },
  ],
  4: [
    // 3D Assets
    {
      key: "Software",
      val: () => pick(["Blender", "Cinema 4D", "Maya", "Blender + OBJ"]),
    },
    { key: "Polygons", val: () => `${rand(10, 500)}K` },
    {
      key: "Textures",
      val: () => pick(["Yes — 4K", "Yes — 2K", "PBR Textures"]),
    },
    {
      key: "File Formats",
      val: () => pick(["OBJ, FBX", "BLEND, OBJ, FBX", "GLB, GLTF"]),
    },
    { key: "Rigged", val: () => pick(["Yes", "No"]) },
  ],
  5: [
    // Illustrations
    { key: "Format", val: () => pick(["SVG", "SVG, PNG", "AI, SVG, PNG"]) },
    { key: "Scenes", val: () => `${rand(10, 80)}` },
    {
      key: "Style",
      val: () => pick(["Flat", "Isometric", "Watercolor", "Hand-drawn"]),
    },
    { key: "Editable", val: () => "Yes" },
    { key: "License", val: () => "Commercial Use" },
  ],
  6: [
    // Mockups
    { key: "Format", val: () => pick(["PSD", "PSD, Figma", "Sketch, PSD"]) },
    {
      key: "Resolution",
      val: () => pick(["3000×2000px", "4000×3000px", "5000×3500px"]),
    },
    { key: "Smart Object", val: () => "Yes" },
    { key: "DPI", val: () => "300 DPI" },
    { key: "Scenes", val: () => `${rand(5, 30)}` },
  ],
  7: [
    // Motion
    {
      key: "Software",
      val: () => pick(["After Effects CC", "Premiere Pro", "DaVinci Resolve"]),
    },
    { key: "Resolution", val: () => pick(["1080p", "4K", "1080p + 4K"]) },
    { key: "Duration", val: () => `${rand(3, 30)}s each` },
    { key: "FPS", val: () => pick(["24fps", "30fps", "60fps"]) },
    { key: "Audio", val: () => pick(["Included", "Not included"]) },
  ],
  8: [
    // Code Snippets
    {
      key: "Language",
      val: () => pick(["TypeScript", "JavaScript", "TypeScript + JS"]),
    },
    {
      key: "Framework",
      val: () => pick(["React", "Vue", "Framework-agnostic", "Node.js"]),
    },
    { key: "Tests", val: () => pick(["Included", "Not included"]) },
    {
      key: "Documentation",
      val: () => pick(["Full JSDoc", "README", "Inline comments"]),
    },
    { key: "License", val: () => "MIT" },
  ],
  9: [
    // Audio
    { key: "Format", val: () => pick(["MP3, WAV", "WAV", "MP3, WAV, AIFF"]) },
    {
      key: "Quality",
      val: () => pick(["320kbps MP3", "44.1kHz/16-bit WAV", "192kbps MP3"]),
    },
    { key: "BPM", val: () => `${rand(60, 180)}` },
    { key: "License", val: () => "Royalty-free" },
    { key: "Loops", val: () => pick(["Seamless", "Non-looping", "Both"]) },
  ],
};

// ─────────────────────────────────────────
// 5. REVIEW CONTENT
// ─────────────────────────────────────────
const REVIEW_TITLES = [
  "Absolutely worth every penny!",
  "Saved me hours of work",
  "Top notch quality",
  "Highly recommended",
  "Exactly what I needed",
  "Clean and well organised",
  "Great value for money",
  "Professional and polished",
  "Would buy again",
  "Exceeded my expectations",
  "Good but could be better",
  "Decent quality overall",
  "Solid purchase",
  "Pretty good product",
  "Nice but a bit pricey",
];

const REVIEW_COMMENTS = [
  "This product saved me so much time on my latest project. The quality is outstanding.",
  "Really impressed with the level of detail. Every component is well thought out.",
  "Clean, modern design. Easy to customise for my specific needs.",
  "The documentation is thorough and easy to follow. 10/10 would recommend.",
  "Great value for the price. I've already used it in three different projects.",
  "Top quality assets. The attention to detail is noticeable throughout.",
  "Very well organised files. Makes integration into existing projects simple.",
  "Fantastic product. My clients were very impressed with the final result.",
  "Good quality but I wish there were more variety in some areas.",
  "Decent product overall. Does the job well enough for my needs.",
  "Nice quality. The design system is consistent and easy to extend.",
  "Solid purchase. Will definitely be back for more products from this seller.",
  "Really good. The included documentation made everything straightforward.",
  "Excellent resource. Already using it as a base for multiple client projects.",
  "Quality is great. Took a day to go through everything but well worth it.",
];

// ─────────────────────────────────────────
// 6. MAIN SEED FUNCTION
// ─────────────────────────────────────────
async function seed() {
  console.log("🌱 Starting seed...\n");

  // ── Cleanup existing data (order matters for FK constraints) ──
  console.log("🧹 Clearing existing data...");
  await db.delete(productSpecifications);
  await db.delete(reviews);
  await db.delete(wishlist);
  await db.delete(cartItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);
  console.log("   ✔ All tables cleared\n");

  // ── Users ──────────────────────────────
  console.log("👤 Seeding users...");
  const insertedUserIds: number[] = [];

  for (const u of RAW_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const openId = `local:${u.email}`; // must match format used by /api/auth/login
    await db.insert(users).values({
      openId,
      name: u.name,
      email: u.email,
      loginMethod: "local",
      passwordHash,
      role: u.role,
      lastSignedIn: fakeDate(rand(0, 30)),
    });
  }

  const allUsers = await db
    .select({ id: users.id, role: users.role })
    .from(users);
  const adminUser = allUsers.find(u => u.role === "admin")!;
  const regularUsers = allUsers.filter(u => u.role === "user");
  allUsers.forEach(u => insertedUserIds.push(u.id));

  console.log(`   ✔ ${allUsers.length} users inserted`);

  // ── Categories ─────────────────────────
  console.log("📁 Seeding categories...");
  for (const c of RAW_CATEGORIES) {
    await db.insert(categories).values({
      name: c.name,
      slug: slug(c.name),
      description: c.description,
      imageUrl: c.imageUrl,
    });
  }
  const allCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories);
  const catIdByIndex = allCategories.map(c => c.id);
  console.log(`   ✔ ${allCategories.length} categories inserted`);

  // ── Products ───────────────────────────
  console.log("📦 Seeding products...");
  const insertedProductIds: number[] = [];

  for (let i = 0; i < PRODUCT_CATALOG.length; i++) {
    const p = PRODUCT_CATALOG[i];
    const catId = catIdByIndex[p.cat];
    const rating = (rand(35, 50) / 10).toFixed(2);
    const reviewCount = rand(12, 340);

    await db.insert(products).values({
      sellerId: adminUser.id,
      name: p.name,
      slug: slug(p.name),
      description: p.desc,
      price: p.price,
      categoryId: catId,
      imageUrl: `https://picsum.photos/seed/${slug(p.name)}/600/450`,
      imageUrls: JSON.stringify([
        `https://picsum.photos/seed/${slug(p.name)}a/600/450`,
        `https://picsum.photos/seed/${slug(p.name)}b/600/450`,
        `https://picsum.photos/seed/${slug(p.name)}c/600/450`,
      ]),
      tags: JSON.stringify(p.tags),
      stock: p.stock,
      rating,
      reviewCount,
    });
  }

  const allProducts = await db
    .select({ id: products.id, categoryId: products.categoryId })
    .from(products);
  allProducts.forEach(p => insertedProductIds.push(p.id));
  console.log(`   ✔ ${allProducts.length} products inserted`);

  // ── Product Specifications ─────────────
  console.log("📋 Seeding product specifications...");
  let specCount = 0;

  for (const product of allProducts) {
    // Map category id back to index
    const catIndex = catIdByIndex.indexOf(product.categoryId);
    const specDefs = SPECS_BY_CAT[catIndex] ?? SPECS_BY_CAT[0];
    for (const def of specDefs) {
      await db.insert(productSpecifications).values({
        productId: product.id,
        specKey: def.key,
        specValue: def.val(),
      });
      specCount++;
    }
  }
  console.log(`   ✔ ${specCount} specifications inserted`);

  // ── Orders ─────────────────────────────
  console.log("🛒 Seeding orders...");
  const ORDER_STATUSES: Array<
    "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  > = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  const insertedOrderIds: number[] = [];

  for (const user of regularUsers) {
    const orderCount = rand(1, 5);
    for (let o = 0; o < orderCount; o++) {
      const itemCount = rand(1, 4);
      const pickedProducts = [...insertedProductIds]
        .sort(() => Math.random() - 0.5)
        .slice(0, itemCount);
      const orderItems = pickedProducts.map(pid => {
        const pCatalog =
          PRODUCT_CATALOG[insertedProductIds.indexOf(pid)] ??
          PRODUCT_CATALOG[0];
        return {
          productId: pid,
          productName: pCatalog.name,
          quantity: rand(1, 3),
          price: pCatalog.price,
        };
      });
      const subtotal = orderItems.reduce(
        (s, i) => s + parseFloat(i.price) * i.quantity,
        0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const orderNumber = `ORD-${Date.now()}-${rand(10000, 99999)}`;

      await db.insert(orders).values({
        userId: user.id,
        orderNumber,
        status: pick(ORDER_STATUSES),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: "0.00",
        total: total.toFixed(2),
        items: JSON.stringify(orderItems),
      });
    }
  }

  const allOrders = await db
    .select({ id: orders.id, userId: orders.userId })
    .from(orders);
  allOrders.forEach(o => insertedOrderIds.push(o.id));
  console.log(`   ✔ ${allOrders.length} orders inserted`);

  // ── Reviews ────────────────────────────
  console.log("⭐ Seeding reviews...");
  let reviewCount = 0;
  const reviewedPairs = new Set<string>();

  for (const product of allProducts) {
    const numReviews = rand(3, 10);
    const shuffledUsers = [...regularUsers]
      .sort(() => Math.random() - 0.5)
      .slice(0, numReviews);

    for (const user of shuffledUsers) {
      const pairKey = `${user.id}-${product.id}`;
      if (reviewedPairs.has(pairKey)) continue;
      reviewedPairs.add(pairKey);

      const userOrders = allOrders.filter(o => o.userId === user.id);
      const orderId =
        userOrders.length > 0 ? pick(userOrders).id : insertedOrderIds[0];

      await db.insert(reviews).values({
        productId: product.id,
        userId: user.id,
        orderId,
        rating: rand(3, 5),
        title: pick(REVIEW_TITLES),
        comment: pick(REVIEW_COMMENTS),
        helpful: rand(0, 45),
      });
      reviewCount++;
    }
  }
  console.log(`   ✔ ${reviewCount} reviews inserted`);

  // ── Wishlist ───────────────────────────
  console.log("❤️  Seeding wishlist...");
  let wishlistCount = 0;
  const wishlistPairs = new Set<string>();

  for (const user of regularUsers) {
    const numWishes = rand(3, 10);
    const pickedProducts = [...insertedProductIds]
      .sort(() => Math.random() - 0.5)
      .slice(0, numWishes);

    for (const pid of pickedProducts) {
      const pairKey = `${user.id}-${pid}`;
      if (wishlistPairs.has(pairKey)) continue;
      wishlistPairs.add(pairKey);

      await db.insert(wishlist).values({ userId: user.id, productId: pid });
      wishlistCount++;
    }
  }
  console.log(`   ✔ ${wishlistCount} wishlist items inserted`);

  // ── Cart Items ─────────────────────────
  console.log("🛍️  Seeding cart items...");
  let cartCount = 0;
  const cartPairs = new Set<string>();

  for (const user of regularUsers.slice(0, 6)) {
    const numCartItems = rand(2, 6);
    const pickedProducts = [...insertedProductIds]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCartItems);

    for (const pid of pickedProducts) {
      const pairKey = `${user.id}-${pid}`;
      if (cartPairs.has(pairKey)) continue;
      cartPairs.add(pairKey);

      await db.insert(cartItems).values({
        userId: user.id,
        productId: pid,
        quantity: rand(1, 3),
      });
      cartCount++;
    }
  }
  console.log(`   ✔ ${cartCount} cart items inserted`);

  // ── Done ───────────────────────────────
  console.log("\n✅ Seed complete!");
  console.log(`   Users:          ${allUsers.length}`);
  console.log(`   Categories:     ${allCategories.length}`);
  console.log(`   Products:       ${allProducts.length}`);
  console.log(`   Specifications: ${specCount}`);
  console.log(`   Orders:         ${allOrders.length}`);
  console.log(`   Reviews:        ${reviewCount}`);
  console.log(`   Wishlist items: ${wishlistCount}`);
  console.log(`   Cart items:     ${cartCount}`);
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
