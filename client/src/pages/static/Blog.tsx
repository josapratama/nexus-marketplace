import Navigation from "@/components/Navigation";
import { useLocation } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "top-ui-kits-2025",
    title: "Top 10 UI Kits for 2025",
    excerpt:
      "We reviewed hundreds of submissions to bring you the absolute best UI kits released this year. From dark dashboards to glassmorphism systems — these are the ones worth your budget.",
    category: "Design",
    date: "Jun 28, 2026",
    readTime: "5 min read",
    color: "#ff006e",
  },
  {
    slug: "selling-digital-assets",
    title: "How to Price Your Digital Assets",
    excerpt:
      "Pricing digital work is part art, part science. We break down the strategies top-earning creators use to maximise revenue without underselling their work.",
    category: "Business",
    date: "Jun 15, 2026",
    readTime: "7 min read",
    color: "#b537f2",
  },
  {
    slug: "motion-design-trends",
    title: "Motion Design Trends Shaping Interfaces",
    excerpt:
      "Micro-interactions, Lottie animations, and scroll-driven effects — a deep dive into the motion patterns dominating product design in 2026.",
    category: "Motion",
    date: "Jun 1, 2026",
    readTime: "6 min read",
    color: "#00f5ff",
  },
  {
    slug: "3d-assets-blender",
    title: "From Blender to Marketplace: A Creator's Guide",
    excerpt:
      "Everything you need to know about preparing, exporting, and listing your 3D assets on NEXUS — from file formats to writing descriptions that sell.",
    category: "3D",
    date: "May 20, 2026",
    readTime: "9 min read",
    color: "#39ff14",
  },
  {
    slug: "typography-2025",
    title: "Variable Fonts Are Finally Having Their Moment",
    excerpt:
      "After years of slow adoption, variable font technology is mainstream. Here's why type designers are excited and what it means for buyers.",
    category: "Typography",
    date: "May 8, 2026",
    readTime: "4 min read",
    color: "#ff006e",
  },
  {
    slug: "creator-spotlight-chen",
    title: "Creator Spotlight: Maya Chen on Building Icon Sets",
    excerpt:
      "We sat down with one of NEXUS's top icon designers to learn about her process, tools, and how she grew her catalog to 40+ packs in 18 months.",
    category: "Interview",
    date: "Apr 25, 2026",
    readTime: "8 min read",
    color: "#b537f2",
  },
];

export default function Blog() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Navigation />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "5rem" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              color: "#ff006e",
              marginBottom: "0.75rem",
            }}
            className="neon-glow-pink"
          >
            NEXUS BLOG
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.55)",
              fontSize: "1rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Design insights, creator stories, and marketplace updates.
          </p>
        </div>

        {/* Featured post */}
        <div
          style={{
            padding: "2.5rem",
            backgroundColor: "#1a1f3a",
            border: "1px solid #2a2f4a",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#ff006e")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2f4a")}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              backgroundColor: "rgba(255,0,110,0.15)",
              border: "1px solid rgba(255,0,110,0.3)",
              borderRadius: "999px",
              color: "#ff006e",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            FEATURED
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "0.75rem",
            }}
          >
            {posts[0].title}
          </h2>
          <p
            style={{
              color: "rgba(200,220,255,0.6)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {posts[0].excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "rgba(0,245,255,0.5)",
                fontSize: "0.8rem",
              }}
            >
              <Calendar size={13} /> {posts[0].date}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "rgba(0,245,255,0.5)",
                fontSize: "0.8rem",
              }}
            >
              <Clock size={13} /> {posts[0].readTime}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#ff006e",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              Read more <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {posts.slice(1).map(post => (
            <div
              key={post.slug}
              style={{
                padding: "1.5rem",
                backgroundColor: "#1a1f3a",
                border: "1px solid #2a2f4a",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.borderColor = post.color)
              }
              onMouseLeave={e =>
                (e.currentTarget.style.borderColor = "#2a2f4a")
              }
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.2rem 0.6rem",
                  backgroundColor: `${post.color}18`,
                  border: `1px solid ${post.color}44`,
                  borderRadius: "999px",
                  color: post.color,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: "0.75rem",
                  width: "fit-content",
                }}
              >
                {post.category.toUpperCase()}
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.5rem",
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  color: "rgba(200,220,255,0.5)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {post.excerpt.substring(0, 100)}…
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "auto",
                }}
              >
                <span
                  style={{
                    color: "rgba(0,245,255,0.4)",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Calendar size={12} /> {post.date}
                </span>
                <span
                  style={{
                    color: "rgba(0,245,255,0.4)",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
