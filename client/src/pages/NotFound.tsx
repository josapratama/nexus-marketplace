import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      {/* Background glow blobs */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "15%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,0,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "15%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                border: "2px solid #ff006e",
                boxShadow:
                  "0 0 30px rgba(255,0,110,0.4), inset 0 0 30px rgba(255,0,110,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,0,110,0.05)",
              }}
            >
              <SearchX
                size={44}
                style={{
                  color: "#ff006e",
                  filter: "drop-shadow(0 0 8px rgba(255,0,110,0.8))",
                }}
              />
            </div>
          </div>

          {/* 404 */}
          <h1
            style={{
              fontSize: "7rem",
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: "0.5rem",
              fontFamily: "Space Mono, monospace",
              background: "linear-gradient(135deg, #ff006e, #b537f2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(255,0,110,0.5))",
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#00f5ff",
              marginBottom: "0.75rem",
              fontFamily: "Space Mono, monospace",
              letterSpacing: "0.05em",
              textShadow: "0 0 15px rgba(0,245,255,0.5)",
            }}
          >
            PAGE NOT FOUND
          </h2>

          <p
            style={{
              color: "rgba(200,220,255,0.5)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            The page you're looking for has vanished into the digital void.
            <br />
            It may have been moved, deleted, or never existed.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                background: "linear-gradient(135deg, #ff006e, #b537f2)",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255,0,110,0.35)",
                transition: "box-shadow 0.2s",
                fontFamily: "Space Mono, monospace",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(255,0,110,0.6)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,0,110,0.35)")
              }
            >
              <Home size={18} />
              GO HOME
            </button>

            <button
              onClick={() => navigate("/catalog")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                backgroundColor: "transparent",
                border: "2px solid #00f5ff",
                borderRadius: "0.5rem",
                color: "#00f5ff",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(0,245,255,0.25)",
                transition: "box-shadow 0.2s",
                fontFamily: "Space Mono, monospace",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,245,255,0.5)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(0,245,255,0.25)")
              }
            >
              BROWSE CATALOG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
