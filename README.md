# ◆ NEXUS — Digital Assets Marketplace

A full-stack digital assets marketplace built with a cyberpunk dark theme. Browse, purchase, and manage digital assets including UI kits, templates, icons, fonts, 3D assets, illustrations, mockups, motion graphics, code snippets, and audio.

---

## ✨ Features

### Storefront

- **Catalog** — Browse 50+ products with real-time filtering by category, price range, and sort order (newest, price, rating)
- **Search** — Full-text search from the navigation bar, synced to catalog URL params
- **Product Detail** — Image gallery, specs, quantity selector, reviews section, rating display
- **Product Comparison** — Side-by-side comparison of up to 4 products with real DB specifications

### Commerce

- **Shopping Cart** — Add/remove/update quantities, live item count badge in nav
- **Checkout** — 2-step flow (shipping → payment), order created in DB, redirects to order confirmation
- **Order Confirmation** — Full order summary with downloadable `.txt` invoice
- **Wishlist** — Save products, add to cart from wishlist page

### User

- **Authentication** — Email/password login and registration with JWT session cookies
- **User Profile** — Purchase history with invoice download, saved items tab
- **Reviews** — Star ratings and comments on product pages

### Admin

- **Dashboard** — Stats overview (products, categories, orders, revenue)
- **Product Management** — Create, edit, delete products
- **Category Management** — Create categories
- **Order Management** — View all orders, update status (pending → confirmed → shipped → delivered → cancelled)

### Static Pages

About, Blog, Careers, Help Center (searchable FAQ), Contact form, FAQ, Privacy Policy, Terms of Service, Cookies Policy

---

## 🛠 Tech Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Frontend         | React 19, TypeScript, Vite 7                      |
| Routing          | Wouter                                            |
| Styling          | Tailwind CSS 4, custom CSS (neon/cyberpunk theme) |
| UI Components    | Radix UI primitives + shadcn/ui                   |
| State / Data     | TanStack Query + tRPC v11                         |
| Backend          | Node.js, Express                                  |
| Database ORM     | Drizzle ORM                                       |
| Database         | MySQL                                             |
| Auth             | JWT (jose) + bcryptjs, `HttpOnly` session cookie  |
| Containerization | Docker + Docker Compose                           |
| Package Manager  | pnpm                                              |
| Testing          | Vitest                                            |

---

## 📁 Project Structure

```
nexus-marketplace/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── _core/hooks/    # useAuth hook
│   │   ├── components/     # Navigation, UI components (shadcn)
│   │   ├── contexts/       # ComparisonContext, ThemeContext
│   │   ├── pages/          # Route pages
│   │   │   └── static/     # About, Blog, Careers, Help, etc.
│   │   └── lib/            # trpc client setup
├── server/                 # Express backend
│   ├── _core/              # Auth, SDK, tRPC context, middleware
│   ├── db.ts               # All DB query functions
│   └── routers.ts          # tRPC router definitions
├── drizzle/                # Schema, migrations, relations
├── scripts/
│   └── seed.ts             # Database seeder (12 users, 50 products, orders, reviews)
├── shared/                 # Shared types and constants
├── docker/                 # MySQL init SQL
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- [Docker](https://www.docker.com/) (for local MySQL) or a MySQL 8 instance

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/nexus-marketplace.git
cd nexus-marketplace
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=mysql://nexus:nexus_pass@localhost:3306/nexus
JWT_SECRET=your_random_secret_at_least_32_chars
APP_ID=app
PORT=3000
NODE_ENV=development
```

### 3. Start the database

```bash
docker-compose up -d
```

This starts a MySQL 8 container on port `3306` with the `nexus` database pre-created.

### 4. Run migrations

```bash
pnpm db:push
```

### 5. Seed the database

```bash
pnpm db:seed
```

This creates:

- 12 users (1 admin + 11 regular users)
- 10 categories
- 50 products with specifications
- Orders, reviews, wishlist, cart items

**Seeded accounts:**

| Email               | Password     | Role  |
| ------------------- | ------------ | ----- |
| `alice@example.com` | `Admin1234!` | Admin |
| `bob@example.com`   | `Bob1234!`   | User  |
| `carol@example.com` | `Carol1234!` | User  |
| `david@example.com` | `David1234!` | User  |

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

```bash
pnpm dev          # Start dev server (frontend + backend, HMR)
pnpm build        # Production build (Vite + esbuild)
pnpm start        # Run production build
pnpm check        # TypeScript type check
pnpm test         # Run Vitest unit tests
pnpm db:push      # Generate and apply DB migrations
pnpm db:seed      # Seed database with sample data
pnpm format       # Prettier format all files
```

---

## 🗄 Database Schema

```
users               — auth, roles (user | admin)
categories          — product categories with slugs
products            — listings with price, rating, stock, tags
productSpecifications — key/value specs per product (Format, Components, etc.)
cartItems           — per-user cart
orders              — order records with JSON item snapshots
reviews             — ratings + comments linked to orders
wishlist            — saved products per user
```

---

## 🔐 Auth Flow

1. `POST /api/auth/register` — hash password with bcrypt, store user with `openId = local:<email>`, set JWT cookie
2. `POST /api/auth/login` — verify password, create JWT, set `HttpOnly; SameSite=Lax` session cookie
3. `trpc.auth.me` — reads cookie, verifies JWT, returns user from DB
4. `POST /api/auth/logout` — clears cookie

Cookies use `SameSite=Lax` on HTTP (localhost) and `SameSite=None; Secure` on HTTPS (production).

---

## 🐳 Docker

```bash
# Start MySQL only
docker-compose up -d

# Stop
docker-compose down

# Stop and remove volumes (wipes DB)
docker-compose down -v
```

The `docker-compose.yml` also includes a full app container for production deployment. Build with:

```bash
docker build -t nexus-marketplace .
```

---

## 🧪 Testing

```bash
pnpm test
```

Unit test coverage includes the `auth.logout` tRPC procedure (`server/auth.logout.test.ts`).

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) — UI component primitives
- [Radix UI](https://www.radix-ui.com/) — accessible component foundations
- [Drizzle ORM](https://orm.drizzle.team/) — type-safe SQL ORM
- [tRPC](https://trpc.io/) — end-to-end type-safe API
- [Lucide](https://lucide.dev/) — icon library
- [Picsum Photos](https://picsum.photos/) — placeholder images for seed data
