import { useComparison } from "@/contexts/ComparisonContext";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { useEffect, useState } from "react";

type SpecEntry = { key: string; value: string };

export default function Comparison() {
  const { selectedProducts, removeFromComparison, clearComparison } =
    useComparison();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // specsMap: productId → array of { key, value }
  const [specsMap, setSpecsMap] = useState<Record<number, SpecEntry[]>>({});
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    if (selectedProducts.length === 0) return;
    setLoadingSpecs(true);
    Promise.all(
      selectedProducts.map(p =>
        utils.products.getSpecifications
          .fetch(p.id)
          .then(data => ({
            id: p.id,
            specs: data.map(s => ({ key: s.specKey, value: s.specValue })),
          }))
          .catch(() => ({ id: p.id, specs: [] }))
      )
    ).then(results => {
      const map: Record<number, SpecEntry[]> = {};
      results.forEach(r => {
        map[r.id] = r.specs;
      });
      setSpecsMap(map);
      setLoadingSpecs(false);
    });
    // Re-fetch whenever the set of selected product IDs changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts.map(p => p.id).join(",")]);

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => utils.cart.getCount.invalidate(),
  });

  const handleAddAllToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      startLogin();
      return;
    }
    try {
      await Promise.all(
        selectedProducts.map(p =>
          addToCartMutation.mutateAsync({ productId: p.id, quantity: 1 })
        )
      );
      toast.success(`${selectedProducts.length} items added to cart!`);
    } catch {
      toast.error("Failed to add some items to cart");
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
        <Navigation />
        <div
          style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ff006e",
              textShadow: "0 0 20px rgba(255, 0, 110, 0.8)",
              marginBottom: "20px",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "2px",
            }}
          >
            COMPARISON
          </h1>
          <p
            style={{
              color: "#00f5ff",
              fontSize: "16px",
              marginBottom: "30px",
              fontFamily: "Space Mono, monospace",
            }}
          >
            No products selected for comparison
          </p>
          <button
            onClick={() => navigate("/catalog")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#ff006e",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "1px",
              boxShadow: "0 0 20px rgba(255, 0, 110, 0.6)",
            }}
          >
            BROWSE CATALOG
          </button>
        </div>
      </div>
    );
  }

  // Collect all unique spec keys across all selected products
  const allSpecKeys = Array.from(
    new Set(
      Object.values(specsMap)
        .flat()
        .map(s => s.key)
    )
  );

  // Also add base product info rows
  const baseRows: {
    key: string;
    getValue: (p: (typeof selectedProducts)[0]) => string;
  }[] = [
    { key: "Price", getValue: p => `$${parseFloat(p.price).toFixed(2)}` },
    { key: "Rating", getValue: p => `${parseFloat(p.rating).toFixed(1)} / 5` },
    { key: "Category", getValue: p => p.category || "—" },
  ];

  const isLoadingSpecs = loadingSpecs;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />
      <div
        style={{ padding: "60px 20px", maxWidth: "1400px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ff006e",
              textShadow: "0 0 20px rgba(255, 0, 110, 0.8)",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "2px",
              margin: 0,
            }}
          >
            COMPARISON
          </h1>
          <button
            onClick={clearComparison}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#00f5ff",
              border: "2px solid #00f5ff",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "1px",
              boxShadow: "0 0 15px rgba(0, 245, 255, 0.4)",
            }}
          >
            CLEAR ALL
          </button>
        </div>

        {/* Comparison Table */}
        <div
          style={{
            border: "2px solid #00f5ff",
            borderRadius: "4px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            boxShadow: "0 0 30px rgba(0, 245, 255, 0.2)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `200px repeat(${selectedProducts.length}, minmax(180px, 1fr))`,
              minWidth: "650px",
              gap: 0,
            }}
          >
            {/* Header - label column */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#1a1f3a",
                borderRight: "2px solid #00f5ff",
                borderBottom: "2px solid #00f5ff",
                fontWeight: "bold",
                color: "#00f5ff",
                fontFamily: "Space Mono, monospace",
                fontSize: "12px",
              }}
            >
              SPECIFICATIONS
            </div>

            {/* Header - product columns */}
            {selectedProducts.map(product => (
              <div
                key={product.id}
                style={{
                  padding: "20px",
                  backgroundColor: "#1a1f3a",
                  borderRight: "2px solid #00f5ff",
                  borderBottom: "2px solid #00f5ff",
                  textAlign: "center",
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "80px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      margin: "0 auto 10px",
                      display: "block",
                      border: "1px solid #2a2f4a",
                    }}
                  />
                )}
                <div
                  style={{
                    color: "#ff006e",
                    fontWeight: "bold",
                    fontFamily: "Space Mono, monospace",
                    fontSize: "13px",
                    marginBottom: "10px",
                    textShadow: "0 0 10px rgba(255, 0, 110, 0.6)",
                  }}
                >
                  {product.name}
                </div>
                <button
                  onClick={() => removeFromComparison(product.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "transparent",
                    color: "#ff006e",
                    border: "1px solid #ff006e",
                    borderRadius: "2px",
                    fontSize: "10px",
                    cursor: "pointer",
                    fontFamily: "Space Mono, monospace",
                    boxShadow: "0 0 8px rgba(255, 0, 110, 0.4)",
                  }}
                >
                  REMOVE
                </button>
              </div>
            ))}

            {/* Base info rows (price, rating, reviews) */}
            {baseRows.map(row => (
              <div key={row.key} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#0d1228",
                    borderRight: "2px solid #00f5ff",
                    borderBottom: "1px solid #1a2f4a",
                    color: "#b537f2",
                    fontFamily: "Space Mono, monospace",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {row.key.toUpperCase()}
                </div>
                {selectedProducts.map(product => (
                  <div
                    key={`${product.id}-${row.key}`}
                    style={{
                      padding: "15px 20px",
                      backgroundColor: "#0a0e27",
                      borderRight: "2px solid #00f5ff",
                      borderBottom: "1px solid #1a2f4a",
                      color: "#00f5ff",
                      fontFamily: "Space Mono, monospace",
                      fontSize: "12px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {row.getValue(product)}
                  </div>
                ))}
              </div>
            ))}

            {/* Dynamic spec rows from DB */}
            {isLoadingSpecs ? (
              <div style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#0f1220",
                    borderRight: "2px solid #00f5ff",
                    color: "rgba(0,245,255,0.4)",
                    fontFamily: "Space Mono, monospace",
                    fontSize: "12px",
                    gridColumn: `1 / span ${selectedProducts.length + 1}`,
                    textAlign: "center",
                  }}
                >
                  Loading specifications...
                </div>
              </div>
            ) : allSpecKeys.length === 0 ? null : (
              allSpecKeys.map(specKey => (
                <div key={specKey} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "15px 20px",
                      backgroundColor: "#0f1220",
                      borderRight: "2px solid #00f5ff",
                      borderBottom: "1px solid #1a2f4a",
                      color: "#00f5ff",
                      fontFamily: "Space Mono, monospace",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {specKey.toUpperCase()}
                  </div>
                  {selectedProducts.map(product => {
                    const spec = specsMap[product.id]?.find(
                      s => s.key === specKey
                    );
                    return (
                      <div
                        key={`${product.id}-${specKey}`}
                        style={{
                          padding: "15px 20px",
                          backgroundColor: "#0a0e27",
                          borderRight: "2px solid #00f5ff",
                          borderBottom: "1px solid #1a2f4a",
                          color: "#b0b8d4",
                          fontFamily: "Space Mono, monospace",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {spec ? spec.value : "—"}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/catalog")}
            style={{
              padding: "12px 30px",
              backgroundColor: "transparent",
              color: "#00f5ff",
              border: "2px solid #00f5ff",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "1px",
              boxShadow: "0 0 20px rgba(0, 245, 255, 0.4)",
            }}
          >
            ADD MORE PRODUCTS
          </button>
          <button
            onClick={handleAddAllToCart}
            disabled={addToCartMutation.isPending}
            style={{
              padding: "12px 30px",
              backgroundColor: "#ff006e",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: addToCartMutation.isPending ? "not-allowed" : "pointer",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "1px",
              boxShadow: "0 0 20px rgba(255, 0, 110, 0.6)",
              opacity: addToCartMutation.isPending ? 0.7 : 1,
            }}
          >
            {addToCartMutation.isPending ? "ADDING..." : "ADD ALL TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
