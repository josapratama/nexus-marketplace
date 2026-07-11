import Navigation from "@/components/Navigation";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const openings = [
  {
    title: "Senior Frontend Engineer",
    dept: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    dept: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Backend Engineer (Node.js)",
    dept: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Manager",
    dept: "Marketing",
    location: "Remote / NYC",
    type: "Full-time",
  },
  {
    title: "Developer Relations",
    dept: "Community",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Content & Copy Writer",
    dept: "Marketing",
    location: "Remote",
    type: "Contract",
  },
];

const perks = [
  {
    emoji: "🌍",
    title: "Fully Remote",
    desc: "Work from anywhere. We've been remote-first since day one.",
  },
  {
    emoji: "📈",
    title: "Equity",
    desc: "We believe everyone who builds NEXUS should own a piece of it.",
  },
  {
    emoji: "🏥",
    title: "Health Benefits",
    desc: "Comprehensive health, dental, and vision for you and your family.",
  },
  {
    emoji: "🎓",
    title: "Learning Budget",
    desc: "$2,000/yr for courses, conferences, and books.",
  },
  {
    emoji: "🛠️",
    title: "Top-tier Equipment",
    desc: "We'll ship you whatever you need to do your best work.",
  },
  {
    emoji: "🌴",
    title: "Unlimited PTO",
    desc: "Seriously. We trust you to get things done and take time off.",
  },
];

export default function Careers() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "#ff006e",
              marginBottom: "1rem",
            }}
            className="neon-glow-pink"
          >
            JOIN THE TEAM
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.6)",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              maxWidth: "560px",
              margin: "0 auto",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            We're building the future of digital asset marketplaces. If that
            excites you, we'd love to talk.
          </p>
        </div>

        {/* Perks */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
            marginBottom: "4rem",
          }}
        >
          {perks.map(p => (
            <div
              key={p.title}
              style={{
                padding: "1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                {p.emoji}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "#00f5ff",
                  marginBottom: "0.4rem",
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  color: "rgba(200,220,255,0.5)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Open roles */}
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          Open Roles
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {openings.map(job => (
            <div
              key={job.title}
              style={{
                padding: "1.25rem 1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.borderColor = "#ff006e")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.borderColor = "#2a2f4a")
              }
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "0.3rem",
                  }}
                >
                  {job.title}
                </div>
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "rgba(0,245,255,0.5)",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Briefcase size={12} /> {job.dept}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "rgba(0,245,255,0.5)",
                      fontSize: "0.8rem",
                    }}
                  >
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span
                    style={{
                      padding: "0.15rem 0.6rem",
                      backgroundColor:
                        job.type === "Full-time"
                          ? "rgba(57,255,20,0.1)"
                          : "rgba(181,55,242,0.1)",
                      border: `1px solid ${job.type === "Full-time" ? "rgba(57,255,20,0.3)" : "rgba(181,55,242,0.3)"}`,
                      borderRadius: "999px",
                      color: job.type === "Full-time" ? "#39ff14" : "#b537f2",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {job.type}
                  </span>
                </div>
              </div>
              <ArrowRight size={18} color="#ff006e" />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            backgroundColor: "rgba(255,0,110,0.05)",
            border: "1px solid rgba(255,0,110,0.2)",
            borderRadius: "0.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(200,220,255,0.6)",
              marginBottom: "0.75rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Don't see a role that fits? Send us your work anyway.
          </p>
          <p style={{ color: "#ff006e", fontWeight: 700, fontSize: "0.9rem" }}>
            careers@nexus.io
          </p>
        </div>
      </div>
    </div>
  );
}
