import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const utils = trpc.useUtils();

  const { data: cartItems = [], isLoading: cartLoading } =
    trpc.cart.getItems.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const createOrderMutation = trpc.orders.createOrder.useMutation({
    onSuccess: order => {
      utils.cart.getItems.invalidate();
      utils.cart.getCount.invalidate();
      navigate(`/order-confirmation/${order.orderNumber}`);
    },
    onError: err => {
      toast.error(err.message || "Failed to place order. Please try again.");
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderMutation.mutate();
  };

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
                marginBottom: "1rem",
              }}
            >
              Login Required
            </h2>
            <Button onClick={() => startLogin()} className="btn-neon">
              Login to Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading) {
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

  if (cartItems.length === 0) {
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
              Your cart is empty
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              Add items to your cart before checking out
            </p>
            <Button onClick={() => navigate("/catalog")} className="btn-neon">
              Browse Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#0a0e27",
    border: "1px solid #2a2f4a",
    borderRadius: "0.35rem",
    padding: "0.75rem",
    color: "#00f5ff",
  };
  const labelStyle = {
    display: "block" as const,
    color: "#00f5ff",
    fontWeight: 700,
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
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
            CHECKOUT
          </h1>
        </div>

        {/* Progress Indicator */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "3rem",
            justifyContent: "center",
          }}
        >
          {(["shipping", "payment"] as const).map((s, idx) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor:
                    step === s || (step === "payment" && idx === 0)
                      ? "#ff006e"
                      : "transparent",
                  border: `2px solid ${step === s || (step === "payment" && idx === 0) ? "#ff006e" : "#00f5ff"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color:
                    step === s || (step === "payment" && idx === 0)
                      ? "#0a0e27"
                      : "#00f5ff",
                }}
              >
                {idx + 1}
              </div>
              <span
                style={{
                  color: step === s ? "#ff006e" : "rgba(0, 245, 255, 0.5)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                {s === "shipping" ? "SHIPPING" : "PAYMENT"}
              </span>
              {idx === 0 && (
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    backgroundColor: step === "payment" ? "#ff006e" : "#2a2f4a",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Shipping + Payment forms side by side with order summary */}
        <div
          className="checkout-layout-grid"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div>
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit}>
                <div
                  style={{
                    padding: "2rem",
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #2a2f4a",
                    borderRadius: "0.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#00f5ff",
                    }}
                  >
                    SHIPPING INFORMATION
                  </h2>

                  <div>
                    <label style={labelStyle}>EMAIL</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>FULL NAME</label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>ADDRESS</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div className="two-col-grid">
                    <div>
                      <label style={labelStyle}>CITY</label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>ZIP CODE</label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="btn-neon"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Continue to Payment
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit}>
                <div
                  style={{
                    padding: "2rem",
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #2a2f4a",
                    borderRadius: "0.35rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#00f5ff",
                    }}
                  >
                    PAYMENT INFORMATION
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                      backgroundColor: "rgba(0, 245, 255, 0.05)",
                      border: "1px solid rgba(0, 245, 255, 0.2)",
                      borderRadius: "0.35rem",
                    }}
                  >
                    <Lock size={16} color="#00f5ff" />
                    <span
                      style={{
                        color: "rgba(0, 245, 255, 0.7)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Secure payment — your card details are encrypted
                    </span>
                  </div>

                  <div>
                    <label style={labelStyle}>CARD NUMBER</label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4532 1234 5678 9010"
                      required
                      maxLength={19}
                      style={inputStyle}
                    />
                  </div>
                  <div className="two-col-grid">
                    <div>
                      <label style={labelStyle}>EXPIRY DATE</label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        maxLength={4}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="btn-neon-secondary"
                      style={{ flex: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="btn-neon"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending
                        ? "Processing..."
                        : "Complete Purchase"}
                      {!createOrderMutation.isPending && (
                        <ArrowRight size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
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
              <h3 style={{ fontWeight: 700, color: "#00f5ff" }}>
                ORDER SUMMARY
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(0, 245, 255, 0.7)",
                        flex: 1,
                        marginRight: "0.5rem",
                      }}
                    >
                      {item.productName} × {item.quantity}
                    </span>
                    <span style={{ color: "#00f5ff" }}>
                      $
                      {(parseFloat(item.productPrice) * item.quantity).toFixed(
                        2
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: "1px solid #2a2f4a",
                  paddingTop: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "rgba(0, 245, 255, 0.7)",
                    fontSize: "0.875rem",
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
                    fontSize: "0.875rem",
                  }}
                >
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    borderTop: "1px solid #2a2f4a",
                    paddingTop: "0.5rem",
                  }}
                >
                  <span style={{ color: "#00f5ff" }}>Total</span>
                  <span style={{ color: "#ff006e" }} className="neon-glow-pink">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
