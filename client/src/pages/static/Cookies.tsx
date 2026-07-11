import Navigation from "@/components/Navigation";

const cookies = [
  {
    name: "nexus_session",
    type: "Essential",
    purpose:
      "Keeps you logged in between page loads. Set when you sign in, cleared on logout or expiry.",
    duration: "1 year",
    canDisable: false,
  },
];

export default function Cookies() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2.75rem",
              fontWeight: 800,
              color: "#ff006e",
              marginBottom: "0.5rem",
            }}
            className="neon-glow-pink"
          >
            COOKIES POLICY
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.4)",
              fontSize: "0.85rem",
              marginBottom: "2.5rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Last updated: June 1, 2026
          </p>

          {/* What are cookies */}
          <div
            style={{
              padding: "1.75rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.75rem",
                fontSize: "1rem",
              }}
            >
              What Are Cookies?
            </h2>
            <p
              style={{
                color: "rgba(200,220,255,0.65)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Cookies are small text files stored on your device by your
              browser. They allow websites to remember information about your
              visit, such as your login status or preferences. NEXUS uses a
              minimal cookie policy — we only set cookies that are strictly
              necessary to operate the service.
            </p>
          </div>

          {/* Cookies table */}
          <div
            style={{
              padding: "1.75rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "1.25rem",
                fontSize: "1rem",
              }}
            >
              Cookies We Use
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                <thead>
                  <tr>
                    {["Name", "Type", "Purpose", "Duration", "Disable?"].map(
                      h => (
                        <th
                          key={h}
                          style={{
                            padding: "0.75rem 1rem",
                            backgroundColor: "#0f1220",
                            color: "rgba(0,245,255,0.8)",
                            fontWeight: 700,
                            textAlign: "left",
                            fontSize: "0.75rem",
                            letterSpacing: "0.06em",
                            borderBottom: "1px solid #2a2f4a",
                          }}
                        >
                          {h.toUpperCase()}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {cookies.map(c => (
                    <tr key={c.name}>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          color: "#ff006e",
                          fontWeight: 700,
                          borderBottom: "1px solid #2a2f4a",
                        }}
                      >
                        {c.name}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          borderBottom: "1px solid #2a2f4a",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.2rem 0.6rem",
                            backgroundColor: "rgba(57,255,20,0.1)",
                            border: "1px solid rgba(57,255,20,0.3)",
                            borderRadius: "999px",
                            color: "#39ff14",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          color: "rgba(200,220,255,0.6)",
                          lineHeight: 1.5,
                          borderBottom: "1px solid #2a2f4a",
                        }}
                      >
                        {c.purpose}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          color: "rgba(200,220,255,0.6)",
                          borderBottom: "1px solid #2a2f4a",
                        }}
                      >
                        {c.duration}
                      </td>
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          borderBottom: "1px solid #2a2f4a",
                        }}
                      >
                        <span
                          style={{
                            color: c.canDisable
                              ? "#39ff14"
                              : "rgba(255,100,100,0.8)",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                          }}
                        >
                          {c.canDisable ? "Yes" : "No (required)"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No tracking */}
          <div
            style={{
              padding: "1.75rem",
              backgroundColor: "rgba(57,255,20,0.04)",
              border: "1px solid rgba(57,255,20,0.2)",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                color: "#39ff14",
                marginBottom: "0.75rem",
                fontSize: "1rem",
              }}
            >
              ✓ No Tracking or Advertising Cookies
            </h2>
            <p
              style={{
                color: "rgba(200,220,255,0.65)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              NEXUS does not use Google Analytics, Facebook Pixel, or any other
              third-party tracking or advertising cookies. Your browsing
              behaviour on our platform is not shared with advertisers or data
              brokers.
            </p>
          </div>

          {/* Managing cookies */}
          <div
            style={{
              padding: "1.75rem",
              backgroundColor: "#1a1f3a",
              border: "1px solid #2a2f4a",
              borderRadius: "0.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                color: "#00f5ff",
                marginBottom: "0.75rem",
                fontSize: "1rem",
              }}
            >
              Managing Cookies
            </h2>
            <p
              style={{
                color: "rgba(200,220,255,0.65)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              You can delete all cookies from your browser at any time via your
              browser settings. Disabling the NEXUS session cookie will log you
              out and you will need to sign in again. Refer to your browser's
              help documentation for instructions on managing cookies.
            </p>
          </div>

          <p
            style={{
              color: "rgba(200,220,255,0.35)",
              fontSize: "0.8rem",
              marginTop: "2rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Questions? Email{" "}
            <span style={{ color: "#00f5ff" }}>privacy@nexus.io</span>
          </p>
        </div>
      </div>
    </div>
  );
}
