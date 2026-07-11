import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

export default function Cart() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: cartItems = [], isLoading } = trpc.cart.getItems.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    }
  );

  const updateMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.getItems.invalidate(),
    onError: () => toast.error("Failed to update quantity"),
  });

  const removeMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      utils.cart.getCount.invalidate();
      toast.success("Item removed from cart");
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeMutation.mutate(cartItemId);
    } else {
      updateMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (loading || isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[1, 2].map(i => (
              <div
                key={i}
                style={{
                  height: "120px",
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
            <ShoppingBag
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
              Login to view cart
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              Please login to access your shopping cart
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
            SHOPPING CART
          </h1>
          <p style={{ color: "rgba(0, 245, 255, 0.6)" }}>
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.35rem",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.5rem",
              }}
            >
              Your cart is empty
            </h2>
            <p
              style={{ color: "rgba(0, 245, 255, 0.6)", marginBottom: "2rem" }}
            >
              Start shopping to add items to your cart
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
              Continue Shopping
              <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "2rem",
            }}
          >
            {/* Cart Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {cartItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #2a2f4a",
                    borderRadius: "0.35rem",
                  }}
                >
                  {/* Product Image */}
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
                      <div style={{ fontSize: "2rem" }}>⚡</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 700,
                          color: "#00f5ff",
                          marginBottom: "0.25rem",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.productName}
                      </h3>
                      {item.productCategory && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#b537f2",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {item.productCategory}
                        </p>
                      )}
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "rgba(0, 245, 255, 0.4)",
                        }}
                      >
                        ${parseFloat(item.productPrice).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity and Price */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          backgroundColor: "#0a0e27",
                          border: "1px solid #2a2f4a",
                          borderRadius: "0.35rem",
                          padding: "0.25rem",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            updateMutation.isPending || removeMutation.isPending
                          }
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#00f5ff",
                            cursor: "pointer",
                            padding: "0.25rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                            color: "#00f5ff",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updateMutation.isPending}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#00f5ff",
                            cursor: "pointer",
                            padding: "0.25rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span
                        style={{
                          fontWeight: 700,
                          color: "#ff006e",
                          fontSize: "1.125rem",
                        }}
                        className="neon-glow-pink"
                      >
                        $
                        {(
                          parseFloat(item.productPrice) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isPending}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#ff006e",
                      border: "1px solid #ff006e",
                      borderRadius: "0.35rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "fit-content",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 0, 110, 0.2)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                position: "sticky",
                top: "100px",
                height: "fit-content",
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.35rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#00f5ff",
                    fontSize: "1.125rem",
                  }}
                >
                  ORDER SUMMARY
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    borderBottom: "1px solid #2a2f4a",
                    paddingBottom: "1rem",
                  }}
                >
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "rgba(0, 245, 255, 0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ flex: 1, marginRight: "0.5rem" }}>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>
                        $
                        {(
                          parseFloat(item.productPrice) * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "rgba(0, 245, 255, 0.7)",
                      borderTop: "1px solid #2a2f4a",
                      paddingTop: "0.5rem",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "rgba(0, 245, 255, 0.7)",
                    }}
                  >
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                  }}
                >
                  <span style={{ color: "#00f5ff" }}>Total</span>
                  <span style={{ color: "#ff006e" }} className="neon-glow-pink">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  className="btn-neon"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Button>

                <Button
                  onClick={() => navigate("/catalog")}
                  className="btn-neon-secondary"
                  style={{ width: "100%" }}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
