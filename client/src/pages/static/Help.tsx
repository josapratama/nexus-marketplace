import Navigation from "@/components/Navigation";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useLocation } from "wouter";

const categories = [
  {
    title: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Click the Register button in the top navigation. Enter your name, email, and a password of at least 8 characters. You'll be logged in immediately — no email verification step required.",
      },
      {
        q: "How do I purchase a digital asset?",
        a: "Browse the Catalog, add items to your cart, and proceed to checkout. Enter your shipping and payment details, then click Complete Purchase. Your order will appear in your profile immediately.",
      },
      {
        q: "Do I need an account to browse?",
        a: "No — browsing the catalog, viewing product pages, and reading reviews are all available without an account. You only need to sign up when you want to purchase or save items to your wishlist.",
      },
    ],
  },
  {
    title: "Orders & Downloads",
    items: [
      {
        q: "Where do I find my orders?",
        a: "Go to your Profile page (click your name in the top nav). The Purchase History tab lists all your orders with status, total, and a download invoice button for each.",
      },
      {
        q: "How do I download my purchased assets?",
        a: "After a successful order, the seller is notified and will process the delivery. Download links are sent to your registered email within 24 hours. You can also re-access them from your order history.",
      },
      {
        q: "Can I get a refund?",
        a: "Refunds are handled case-by-case. Contact our support team at support@nexus.io within 14 days of purchase. We don't offer refunds for partially used or downloaded assets.",
      },
    ],
  },
  {
    title: "Selling on NEXUS",
    items: [
      {
        q: "How do I start selling?",
        a: "All accounts can sell on NEXUS. Contact our seller onboarding team at sellers@nexus.io to get your account upgraded to a seller profile. The process typically takes 1-2 business days.",
      },
      {
        q: "What commission does NEXUS take?",
        a: "NEXUS takes a 20% platform fee on each sale. You keep 80%. Payouts are processed monthly via PayPal or bank transfer once your balance reaches $50.",
      },
      {
        q: "What file formats are supported?",
        a: "We support all common design and media formats including Figma, Sketch, Adobe XD, PSD, AI, SVG, OBJ, FBX, BLEND, MP3, WAV, ZIP archives, and more.",
      },
    ],
  },
  {
    title: "Licenses",
    items: [
      {
        q: "What does a commercial license include?",
        a: "A commercial license allows you to use the asset in client work, commercial products, advertising, and other revenue-generating projects. There is no attribution requirement unless stated by the seller.",
      },
      {
        q: "Can I use assets in multiple projects?",
        a: "Standard licenses cover a single end product. If you need to use the same asset across multiple projects or for unlimited clients, look for an extended license on the product page.",
      },
      {
        q: "Can I modify purchased assets?",
        a: "Yes. All assets on NEXUS can be modified for your own use. You cannot resell or redistribute the original or modified files as standalone assets.",
      },
    ],
  },
];

export default function Help() {
  const [, navigate] = useLocation();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(
        item =>
          search === "" ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              color: "#ff006e",
              marginBottom: "0.75rem",
            }}
            className="neon-glow-pink"
          >
            HELP CENTER
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.6)",
              fontSize: "1rem",
              marginBottom: "2rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Find answers to common questions.
          </p>

          {/* Search */}
          <div
            style={{
              position: "relative",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(0,245,255,0.4)",
              }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              style={{
                width: "100%",
                paddingLeft: "2.75rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
                color: "#e0eaff",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {filteredCategories.map(cat => (
            <div key={cat.title}>
              <h2
                style={{
                  fontWeight: 700,
                  color: "#00f5ff",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {cat.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {cat.items.map(item => (
                  <div
                    key={item.q}
                    style={{
                      backgroundColor: "#1a1f3a",
                      border: `1px solid ${openItem === item.q ? "rgba(0,245,255,0.4)" : "#2a2f4a"}`,
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpenItem(openItem === item.q ? null : item.q)
                      }
                      style={{
                        width: "100%",
                        padding: "1rem 1.25rem",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#fff",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        color="#00f5ff"
                        style={{
                          flexShrink: 0,
                          transform:
                            openItem === item.q
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                    {openItem === item.q && (
                      <div
                        style={{
                          padding: "0 1.25rem 1rem",
                          color: "rgba(200,220,255,0.65)",
                          fontSize: "0.875rem",
                          lineHeight: 1.7,
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "rgba(200,220,255,0.4)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              No results found for "{search}". Try a different term or{" "}
              <span
                onClick={() => navigate("/contact")}
                style={{
                  color: "#00f5ff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                contact us
              </span>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
