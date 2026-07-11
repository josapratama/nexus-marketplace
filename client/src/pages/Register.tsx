import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Zap, Mail, Lock, User, UserPlus } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();

  const redirectTo = (() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    return r && r.startsWith("/") ? r : "/";
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
        return;
      }
      await utils.auth.me.refetch();
      navigate(redirectTo);
    } catch {
      toast.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    paddingLeft: "2.5rem",
    paddingRight: "1rem",
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",
    backgroundColor: "rgba(10,14,39,0.6)",
    border: "1px solid #2a2f4a",
    borderRadius: "0.5rem",
    color: "#e0eaff",
    fontSize: "0.9rem",
    fontFamily: "system-ui, sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "rgba(200,220,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "0.875rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(200,220,255,0.35)",
    pointerEvents: "none",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#00f5ff";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,245,255,0.1)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#2a2f4a";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0e27",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(181,55,242,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 10,
          backgroundColor: "#1a1f3a",
          border: "1px solid #2a2f4a",
          borderRadius: "1rem",
          padding: "2.5rem",
          boxShadow: "0 0 40px rgba(0,0,0,0.4), 0 0 80px rgba(181,55,242,0.05)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #b537f2, #00f5ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(181,55,242,0.4)",
            }}
          >
            <Zap size={20} color="#fff" />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            NEXUS
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "0.4rem",
            letterSpacing: "-0.01em",
          }}
        >
          Create account
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(200,220,255,0.5)",
            marginBottom: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Fill in the details below to get started
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Name */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={iconStyle} />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Email */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={iconStyle} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Password */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={iconStyle} />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.8rem",
              background: loading
                ? "#2a2f4a"
                : "linear-gradient(135deg, #b537f2, #00f5ff)",
              border: "none",
              borderRadius: "0.5rem",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: loading ? "none" : "0 0 20px rgba(181,55,242,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(181,55,242,0.5)";
            }}
            onMouseLeave={e => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(181,55,242,0.3)";
            }}
          >
            {loading ? (
              "Creating account…"
            ) : (
              <>
                <UserPlus size={16} /> Create account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #2a2f4a", margin: "1.75rem 0" }} />

        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "rgba(200,220,255,0.5)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            style={{
              color: "#00f5ff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
