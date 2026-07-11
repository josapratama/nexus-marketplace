import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

const topics = [
  "General Inquiry",
  "Purchase / Order Help",
  "Seller Support",
  "Bug Report",
  "Partnership",
  "Other",
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: topics[0],
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only — no real submission
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#0a0e27",
    border: "1px solid #2a2f4a",
    borderRadius: "0.5rem",
    color: "#e0eaff",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                color: "#ff006e",
                marginBottom: "0.5rem",
              }}
              className="neon-glow-pink"
            >
              CONTACT US
            </h1>
            <p
              style={{
                color: "rgba(200,220,255,0.6)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              We usually respond within one business day.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "3rem",
            }}
          >
            {/* Sidebar info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {[
                { icon: Mail, title: "General", value: "hello@nexus.io" },
                {
                  icon: MessageSquare,
                  title: "Support",
                  value: "support@nexus.io",
                },
                { icon: Send, title: "Sellers", value: "sellers@nexus.io" },
              ].map(({ icon: Icon, title, value }) => (
                <div
                  key={title}
                  style={{
                    padding: "1.25rem",
                    backgroundColor: "#1a1f3a",
                    border: "1px solid #2a2f4a",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <Icon size={18} color="#00f5ff" />
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#00f5ff",
                        fontSize: "0.875rem",
                      }}
                    >
                      {title}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "rgba(200,220,255,0.6)",
                      fontSize: "0.875rem",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Form */}
            {sent ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid rgba(57,255,20,0.3)",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  gap: "1rem",
                }}
              >
                <CheckCircle
                  size={56}
                  color="#39ff14"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(57,255,20,0.7))",
                  }}
                />
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "1.25rem",
                  }}
                >
                  Message Sent!
                </h3>
                <p
                  style={{
                    color: "rgba(200,220,255,0.6)",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  We've received your message and will get back to you within
                  one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: "2rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "rgba(0,245,255,0.7)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      NAME
                    </label>
                    <input
                      value={form.name}
                      onChange={e =>
                        setForm(f => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your name"
                      required
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#00f5ff")}
                      onBlur={e => (e.target.style.borderColor = "#2a2f4a")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "rgba(0,245,255,0.7)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e =>
                        setForm(f => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      required
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "#00f5ff")}
                      onBlur={e => (e.target.style.borderColor = "#2a2f4a")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "rgba(0,245,255,0.7)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    TOPIC
                  </label>
                  <select
                    value={form.topic}
                    onChange={e =>
                      setForm(f => ({ ...f, topic: e.target.value }))
                    }
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={e => (e.target.style.borderColor = "#00f5ff")}
                    onBlur={e => (e.target.style.borderColor = "#2a2f4a")}
                  >
                    {topics.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "rgba(0,245,255,0.7)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e =>
                      setForm(f => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Describe your issue or question…"
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.target.style.borderColor = "#00f5ff")}
                    onBlur={e => (e.target.style.borderColor = "#2a2f4a")}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "0.875rem",
                    background: "linear-gradient(135deg, #ff006e, #b537f2)",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                    boxShadow: "0 0 20px rgba(255,0,110,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Send size={16} /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
