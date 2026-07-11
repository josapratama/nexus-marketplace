import Navigation from "@/components/Navigation";
import { useLocation, useSearch } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Grid3x3,
  List,
  ChevronDown,
  Scale,
  ShoppingCart,
} from "lucide-react";
import { useComparison } from "@/contexts/ComparisonContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import type { Product } from "../../../drizzle/schema";

export default function Catalog() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const { addToComparison, isInComparison, canAddMore } = useComparison();
  const { isAuthenticated } = useAuth();

  // Parse URL query params
  const urlParams = new URLSearchParams(searchParams);
  const urlSearch = urlParams.get("search") || "";
  const urlCategory = urlParams.get("category") || "";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "rating"
  >("newest");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  // Validate price range: ensure min <= max
  const effectiveMin = Math.min(minPrice, maxPrice);
  const effectiveMax = Math.max(minPrice, maxPrice);

  // Fetch categories from API
  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Set category from URL param once categories are loaded
  useEffect(() => {
    if (urlCategory && categories.length > 0) {
      const matched = categories.find(
        c =>
          c.slug === urlCategory ||
          c.name.toLowerCase() === urlCategory.toLowerCase()
      );
      if (matched) setSelectedCategoryId(matched.id);
    }
  }, [urlCategory, categories]);

  // Sync search from URL
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  // Fetch products from API
  const { data: productsData = [], isLoading } = trpc.products.list.useQuery({
    search: searchQuery || undefined,
    categoryId: selectedCategoryId ?? undefined,
    minPrice: effectiveMin > 0 ? effectiveMin : undefined,
    maxPrice: effectiveMax < 500 ? effectiveMax : undefined,
    sort: sortBy,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => toast.success("Added to cart!"),
    onError: () => toast.error("Failed to add to cart"),
  });

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  // Reset to page 0 when filters change
  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(0);
  };
  const handleSortChange = (val: typeof sortBy) => {
    setSortBy(val);
    setPage(0);
  };
  const handleMinPrice = (val: number) => {
    setMinPrice(val);
    setPage(0);
  };
  const handleMaxPrice = (val: number) => {
    setMaxPrice(val);
    setPage(0);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#ff006e",
              marginBottom: "0.5rem",
            }}
            className="neon-glow-pink"
          >
            PRODUCT CATALOG
          </h1>
          <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>
            {isLoading
              ? "Loading products..."
              : `Browsing ${productsData.length} products`}
          </p>
        </div>

        {/* Controls Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  viewMode === "grid" ? "#ff006e" : "transparent",
                color: viewMode === "grid" ? "#0a0e27" : "#00f5ff",
                border: `1px solid ${viewMode === "grid" ? "#ff006e" : "#00f5ff"}`,
                borderRadius: "0.35rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Grid3x3 size={18} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  viewMode === "list" ? "#ff006e" : "transparent",
                color: viewMode === "list" ? "#0a0e27" : "#00f5ff",
                border: `1px solid ${viewMode === "list" ? "#ff006e" : "#00f5ff"}`,
                borderRadius: "0.35rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <List size={18} />
              List
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value as typeof sortBy)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#1a1f3a",
                color: "#00f5ff",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                color: "#00f5ff",
                border: "1px solid #00f5ff",
                borderRadius: "0.35rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Filters
              <ChevronDown
                size={18}
                style={{
                  transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showFilters ? "250px 1fr" : "1fr",
            gap: "2rem",
          }}
        >
          {/* Filters Sidebar */}
          {showFilters && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* Categories Filter */}
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#00f5ff",
                    marginBottom: "1rem",
                  }}
                >
                  CATEGORIES
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    onClick={() => handleCategoryChange(null)}
                    style={{
                      textAlign: "left",
                      padding: "0.5rem",
                      backgroundColor:
                        selectedCategoryId === null
                          ? "rgba(255, 0, 110, 0.2)"
                          : "transparent",
                      color:
                        selectedCategoryId === null ? "#ff006e" : "#00f5ff",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      borderRadius: "0.35rem",
                    }}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      style={{
                        textAlign: "left",
                        padding: "0.5rem",
                        backgroundColor:
                          selectedCategoryId === cat.id
                            ? "rgba(255, 0, 110, 0.2)"
                            : "transparent",
                        color:
                          selectedCategoryId === cat.id ? "#ff006e" : "#00f5ff",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        borderRadius: "0.35rem",
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#00f5ff",
                    marginBottom: "1rem",
                  }}
                >
                  PRICE RANGE
                </h3>
                {effectiveMin > effectiveMax && (
                  <p
                    style={{
                      color: "#ff006e",
                      fontSize: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Min cannot exceed Max
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Min: ${minPrice}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={minPrice}
                      onChange={e => handleMinPrice(Number(e.target.value))}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Max: ${maxPrice}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={maxPrice}
                      onChange={e => handleMaxPrice(Number(e.target.value))}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(500);
                      setPage(0);
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "transparent",
                      color: "rgba(0, 245, 255, 0.5)",
                      border: "1px solid rgba(0, 245, 255, 0.3)",
                      borderRadius: "0.35rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div>
            {/* Loading skeleton */}
            {isLoading && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    viewMode === "grid"
                      ? "repeat(auto-fill, minmax(250px, 1fr))"
                      : "1fr",
                  gap: "1.5rem",
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: viewMode === "grid" ? "300px" : "120px",
                      backgroundColor: "rgba(26, 31, 58, 0.5)",
                      borderRadius: "0.35rem",
                      border: "1px solid #2a2f4a",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                ))}
              </div>
            )}

            {!isLoading && productsData.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(0, 245, 255, 0.6)",
                }}
              >
                <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setMinPrice(0);
                    setMaxPrice(500);
                    setSearchQuery("");
                    setPage(0);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "transparent",
                    color: "#ff006e",
                    border: "1px solid #ff006e",
                    borderRadius: "0.35rem",
                    cursor: "pointer",
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!isLoading &&
              productsData.length > 0 &&
              (viewMode === "grid" ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {productsData.map((product: Product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      style={{ cursor: "pointer", position: "relative" }}
                    >
                      <div
                        style={{
                          aspectRatio: "1",
                          backgroundColor: "rgba(255, 0, 110, 0.1)",
                          position: "relative",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Zap
                            style={{
                              width: "48px",
                              height: "48px",
                              color: "rgba(255, 0, 110, 0.3)",
                            }}
                          />
                        )}
                        {/* Compare button */}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (isInComparison(product.id)) {
                              addToComparison({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                rating: product.rating ?? "0",
                                category: String(product.categoryId),
                                image: product.imageUrl ?? "",
                              });
                            } else if (canAddMore()) {
                              addToComparison({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                rating: product.rating ?? "0",
                                category: String(product.categoryId),
                                image: product.imageUrl ?? "",
                              });
                            } else {
                              toast.error("Max 4 products for comparison");
                            }
                          }}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            padding: "6px",
                            backgroundColor: isInComparison(product.id)
                              ? "#ff006e"
                              : "rgba(0, 245, 255, 0.2)",
                            border: `1px solid ${isInComparison(product.id) ? "#ff006e" : "#00f5ff"}`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={
                            isInComparison(product.id)
                              ? "Remove from comparison"
                              : canAddMore()
                                ? "Add to comparison"
                                : "Max 4 products"
                          }
                        >
                          <Scale
                            size={14}
                            color={
                              isInComparison(product.id) ? "#0a0e27" : "#00f5ff"
                            }
                          />
                        </button>
                      </div>
                      <div
                        style={{
                          padding: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <h3
                          style={{
                            fontWeight: 700,
                            color: "#00f5ff",
                            fontSize: "0.875rem",
                          }}
                        >
                          {product.name}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{ color: "#ff006e", fontWeight: 700 }}
                            className="neon-glow-pink"
                          >
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              color: "#00f5ff",
                              fontSize: "0.75rem",
                            }}
                          >
                            <span>★</span>
                            <span>
                              {parseFloat(product.rating ?? "0").toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={e => handleAddToCart(e, product.id)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            backgroundColor: "rgba(255, 0, 110, 0.15)",
                            color: "#ff006e",
                            border: "1px solid #ff006e",
                            borderRadius: "0.35rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "#ff006e";
                            e.currentTarget.style.color = "#0a0e27";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(255, 0, 110, 0.15)";
                            e.currentTarget.style.color = "#ff006e";
                          }}
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {productsData.map((product: Product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        padding: "1rem",
                        backgroundColor: "#1a1f3a",
                        border: "1px solid #2a2f4a",
                        borderRadius: "0.35rem",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        position: "relative",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#ff006e";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(255, 0, 110, 0.3)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#2a2f4a";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                          backgroundColor: "rgba(255, 0, 110, 0.1)",
                          borderRadius: "0.35rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Zap
                            style={{
                              width: "48px",
                              height: "48px",
                              color: "rgba(255, 0, 110, 0.3)",
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div>
                          <h3
                            style={{
                              fontWeight: 700,
                              color: "#00f5ff",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(0, 245, 255, 0.4)",
                            }}
                          >
                            {product.description?.slice(0, 100)}
                            {product.description &&
                            product.description.length > 100
                              ? "..."
                              : ""}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2rem",
                          }}
                        >
                          <span
                            style={{
                              color: "#ff006e",
                              fontWeight: 700,
                              fontSize: "1.125rem",
                            }}
                            className="neon-glow-pink"
                          >
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color: "#00f5ff",
                            }}
                          >
                            <span>
                              ★ {parseFloat(product.rating ?? "0").toFixed(1)}
                            </span>
                            <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>
                              ({product.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={e => handleAddToCart(e, product.id)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "rgba(255, 0, 110, 0.15)",
                            color: "#ff006e",
                            border: "1px solid #ff006e",
                            borderRadius: "0.35rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "#ff006e";
                            e.currentTarget.style.color = "#0a0e27";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(255, 0, 110, 0.15)";
                            e.currentTarget.style.color = "#ff006e";
                          }}
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (isInComparison(product.id) || canAddMore()) {
                              addToComparison({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                rating: product.rating ?? "0",
                                category: String(product.categoryId),
                                image: product.imageUrl ?? "",
                              });
                            } else {
                              toast.error("Max 4 products for comparison");
                            }
                          }}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: isInComparison(product.id)
                              ? "#ff006e"
                              : "transparent",
                            color: isInComparison(product.id)
                              ? "#0a0e27"
                              : canAddMore()
                                ? "#00f5ff"
                                : "rgba(0, 245, 255, 0.4)",
                            border: `1px solid ${isInComparison(product.id) ? "#ff006e" : canAddMore() ? "#00f5ff" : "rgba(0, 245, 255, 0.3)"}`,
                            borderRadius: "0.35rem",
                            cursor:
                              isInComparison(product.id) || canAddMore()
                                ? "pointer"
                                : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          <Scale size={14} />
                          Compare
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* Pagination */}
            {!isLoading && productsData.length === PAGE_SIZE && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "transparent",
                    color: page === 0 ? "rgba(0, 245, 255, 0.3)" : "#00f5ff",
                    border: `1px solid ${page === 0 ? "rgba(0, 245, 255, 0.3)" : "#00f5ff"}`,
                    borderRadius: "0.35rem",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <span
                  style={{
                    color: "#00f5ff",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 1rem",
                  }}
                >
                  Page {page + 1}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "transparent",
                    color: "#00f5ff",
                    border: "1px solid #00f5ff",
                    borderRadius: "0.35rem",
                    cursor: "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
