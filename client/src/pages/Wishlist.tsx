import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { toast } from "sonner";

export default function Wishlist() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: wishlistItems = [], isLoading } =
    trpc.wishlist.getItems.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const removeMutation = trpc.wishlist.removeItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
      toast.success("Removed from wishlist");
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCount.invalidate();
      toast.success("Added to cart!");
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  const handleAddToCart = (productId: number) => {
    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  if (loading || isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  height: "320px",
                  backgroundColor: "#1a1f3a",
                  borderRadius: "0.35rem",
                  border: "1px solid #2a2f4a",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center" }}
        >
          <div
            style={{
              padding: "3rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.35rem",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <Heart
              style={{
                width: "64px",
                height: "64px",
                color: "#ff006e",
                margin: "0 auto 1rem",
              }}
            />
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.5rem",
              }}
            >
              Login to view wishlist
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              Save your favorite items by logging in
            </p>
            <Button onClick={() => startLogin()} className="btn-neon">
              Login
            </Button>
          </div>
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
            MY WISHLIST
          </h1>
          <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.35rem",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💔</div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.5rem",
              }}
            >
              Your wishlist is empty
            </h2>
            <p
              style={{ color: "rgba(0, 245, 255, 0.6)", marginBottom: "2rem" }}
            >
              Save items to your wishlist to keep track of products you love
            </p>
            <Button
              onClick={() => navigate("/catalog")}
              className="btn-neon"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Browse Products
              <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {wishlistItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: "1rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  transition: "all 0.2s",
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
                {/* Product Image */}
                <div
                  style={{
                    aspectRatio: "1",
                    backgroundColor: "rgba(255, 0, 110, 0.1)",
                    borderRadius: "0.35rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "2.5rem" }}>⚡</span>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      removeMutation.mutate(item.productId);
                    }}
                    disabled={removeMutation.isPending}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      padding: "0.5rem",
                      backgroundColor: "rgba(255, 0, 110, 0.2)",
                      color: "#ff006e",
                      border: "1px solid #ff006e",
                      borderRadius: "0.35rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#ff006e";
                      e.currentTarget.style.color = "#0a0e27";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 0, 110, 0.2)";
                      e.currentTarget.style.color = "#ff006e";
                    }}
                    title="Remove from wishlist"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  {item.categoryName && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#b537f2",
                        fontWeight: 700,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.categoryName}
                    </p>
                  )}
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#00f5ff",
                      marginBottom: "0.5rem",
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.productName}
                  </h3>

                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#ff006e" }}>★</span>
                    <span style={{ color: "#00f5ff" }}>
                      {parseFloat(item.productRating ?? "0").toFixed(1)}
                    </span>
                    <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>
                      ({item.productReviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#ff006e",
                      fontSize: "1.25rem",
                      marginBottom: "1rem",
                    }}
                    className="neon-glow-pink"
                  >
                    ${parseFloat(item.productPrice).toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    onClick={() => handleAddToCart(item.productId)}
                    disabled={addToCartMutation.isPending}
                    className="btn-neon"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="btn-neon-secondary"
                    style={{ flex: 1 }}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
