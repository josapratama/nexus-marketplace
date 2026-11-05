import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Shield,
  Rocket,
  Star,
  TrendingUp,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import type { Product } from "../../../drizzle/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: categories = [] } = trpc.categories.list.useQuery();
  const { data: featuredProducts = [], isLoading: productsLoading } =
    trpc.products.list.useQuery({
      sort: "rating",
      limit: 4,
      offset: 0,
    });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          paddingTop: "6rem",
          paddingBottom: "8rem",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(#00f5ff 1px, transparent 1px), linear-gradient(90deg, #00f5ff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,0,110,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div className="hero-grid">
            {/* Left */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.9rem",
                  border: "1px solid rgba(0,245,255,0.4)",
                  borderRadius: "999px",
                  color: "#00f5ff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  width: "fit-content",
                  backgroundColor: "rgba(0,245,255,0.05)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#39ff14",
                    boxShadow: "0 0 6px #39ff14",
                    display: "inline-block",
                  }}
                />
                NEXT GENERATION MARKETPLACE
              </div>

              <div>
                <h1
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: "0.25rem",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #ff006e 60%, #b537f2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Digital Assets
                </h1>
                <h1
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background:
                      "linear-gradient(135deg, #00f5ff 0%, #b537f2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Nexus
                </h1>
              </div>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(200,220,255,0.75)",
                  lineHeight: 1.75,
                  maxWidth: "480px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 400,
                }}
              >
                Discover premium digital assets, templates, and software in a
                futuristic cyberpunk marketplace built for modern creators.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button
                  onClick={() => navigate("/catalog")}
                  className="btn-neon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Explore Catalog <ArrowRight size={16} />
                </Button>
                {!isAuthenticated && (
                  <Button
                    onClick={() => startLogin()}
                    className="btn-neon-secondary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Get Started
                  </Button>
                )}
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  gap: "2.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {[
                  { value: "5K+", label: "Products", color: "#ff006e" },
                  { value: "10K+", label: "Users", color: "#00f5ff" },
                  { value: "24/7", label: "Support", color: "#b537f2" },
                ].map(s => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: s.color,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(200,220,255,0.45)",
                        marginTop: "0.25rem",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero visual */}
            <div style={{ position: "relative", height: "420px" }}>
              {/* Outer glow frame */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "1px solid rgba(255,0,110,0.35)",
                  borderRadius: "1rem",
                  background:
                    "linear-gradient(135deg, rgba(255,0,110,0.08) 0%, rgba(181,55,242,0.06) 50%, rgba(0,245,255,0.08) 100%)",
                  boxShadow:
                    "0 0 40px rgba(255,0,110,0.15), inset 0 0 40px rgba(0,245,255,0.05)",
                }}
              />

              {/* Floating product cards */}
              {[
                {
                  top: "12%",
                  left: "8%",
                  name: "UI Kit Pro",
                  price: "$49",
                  rating: 4.9,
                  color: "#ff006e",
                  delay: "0s",
                },
                {
                  top: "42%",
                  right: "6%",
                  name: "Icon Pack",
                  price: "$19",
                  rating: 4.7,
                  color: "#00f5ff",
                  delay: "0.6s",
                },
                {
                  bottom: "10%",
                  left: "15%",
                  name: "Template",
                  price: "$29",
                  rating: 4.8,
                  color: "#b537f2",
                  delay: "1.2s",
                },
              ].map(card => (
                <div
                  key={card.name}
                  style={{
                    position: "absolute",
                    top: card.top,
                    left: card.left,
                    right: card.right,
                    bottom: card.bottom,
                    backgroundColor: "rgba(26,31,58,0.9)",
                    border: `1px solid ${card.color}40`,
                    borderRadius: "0.6rem",
                    padding: "0.75rem 1rem",
                    backdropFilter: "blur(8px)",
                    boxShadow: `0 4px 24px ${card.color}20`,
                    animation: `float 4s ease-in-out ${card.delay} infinite`,
                    minWidth: "130px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(200,220,255,0.5)",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    digital asset
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: "0.85rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    {card.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        color: card.color,
                        fontWeight: 800,
                        fontSize: "0.9rem",
                      }}
                    >
                      {card.price}
                    </span>
                    <span style={{ color: "#ffd700", fontSize: "0.72rem" }}>
                      ★ {card.rating}
                    </span>
                  </div>
                </div>
              ))}

              {/* Center badge */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff006e, #b537f2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 30px rgba(255,0,110,0.5)",
                  }}
                >
                  <Zap
                    style={{ width: "32px", height: "32px", color: "#fff" }}
                  />
                </div>
                <span
                  style={{
                    color: "#00f5ff",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  NEXUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(26,31,58,0.3)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#00f5ff",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "0.4rem",
                }}
              >
                BROWSE BY
              </p>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Categories
              </h2>
            </div>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                color: "#00f5ff",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              See all <ArrowRight size={14} />
            </button>
          </div>

          {categories.length === 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              {[
                "UI Kits",
                "Templates",
                "Icons",
                "Fonts",
                "3D Assets",
                "Illustrations",
              ].map((name, i) => {
                const colors = [
                  "#ff006e",
                  "#00f5ff",
                  "#b537f2",
                  "#39ff14",
                  "#ff9900",
                  "#ff006e",
                ];
                const icons = ["◆", "▲", "●", "Aa", "◉", "⬟"];
                return (
                  <button
                    key={name}
                    onClick={() =>
                      navigate(
                        `/catalog?category=${name.toLowerCase().replace(/ /g, "-")}`
                      )
                    }
                    style={{
                      padding: "1.5rem 1rem",
                      border: `1px solid ${colors[i]}25`,
                      borderRadius: "0.75rem",
                      backgroundColor: `${colors[i]}08`,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      textAlign: "left" as const,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = colors[i] + "80";
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 8px 24px ${colors[i]}20`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = colors[i] + "25";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        color: colors[i],
                        marginBottom: "0.6rem",
                      }}
                    >
                      {icons[i]}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                      }}
                    >
                      {name}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
              }}
            >
              {categories.map((cat, i) => {
                const colors = [
                  "#ff006e",
                  "#00f5ff",
                  "#b537f2",
                  "#39ff14",
                  "#ff9900",
                  "#ff6bff",
                ];
                const c = colors[i % colors.length];
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/catalog?category=${cat.slug}`)}
                    style={{
                      padding: "1.5rem 1rem",
                      border: `1px solid ${c}25`,
                      borderRadius: "0.75rem",
                      backgroundColor: `${c}08`,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      textAlign: "left" as const,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = c + "80";
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 8px 24px ${c}20`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = c + "25";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        color: c,
                        marginBottom: "0.6rem",
                      }}
                    >
                      ◆
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                      }}
                    >
                      {cat.name}
                    </div>
                    {cat.description && (
                      <div
                        style={{
                          fontSize: "0.73rem",
                          color: "rgba(200,220,255,0.4)",
                          marginTop: "0.3rem",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {cat.description.slice(0, 40)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#ff006e",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "0.4rem",
                }}
              >
                TOP PICKS
              </p>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Featured Products
              </h2>
            </div>
            <Button
              onClick={() => navigate("/catalog")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              View All <ArrowRight size={15} />
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {productsLoading ? (
              Array(4)
                .fill(null)
                .map((_: null, i: number) => (
                  <div
                    key={i}
                    className="product-card"
                    style={{ borderRadius: "0.85rem", overflow: "hidden" }}
                  >
                    <div
                      style={{
                        aspectRatio: "4/3",
                        backgroundColor: "rgba(255,0,110,0.08)",
                      }}
                    />
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          height: "14px",
                          backgroundColor: "#2a2f4a",
                          borderRadius: "4px",
                          width: "70%",
                        }}
                      />
                      <div
                        style={{
                          height: "14px",
                          backgroundColor: "#2a2f4a",
                          borderRadius: "4px",
                          width: "40%",
                        }}
                      />
                    </div>
                  </div>
                ))
            ) : featuredProducts.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "3rem",
                  color: "rgba(200,220,255,0.4)",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                <Zap
                  size={40}
                  style={{ margin: "0 auto 1rem", opacity: 0.3 }}
                />
                <p>No products yet. Add some from the Admin Dashboard.</p>
              </div>
            ) : (
              (featuredProducts as Product[]).map((product: Product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.85rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "4/3",
                      backgroundColor: "rgba(255,0,110,0.08)",
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
                          width: "40px",
                          height: "40px",
                          color: "rgba(255,0,110,0.3)",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(10,14,39,0.8)",
                        borderRadius: "999px",
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.7rem",
                        color: "#ffd700",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <Star size={10} fill="#ffd700" stroke="none" />
                      {parseFloat(product.rating ?? "0").toFixed(1)}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                        lineHeight: 1.3,
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
                        style={{
                          color: "#ff006e",
                          fontWeight: 800,
                          fontSize: "1rem",
                        }}
                      >
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(200,220,255,0.4)",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {product.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Why Nexus ── */}
      <section
        style={{
          paddingTop: "5rem",
          paddingBottom: "5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(26,31,58,0.25)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#b537f2",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: "0.4rem",
              }}
            >
              THE DIFFERENCE
            </p>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Why Choose Nexus
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                desc: "Industry-leading encryption and fraud protection for every purchase.",
                color: "#00f5ff",
              },
              {
                icon: Rocket,
                title: "Instant Delivery",
                desc: "Get your digital assets immediately after purchase. No waiting.",
                color: "#ff006e",
              },
              {
                icon: TrendingUp,
                title: "Premium Quality",
                desc: "Carefully curated assets from top creators and developers worldwide.",
                color: "#b537f2",
              },
            ].map(f => (
              <div
                key={f.title}
                style={{
                  padding: "1.75rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "0.85rem",
                  backgroundColor: "rgba(26,31,58,0.6)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = f.color + "60";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "0.6rem",
                    backgroundColor: f.color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <f.icon size={22} color={f.color} />
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(200,220,255,0.55)",
                    lineHeight: 1.7,
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              padding: "4rem 3rem",
              borderRadius: "1.25rem",
              overflow: "hidden",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(255,0,110,0.12) 0%, rgba(181,55,242,0.1) 50%, rgba(0,245,255,0.1) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "25%",
                width: "50%",
                height: "200%",
                background:
                  "radial-gradient(ellipse, rgba(255,0,110,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#ff006e",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  marginBottom: "0.75rem",
                }}
              >
                GET STARTED TODAY
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                Ready to Explore?
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(200,220,255,0.7)",
                  maxWidth: "500px",
                  margin: "0 auto 2rem",
                  lineHeight: 1.7,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 400,
                }}
              >
                Join thousands of creators and developers using premium digital
                assets from NEXUS.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  onClick={() => navigate("/catalog")}
                  className="btn-neon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Start Shopping <ArrowRight size={16} />
                </Button>
                {!isAuthenticated && (
                  <Button
                    onClick={() => startLogin()}
                    className="btn-neon-secondary"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(26,31,58,0.4)",
          paddingTop: "3rem",
          paddingBottom: "2rem",
        }}
      >
        <div className="container">
          <div className="footer-grid">
            <div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#ff006e",
                  marginBottom: "0.75rem",
                }}
              >
                ◆ NEXUS
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(200,220,255,0.45)",
                  lineHeight: 1.7,
                  maxWidth: "240px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 400,
                }}
              >
                The next generation digital marketplace for creators and
                developers.
              </p>
            </div>
            {(
              [
                {
                  title: "Company",
                  links: [
                    { label: "About Us", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Careers", href: "/careers" },
                  ],
                },
                {
                  title: "Support",
                  links: [
                    { label: "Help Center", href: "/help" },
                    { label: "Contact Us", href: "/contact" },
                    { label: "FAQ", href: "/faq" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacy", href: "/privacy" },
                    { label: "Terms", href: "/terms" },
                    { label: "Cookies", href: "/cookies" },
                  ],
                },
                {
                  title: "Connect",
                  links: [
                    {
                      label: "Twitter",
                      href: "https://twitter.com",
                      external: true,
                    },
                    {
                      label: "Discord",
                      href: "https://discord.com",
                      external: true,
                    },
                    {
                      label: "GitHub",
                      href: "https://github.com",
                      external: true,
                    },
                  ],
                },
              ] as const
            ).map(s => (
              <div key={s.title}>
                <h4
                  style={{
                    fontWeight: 700,
                    color: "rgba(200,220,255,0.6)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                  }}
                >
                  {s.title.toUpperCase()}
                </h4>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {s.links.map(l => (
                    <li key={l.label}>
                      {"external" in l && l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "rgba(200,220,255,0.45)",
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            fontFamily: "system-ui, sans-serif",
                            fontWeight: 400,
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = "#fff")
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.color =
                              "rgba(200,220,255,0.45)")
                          }
                        >
                          {l.label}
                        </a>
                      ) : (
                        <span
                          onClick={() => navigate(l.href)}
                          role="link"
                          tabIndex={0}
                          onKeyDown={e => e.key === "Enter" && navigate(l.href)}
                          style={{
                            color: "rgba(200,220,255,0.45)",
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            fontFamily: "system-ui, sans-serif",
                            fontWeight: 400,
                            cursor: "pointer",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.color = "#fff")
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.color =
                              "rgba(200,220,255,0.45)")
                          }
                        >
                          {l.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                color: "rgba(200,220,255,0.3)",
                fontSize: "0.8rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              © 2026 NEXUS. All rights reserved.
            </span>
            <span
              style={{
                color: "rgba(200,220,255,0.3)",
                fontSize: "0.8rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Powered by cutting-edge technology
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
