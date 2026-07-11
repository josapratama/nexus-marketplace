import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  User,
  Heart,
  LogOut,
  Menu,
  X,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { startLogin } from "@/const";
import { useComparison } from "@/contexts/ComparisonContext";
import { trpc } from "@/lib/trpc";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedProducts } = useComparison();

  // Cart count from API — only fetch when logged in
  const { data: cartCount = 0 } = trpc.cart.getCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const comparisonCount = selectedProducts.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const mobileNavBtn = {
    display: "block" as const,
    width: "100%",
    textAlign: "left" as const,
    padding: "0.5rem 1rem",
    color: "#00f5ff",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "0.35rem",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#0a0e27",
        borderBottom: "1px solid #2a2f4a",
        boxShadow: "0 0 10px rgba(0, 245, 255, 0.2)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <div
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ff006e" }}
            className="neon-glow-pink"
          >
            ◆ NEXUS
          </div>
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "none",
            flex: 1,
            marginLeft: "2rem",
            marginRight: "2rem",
          }}
          className="md-search"
        >
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-neon"
            style={{
              width: "100%",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.35rem",
              padding: "0.5rem 1rem",
              color: "#00f5ff",
            }}
          />
        </form>

        {/* Desktop Nav Icons */}
        <div
          style={{ display: "none", alignItems: "center", gap: "1.5rem" }}
          className="md-nav"
        >
          {isAuthenticated && (
            <button
              onClick={() => navigate("/wishlist")}
              style={{
                position: "relative",
                color: "#00f5ff",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ff006e")}
              onMouseLeave={e => (e.currentTarget.style.color = "#00f5ff")}
              title="Wishlist"
            >
              <Heart size={20} />
            </button>
          )}

          <button
            onClick={() => navigate("/comparison")}
            style={{
              position: "relative",
              color: "#00f5ff",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ff006e")}
            onMouseLeave={e => (e.currentTarget.style.color = "#00f5ff")}
            title="Compare Products"
          >
            <Scale size={20} />
            {comparisonCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#b537f2",
                  color: "#0a0e27",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {comparisonCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/cart")}
            style={{
              position: "relative",
              color: "#00f5ff",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ff006e")}
            onMouseLeave={e => (e.currentTarget.style.color = "#00f5ff")}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#ff006e",
                  color: "#0a0e27",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="neon-glow-pink"
              >
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => navigate("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#00f5ff",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ff006e")}
                onMouseLeave={e => (e.currentTarget.style.color = "#00f5ff")}
              >
                <User size={20} />
                <span>{user?.name || "Profile"}</span>
              </button>
              <Button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  backgroundColor: "transparent",
                  color: "#00f5ff",
                  border: "1px solid #00f5ff",
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                }}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => startLogin()}
              className="btn-neon"
              style={{ fontSize: "0.875rem" }}
            >
              Login
            </Button>
          )}

          {user?.role === "admin" && (
            <Button
              onClick={() => navigate("/admin/dashboard")}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "transparent",
                color: "#00f5ff",
                border: "1px solid #00f5ff",
                borderRadius: "0.35rem",
                cursor: "pointer",
              }}
            >
              Admin
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            color: "#00f5ff",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          className="mobile-menu-toggle"
          onMouseEnter={e => (e.currentTarget.style.color = "#ff006e")}
          onMouseLeave={e => (e.currentTarget.style.color = "#00f5ff")}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            backgroundColor: "#1a1f3a",
            borderTop: "1px solid #2a2f4a",
            padding: "1rem",
          }}
        >
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-neon"
              style={{
                width: "100%",
                backgroundColor: "#0a0e27",
                border: "1px solid #2a2f4a",
                borderRadius: "0.35rem",
                padding: "0.5rem 1rem",
                color: "#00f5ff",
              }}
            />
          </form>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {[
              { label: "Catalog", path: "/catalog" },
              { label: "Compare", path: "/comparison" },
              { label: "Cart", path: "/cart", badge: cartCount },
              ...(isAuthenticated
                ? [
                    { label: "Wishlist", path: "/wishlist" },
                    { label: "Profile", path: "/profile" },
                    ...(user?.role === "admin"
                      ? [{ label: "Admin Dashboard", path: "/admin/dashboard" }]
                      : []),
                  ]
                : []),
            ].map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  ...mobileNavBtn,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#ff006e";
                  e.currentTarget.style.backgroundColor = "#0a0e27";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#00f5ff";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
                {!!item.badge && item.badge > 0 && (
                  <span
                    style={{
                      backgroundColor: "#ff006e",
                      color: "#0a0e27",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={mobileNavBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#ff006e";
                  e.currentTarget.style.backgroundColor = "#0a0e27";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#00f5ff";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  startLogin();
                  setMobileMenuOpen(false);
                }}
                className="btn-neon"
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "0.5rem 1rem",
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .md-search { display: flex !important; }
          .md-nav { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
