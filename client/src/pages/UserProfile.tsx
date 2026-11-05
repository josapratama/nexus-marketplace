import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Heart,
  ShoppingBag,
  Download,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { startLogin } from "@/const";

export default function UserProfile() {
  const [, navigate] = useLocation();
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");
  const utils = trpc.useUtils();

  const { data: orders = [], isLoading: ordersLoading } =
    trpc.orders.getUserOrders.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const { data: wishlistItems = [], isLoading: wishlistLoading } =
    trpc.wishlist.getItems.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const removeWishlistMutation = trpc.wishlist.removeItem.useMutation({
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDownloadInvoice = (order: (typeof orders)[0]) => {
    const items = (() => {
      try {
        return JSON.parse(order.items ?? "[]");
      } catch {
        return [];
      }
    })();
    const lines = [
      `NEXUS - Order Invoice`,
      `========================`,
      `Order #: ${order.orderNumber}`,
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      `Status: ${order.status}`,
      ``,
      `Items:`,
      ...items.map(
        (item: { productName: string; quantity: number; price: string }) =>
          `  - ${item.productName} x${item.quantity}  $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
      ),
      ``,
      `Subtotal: $${parseFloat(order.subtotal).toFixed(2)}`,
      `Tax: $${parseFloat(order.tax ?? "0").toFixed(2)}`,
      `Total: $${parseFloat(order.total).toFixed(2)}`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center", color: "#00f5ff" }}
        >
          Loading...
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
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.5rem",
              }}
            >
              Login Required
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              Please login to view your profile
            </p>
            <Button onClick={() => startLogin()} className="btn-neon">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#39ff14";
      case "confirmed":
      case "shipped":
        return "#00f5ff";
      case "pending":
        return "#ff9900";
      case "cancelled":
        return "#ff006e";
      default:
        return "#00f5ff";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        {/* Profile Header */}
        <div
          className="two-col-grid"
          style={{
            marginBottom: "3rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#ff006e",
                marginBottom: "0.5rem",
              }}
              className="neon-glow-pink"
            >
              MY PROFILE
            </h1>
            <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Button
              onClick={handleLogout}
              className="btn-neon-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Info Card */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#1a1f3a",
            border: "1px solid #2a2f4a",
            borderRadius: "0.35rem",
            marginBottom: "2rem",
          }}
        >
          <div className="three-col-grid">
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(0, 245, 255, 0.6)",
                  marginBottom: "0.5rem",
                }}
              >
                EMAIL
              </p>
              <p style={{ fontWeight: 700, color: "#00f5ff" }}>
                {user?.email || "—"}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(0, 245, 255, 0.6)",
                  marginBottom: "0.5rem",
                }}
              >
                TOTAL ORDERS
              </p>
              <p
                style={{
                  fontWeight: 700,
                  color: "#ff006e",
                  fontSize: "1.5rem",
                }}
                className="neon-glow-pink"
              >
                {ordersLoading ? "..." : orders.length}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(0, 245, 255, 0.6)",
                  marginBottom: "0.5rem",
                }}
              >
                SAVED ITEMS
              </p>
              <p
                style={{
                  fontWeight: 700,
                  color: "#b537f2",
                  fontSize: "1.5rem",
                }}
              >
                {wishlistLoading ? "..." : wishlistItems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid #2a2f4a",
            paddingBottom: "1rem",
          }}
        >
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor:
                activeTab === "orders"
                  ? "rgba(255, 0, 110, 0.2)"
                  : "transparent",
              color: activeTab === "orders" ? "#ff006e" : "#00f5ff",
              border: `1px solid ${activeTab === "orders" ? "#ff006e" : "transparent"}`,
              borderRadius: "0.35rem",
              cursor: "pointer",
              fontWeight: 700,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ShoppingBag size={18} />
            Purchase History
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor:
                activeTab === "wishlist"
                  ? "rgba(181, 55, 242, 0.2)"
                  : "transparent",
              color: activeTab === "wishlist" ? "#b537f2" : "#00f5ff",
              border: `1px solid ${activeTab === "wishlist" ? "#b537f2" : "transparent"}`,
              borderRadius: "0.35rem",
              cursor: "pointer",
              fontWeight: 700,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Heart size={18} />
            Saved Items
            {wishlistItems.length > 0 && (
              <span
                style={{
                  backgroundColor: "#b537f2",
                  color: "#0a0e27",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wishlistItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      height: "100px",
                      backgroundColor: "#1a1f3a",
                      borderRadius: "0.35rem",
                      border: "1px solid #2a2f4a",
                    }}
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(0, 245, 255, 0.6)",
                    marginBottom: "1rem",
                  }}
                >
                  No orders yet
                </p>
                <Button
                  onClick={() => navigate("/catalog")}
                  className="btn-neon"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {orders.map(order => {
                  const items = (() => {
                    try {
                      return JSON.parse(order.items ?? "[]");
                    } catch {
                      return [];
                    }
                  })();
                  return (
                    <div
                      key={order.id}
                      style={{
                        padding: "1.5rem",
                        backgroundColor: "#1a1f3a",
                        border: "1px solid #2a2f4a",
                        borderRadius: "0.35rem",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                          gap: "2rem",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(0, 245, 255, 0.6)",
                              marginBottom: "0.25rem",
                            }}
                          >
                            ORDER NUMBER
                          </p>
                          <p style={{ fontWeight: 700, color: "#00f5ff" }}>
                            #{order.orderNumber}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(0, 245, 255, 0.6)",
                              marginBottom: "0.25rem",
                            }}
                          >
                            DATE
                          </p>
                          <p style={{ fontWeight: 700, color: "#00f5ff" }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(0, 245, 255, 0.6)",
                              marginBottom: "0.25rem",
                            }}
                          >
                            TOTAL
                          </p>
                          <p
                            style={{
                              fontWeight: 700,
                              color: "#ff006e",
                              fontSize: "1.125rem",
                            }}
                            className="neon-glow-pink"
                          >
                            ${parseFloat(order.total).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "rgba(0, 245, 255, 0.6)",
                              marginBottom: "0.25rem",
                            }}
                          >
                            STATUS
                          </p>
                          <p
                            style={{
                              fontWeight: 700,
                              color: statusColor(order.status),
                              fontSize: "0.875rem",
                              textTransform: "capitalize",
                            }}
                          >
                            {order.status}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn-neon-secondary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Download size={18} />
                          Invoice
                        </Button>
                      </div>

                      {/* Order items preview */}
                      {items.length > 0 && (
                        <div
                          style={{
                            marginTop: "1rem",
                            paddingTop: "1rem",
                            borderTop: "1px solid #2a2f4a",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "rgba(0, 245, 255, 0.4)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            ITEMS
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {items.map(
                              (
                                item: { productName: string; quantity: number },
                                idx: number
                              ) => (
                                <span
                                  key={idx}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    backgroundColor: "rgba(0, 245, 255, 0.1)",
                                    border: "1px solid rgba(0, 245, 255, 0.2)",
                                    borderRadius: "0.35rem",
                                    color: "rgba(0, 245, 255, 0.7)",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {item.productName} ×{item.quantity}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            {wishlistLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{
                      height: "280px",
                      backgroundColor: "#1a1f3a",
                      borderRadius: "0.35rem",
                      border: "1px solid #2a2f4a",
                    }}
                  />
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                }}
              >
                <p
                  style={{
                    color: "rgba(0, 245, 255, 0.6)",
                    marginBottom: "1rem",
                  }}
                >
                  No saved items
                </p>
                <Button
                  onClick={() => navigate("/catalog")}
                  className="btn-neon"
                >
                  Browse Catalog
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        backgroundColor: "rgba(255, 0, 110, 0.1)",
                        borderRadius: "0.35rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
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
                        "⚡"
                      )}
                    </div>

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
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.productName}
                      </h3>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#ff006e",
                          fontSize: "1.125rem",
                        }}
                        className="neon-glow-pink"
                      >
                        ${parseFloat(item.productPrice).toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        onClick={() =>
                          addToCartMutation.mutate({
                            productId: item.productId,
                            quantity: 1,
                          })
                        }
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
                      <button
                        onClick={() =>
                          removeWishlistMutation.mutate(item.productId)
                        }
                        disabled={removeWishlistMutation.isPending}
                        style={{
                          padding: "0.75rem",
                          backgroundColor: "transparent",
                          color: "#ff006e",
                          border: "1px solid #ff006e",
                          borderRadius: "0.35rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 0, 110, 0.2)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Remove from wishlist"
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
