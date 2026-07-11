import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { Zap, Users, Globe, Award } from "lucide-react";

const stats = [
  { label: "Creators", value: "50K+" },
  { label: "Digital Assets", value: "120K+" },
  { label: "Countries", value: "180+" },
  { label: "Transactions", value: "2M+" },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "AR" },
  { name: "Maya Chen", role: "CTO & Co-founder", avatar: "MC" },
  { name: "Jordan Kim", role: "Head of Design", avatar: "JK" },
  { name: "Sam Patel", role: "Head of Engineering", avatar: "SP" },
];

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              backgroundColor: "rgba(255,0,110,0.1)",
              border: "1px solid rgba(255,0,110,0.3)",
              borderRadius: "999px",
              marginBottom: "1.5rem",
            }}
          >
            <Zap size={14} color="#ff006e" />
            <span
              style={{
                color: "#ff006e",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              OUR STORY
            </span>
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Built for{" "}
            <span
              style={{
                color: "#ff006e",
                textShadow: "0 0 20px rgba(255,0,110,0.5)",
              }}
            >
              creators
            </span>
            ,
            <br />
            by creators.
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.6)",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              maxWidth: "600px",
              margin: "0 auto",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            NEXUS was founded in 2022 with a simple mission: give digital
            creators a professional marketplace where their work is valued and
            discovery is effortless.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                padding: "2rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#ff006e",
                  marginBottom: "0.25rem",
                }}
                className="neon-glow-pink"
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "rgba(0,245,255,0.7)",
                  fontSize: "0.875rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {[
            {
              icon: Globe,
              title: "Global Reach",
              desc: "Connecting creators and buyers from over 180 countries in a single unified marketplace.",
            },
            {
              icon: Award,
              title: "Quality First",
              desc: "Every asset is reviewed before listing to ensure buyers always get professional-grade work.",
            },
            {
              icon: Users,
              title: "Creator-Centric",
              desc: "Creators keep up to 80% of every sale. We grow when you grow — it's that simple.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                padding: "2rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "0.5rem",
                  backgroundColor: "rgba(0,245,255,0.08)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <Icon size={22} color="#00f5ff" />
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  color: "#00f5ff",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "rgba(200,220,255,0.5)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Meet the Team
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {team.map(member => (
              <div
                key={member.name}
                style={{
                  padding: "2rem",
                  backgroundColor: "#1a1f3a",
                  border: "1px solid #2a2f4a",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff006e, #b537f2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#fff",
                  }}
                >
                  {member.avatar}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "0.25rem",
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    color: "rgba(0,245,255,0.6)",
                    fontSize: "0.85rem",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <button
            onClick={() => navigate("/catalog")}
            style={{
              padding: "0.875rem 2rem",
              background: "linear-gradient(135deg, #ff006e, #b537f2)",
              border: "none",
              borderRadius: "0.5rem",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(255,0,110,0.35)",
              letterSpacing: "0.05em",
            }}
          >
            EXPLORE THE MARKETPLACE →
          </button>
        </div>
      </div>
    </div>
  );
}
