import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is NEXUS free to use?",
    a: "Browsing and purchasing on NEXUS is free. There are no subscription fees for buyers. Sellers pay a 20% platform commission on each sale — no upfront costs.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal. Cryptocurrency payments are in development.",
  },
  {
    q: "Are the assets exclusive to NEXUS?",
    a: "Not necessarily. Sellers can choose to list assets exclusively on NEXUS (which earns them a higher revenue share) or sell across multiple platforms.",
  },
  {
    q: "Can I request a custom asset?",
    a: "Not directly through the platform — but you can contact sellers via their profile to discuss custom work. We're building a Commissions feature for 2026 Q3.",
  },
  {
    q: "How do I report a copyright violation?",
    a: "Email legal@nexus.io with a description of the infringement and links to both the original work and the NEXUS listing. We aim to respond within 48 hours.",
  },
  {
    q: "Are there any regional restrictions?",
    a: "NEXUS is available worldwide. Some payment methods may vary by region. If you encounter issues, contact support@nexus.io.",
  },
  {
    q: "How are reviews verified?",
    a: "Reviews can currently be left by any logged-in user. We're developing a verified purchase badge that will appear on reviews from confirmed buyers. Coming soon.",
  },
  {
    q: "Do you have an affiliate or referral program?",
    a: "Yes! You can earn a 10% commission for every purchase made by someone you refer. Find your referral link in your Profile under Settings. Payouts are monthly.",
  },
];

export default function FAQ() {
  const [, navigate] = useLocation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                color: "#ff006e",
                marginBottom: "0.5rem",
              }}
              className="neon-glow-pink"
            >
              FAQ
            </h1>
            <p
              style={{
                color: "rgba(200,220,255,0.55)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Quick answers to common questions. Can't find what you need?{" "}
              <span
                onClick={() => navigate("/contact")}
                style={{
                  color: "#00f5ff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Contact us.
              </span>
            </p>
          </div>

          {/* Accordion */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            {faqs.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#1a1f3a",
                  border: `1px solid ${openIdx === idx ? "rgba(0,245,255,0.35)" : "#2a2f4a"}`,
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "1.1rem 1.25rem",
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
                      color: openIdx === idx ? "#00f5ff" : "#fff",
                      fontSize: "0.925rem",
                      lineHeight: 1.4,
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
                        openIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {openIdx === idx && (
                  <div
                    style={{
                      padding: "0 1.25rem 1.1rem",
                      color: "rgba(200,220,255,0.65)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              backgroundColor: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(200,220,255,0.55)",
                fontSize: "0.9rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Still have questions? Visit our{" "}
              <span
                onClick={() => navigate("/help")}
                style={{
                  color: "#00f5ff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Help Center
              </span>{" "}
              or{" "}
              <span
                onClick={() => navigate("/contact")}
                style={{
                  color: "#00f5ff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Contact Support
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
