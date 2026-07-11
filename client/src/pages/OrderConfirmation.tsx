import Navigation from "@/components/Navigation";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function OrderConfirmation() {
  const [, navigate] = useLocation();
  const params = useParams<{ orderId: string }>();
  const { isAuthenticated } = useAuth();

  const { data: orders = [], isLoading } = trpc.orders.getUserOrders.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    }
  );

  // Find the order by orderId param (could be numeric id or order number)
  const order = orders.find(
    o => String(o.id) === params.orderId || o.orderNumber === params.orderId
  );

  const items = (() => {
    try {
      return JSON.parse(order?.items ?? "[]");
    } catch {
      return [];
    }
  })();

  const handleDownload = () => {
    if (!order) return;
    const lines = [
      `NEXUS — Order Invoice`,
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

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          className="container"
          style={{ paddingTop: "4rem", textAlign: "center", color: "#00f5ff" }}
        >
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
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
              maxWidth: "500px",
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
              Order Not Found
            </h2>
            <p
              style={{
                color: "rgba(0, 245, 255, 0.6)",
                marginBottom: "1.5rem",
              }}
            >
              We couldn't find this order. It may belong to a different account.
            </p>
            <Button onClick={() => navigate("/profile")} className="btn-neon">
              View All Orders
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
        style={{ paddingTop: "3rem", paddingBottom: "4rem" }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <CheckCircle
              style={{
                width: "80px",
                height: "80px",
                color: "#39ff14",
                margin: "0 auto 1rem",
              }}
            />
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.5rem",
              }}
            >
              ORDER CONFIRMED!
            </h1>
            <p style={{ color: "rgba(0, 245, 255, 0.6)", lineHeight: 1.6 }}>
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Summary Card */}
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.35rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(0, 245, 255, 0.5)",
                    marginBottom: "0.25rem",
                  }}
                >
                  ORDER NUMBER
                </p>
                <p
                  style={{ fontWeight: 700, color: "#ff006e" }}
                  className="neon-glow-pink"
                >
                  #{order.orderNumber}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(0, 245, 255, 0.5)",
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
                    fontSize: "0.75rem",
                    color: "rgba(0, 245, 255, 0.5)",
                    marginBottom: "0.25rem",
                  }}
                >
                  STATUS
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#39ff14",
                    textTransform: "capitalize",
                  }}
                >
                  {order.status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(0, 245, 255, 0.5)",
                    marginBottom: "0.25rem",
                  }}
                >
                  TOTAL
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#ff006e",
                    fontSize: "1.25rem",
                  }}
                  className="neon-glow-pink"
                >
                  ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items */}
            {items.length > 0 && (
              <div
                style={{ borderTop: "1px solid #2a2f4a", paddingTop: "1rem" }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(0, 245, 255, 0.5)",
                    marginBottom: "0.75rem",
                  }}
                >
                  ITEMS ORDERED
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {items.map(
                    (
                      item: {
                        productName: string;
                        quantity: number;
                        price: string;
                      },
                      idx: number
                    ) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "rgba(0, 245, 255, 0.8)" }}>
                          {item.productName}{" "}
                          <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>
                            ×{item.quantity}
                          </span>
                        </span>
                        <span style={{ color: "#00f5ff", fontWeight: 700 }}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div
                  style={{
                    borderTop: "1px solid #2a2f4a",
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "rgba(0, 245, 255, 0.6)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "rgba(0, 245, 255, 0.6)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>Tax</span>
                    <span>${parseFloat(order.tax ?? "0").toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      marginTop: "0.25rem",
                    }}
                  >
                    <span style={{ color: "#00f5ff" }}>Total</span>
                    <span
                      style={{ color: "#ff006e" }}
                      className="neon-glow-pink"
                    >
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <Button
              onClick={handleDownload}
              className="btn-neon-secondary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Download size={18} />
              Download Invoice
            </Button>
            <Button
              onClick={() => navigate("/profile")}
              className="btn-neon"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              View All Orders
              <ArrowRight size={18} />
            </Button>
            <Button
              onClick={() => navigate("/catalog")}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "rgba(0, 245, 255, 0.6)",
                border: "1px solid rgba(0, 245, 255, 0.2)",
                borderRadius: "0.35rem",
                padding: "0.75rem",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
