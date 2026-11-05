import Navigation from "@/components/Navigation";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Scale,
} from "lucide-react";
import { useComparison } from "@/contexts/ComparisonContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { startLogin } from "@/const";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id ?? "0", 10);
  const { addToComparison, isInComparison, canAddMore } = useComparison();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = trpc.products.getById.useQuery(productId, {
    enabled: productId > 0,
  });

  const { data: reviews = [], isLoading: reviewsLoading } =
    trpc.reviews.getByProduct.useQuery(
      { productId, limit: 10, offset: 0 },
      { enabled: productId > 0 }
    );

  const { data: wishlistItems = [] } = trpc.wishlist.getItems.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    }
  );

  const isWishlisted = wishlistItems.some(w => w.productId === productId);

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCount.invalidate();
      toast.success(
        `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`
      );
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const addToWishlistMutation = trpc.wishlist.addItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
      toast.success("Added to wishlist!");
    },
    onError: () => toast.error("Failed to add to wishlist"),
  });

  const removeFromWishlistMutation = trpc.wishlist.removeItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
      toast.success("Removed from wishlist");
    },
    onError: () => toast.error("Failed to remove from wishlist"),
  });

  const createReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.getByProduct.invalidate({ productId });
      utils.products.getById.invalidate(productId);
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: "", comment: "" });
    },
    onError: err => toast.error(err.message || "Failed to submit review"),
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      startLogin();
      return;
    }
    addToCartMutation.mutate({ productId, quantity });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      startLogin();
      return;
    }
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const imageUrls: string[] = (() => {
    try {
      return product?.imageUrls ? JSON.parse(product.imageUrls) : [];
    } catch {
      return [];
    }
  })();
  const allImages = product?.imageUrl
    ? [product.imageUrl, ...imageUrls.filter(u => u !== product.imageUrl)]
    : imageUrls;

  const tags: string[] = (() => {
    try {
      return product?.tags ? JSON.parse(product.tags) : [];
    } catch {
      return [];
    }
  })();

  if (productLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div className="product-detail-grid">
            <div
              style={{
                aspectRatio: "1",
                backgroundColor: "#1a1f3a",
                borderRadius: "0.35rem",
                border: "1px solid #2a2f4a",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[200, 100, 150, 80].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: `${h}px`,
                    backgroundColor: "#1a1f3a",
                    borderRadius: "0.35rem",
                    border: "1px solid #2a2f4a",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center" }}
        >
          <p style={{ color: "#ff006e", fontSize: "1.25rem" }}>
            Product not found
          </p>
          <Button
            onClick={() => navigate("/catalog")}
            className="btn-neon"
            style={{ marginTop: "1rem" }}
          >
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            gap: "0.5rem",
            color: "rgba(0, 245, 255, 0.6)",
            fontSize: "0.875rem",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "rgba(0, 245, 255, 0.6)",
              cursor: "pointer",
            }}
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/catalog")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "rgba(0, 245, 255, 0.6)",
              cursor: "pointer",
            }}
          >
            Catalog
          </button>
          <span>/</span>
          <span style={{ color: "#00f5ff" }}>{product.name}</span>
        </div>

        {/* Main Content */}
        <div
          className="product-detail-grid"
          style={{
            marginBottom: "3rem",
          }}
        >
          {/* Image Gallery */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                backgroundColor: "rgba(255, 0, 110, 0.1)",
                borderRadius: "0.35rem",
                border: "1px solid #2a2f4a",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{ fontSize: "3rem", color: "rgba(255, 0, 110, 0.2)" }}
                >
                  ⚡
                </div>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(p =>
                        p === 0 ? allImages.length - 1 : p - 1
                      )
                    }
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#00f5ff",
                      border: "1px solid #00f5ff",
                      borderRadius: "0.35rem",
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(p =>
                        p === allImages.length - 1 ? 0 : p + 1
                      )
                    }
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#00f5ff",
                      border: "1px solid #00f5ff",
                      borderRadius: "0.35rem",
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {allImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      aspectRatio: "1",
                      backgroundColor: "rgba(255, 0, 110, 0.1)",
                      border:
                        selectedImageIndex === index
                          ? "2px solid #ff006e"
                          : "1px solid #2a2f4a",
                      borderRadius: "0.35rem",
                      cursor: "pointer",
                      overflow: "hidden",
                      padding: 0,
                    }}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  color: "#00f5ff",
                  marginBottom: "1rem",
                }}
              >
                {product.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      style={{
                        fill:
                          i < Math.floor(parseFloat(product.rating ?? "0"))
                            ? "#ff006e"
                            : "rgba(255, 0, 110, 0.3)",
                        color:
                          i < Math.floor(parseFloat(product.rating ?? "0"))
                            ? "#ff006e"
                            : "rgba(255, 0, 110, 0.3)",
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: "#00f5ff" }}>
                  {parseFloat(product.rating ?? "0").toFixed(1)} (
                  {product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(255, 0, 110, 0.1)",
                border: "1px solid #ff006e",
                borderRadius: "0.35rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 0, 110, 0.6)",
                  marginBottom: "0.25rem",
                }}
              >
                PRICE
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "#ff006e",
                }}
                className="neon-glow-pink"
              >
                ${parseFloat(product.price).toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: product.stock > 0 ? "#39ff14" : "#ff006e",
                  marginTop: "0.5rem",
                }}
              >
                {product.stock > 0
                  ? `✓ In Stock (${product.stock} available)`
                  : "✗ Out of Stock"}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#00f5ff",
                    marginBottom: "0.75rem",
                  }}
                >
                  DESCRIPTION
                </h3>
                <p style={{ color: "rgba(0, 245, 255, 0.7)", lineHeight: 1.6 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "rgba(181, 55, 242, 0.2)",
                      border: "1px solid #b537f2",
                      borderRadius: "0.35rem",
                      color: "#b537f2",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #2a2f4a",
                flexWrap: "wrap",
              }}
            >
              {/* Quantity */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                  padding: "0.5rem",
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#00f5ff",
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: "40px",
                    textAlign: "center",
                    color: "#00f5ff",
                    fontWeight: 700,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color:
                      quantity >= product.stock
                        ? "rgba(0, 245, 255, 0.3)"
                        : "#00f5ff",
                    cursor:
                      quantity >= product.stock ? "not-allowed" : "pointer",
                    padding: "0.25rem 0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
                className="btn-neon"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minWidth: "140px",
                }}
              >
                <ShoppingCart size={18} />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                disabled={
                  addToWishlistMutation.isPending ||
                  removeFromWishlistMutation.isPending
                }
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: isWishlisted
                    ? "rgba(255, 0, 110, 0.2)"
                    : "transparent",
                  color: isWishlisted ? "#ff006e" : "#00f5ff",
                  border: `1px solid ${isWishlisted ? "#ff006e" : "#00f5ff"}`,
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>

              {/* Compare */}
              <button
                onClick={() => {
                  if (isInComparison(product.id) || canAddMore()) {
                    addToComparison({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      rating: product.rating ?? "0",
                      category: String(product.categoryId),
                      image: product.imageUrl ?? "",
                    });
                    toast.success("Added to comparison!");
                  } else {
                    toast.error("Max 4 products for comparison");
                  }
                }}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: isInComparison(product.id)
                    ? "rgba(181, 55, 242, 0.2)"
                    : "transparent",
                  color: isInComparison(product.id) ? "#b537f2" : "#00f5ff",
                  border: `1px solid ${isInComparison(product.id) ? "#b537f2" : "#00f5ff"}`,
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Add to comparison"
              >
                <Scale size={18} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "transparent",
                  color: "#00f5ff",
                  border: "1px solid #00f5ff",
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Copy link"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ borderTop: "1px solid #2a2f4a", paddingTop: "3rem" }}>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#00f5ff",
              marginBottom: "2rem",
            }}
            className="neon-glow"
          >
            CUSTOMER REVIEWS
          </h2>

          <div
            className="two-col-grid"
            style={{
              marginBottom: "2rem",
            }}
          >
            {/* Rating Summary */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 700,
                    color: "#ff006e",
                  }}
                >
                  {parseFloat(product.rating ?? "0").toFixed(1)}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.25rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        style={{
                          fill:
                            i < Math.floor(parseFloat(product.rating ?? "0"))
                              ? "#ff006e"
                              : "rgba(255, 0, 110, 0.3)",
                          color:
                            i < Math.floor(parseFloat(product.rating ?? "0"))
                              ? "#ff006e"
                              : "rgba(255, 0, 110, 0.3)",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(0, 245, 255, 0.6)",
                    }}
                  >
                    Based on {product.reviewCount} reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Write Review CTA / Form */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              {!isAuthenticated ? (
                <div style={{ textAlign: "center" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#00f5ff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Share Your Experience
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(0, 245, 255, 0.6)",
                      marginBottom: "1rem",
                    }}
                  >
                    Login to write a review
                  </p>
                  <Button onClick={() => startLogin()} className="btn-neon">
                    Login to Review
                  </Button>
                </div>
              ) : showReviewForm ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    createReviewMutation.mutate({
                      productId,
                      orderId: 0,
                      rating: reviewForm.rating,
                      title: reviewForm.title || undefined,
                      comment: reviewForm.comment || undefined,
                    });
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#00f5ff",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Write a Review
                  </h3>
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        marginBottom: "0.4rem",
                        fontWeight: 700,
                      }}
                    >
                      RATING
                    </label>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewForm(p => ({ ...p, rating: star }))
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.1rem",
                          }}
                        >
                          <Star
                            size={24}
                            style={{
                              fill:
                                star <= reviewForm.rating
                                  ? "#ff006e"
                                  : "rgba(255, 0, 110, 0.2)",
                              color:
                                star <= reviewForm.rating
                                  ? "#ff006e"
                                  : "rgba(255, 0, 110, 0.3)",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        marginBottom: "0.4rem",
                        fontWeight: 700,
                      }}
                    >
                      TITLE
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={e =>
                        setReviewForm(p => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Summary of your review"
                      style={{
                        width: "100%",
                        backgroundColor: "#0a0e27",
                        border: "1px solid #2a2f4a",
                        borderRadius: "0.35rem",
                        padding: "0.5rem 0.75rem",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        marginBottom: "0.4rem",
                        fontWeight: 700,
                      }}
                    >
                      COMMENT
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e =>
                        setReviewForm(p => ({ ...p, comment: e.target.value }))
                      }
                      placeholder="Tell us what you think..."
                      rows={3}
                      style={{
                        width: "100%",
                        backgroundColor: "#0a0e27",
                        border: "1px solid #2a2f4a",
                        borderRadius: "0.35rem",
                        padding: "0.5rem 0.75rem",
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Button
                      type="submit"
                      className="btn-neon"
                      style={{ flex: 1 }}
                      disabled={createReviewMutation.isPending}
                    >
                      {createReviewMutation.isPending
                        ? "Submitting..."
                        : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-neon-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#00f5ff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Share Your Experience
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(0, 245, 255, 0.6)",
                      marginBottom: "1rem",
                    }}
                  >
                    Help others by sharing your review
                  </p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-neon"
                  >
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div style={{ color: "rgba(0, 245, 255, 0.5)" }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "rgba(0, 245, 255, 0.5)",
              }}
            >
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {reviews.map(review => (
                <div
                  key={review.id}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #2a2f4a",
                    borderRadius: "0.35rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: 700, color: "#00f5ff" }}>
                        User #{review.userId}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              style={{
                                fill:
                                  i < review.rating
                                    ? "#ff006e"
                                    : "rgba(255, 0, 110, 0.3)",
                                color:
                                  i < review.rating
                                    ? "#ff006e"
                                    : "rgba(255, 0, 110, 0.3)",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "rgba(0, 245, 255, 0.4)",
                          }}
                        >
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.title && (
                    <h5
                      style={{
                        fontWeight: 700,
                        color: "#b537f2",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {review.title}
                    </h5>
                  )}
                  {review.comment && (
                    <p
                      style={{
                        color: "rgba(0, 245, 255, 0.7)",
                        lineHeight: 1.6,
                      }}
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
