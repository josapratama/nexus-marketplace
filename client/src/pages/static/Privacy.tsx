import Navigation from "@/components/Navigation";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you create an account (name, email, password hash), place an order (billing details), or contact us. We also automatically collect usage data including pages visited, search queries, and click events — used solely to improve the platform. We do not sell personal data.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `Your information is used to process orders, provide customer support, send transactional emails (order confirmations), and improve the marketplace. We may send occasional product updates or newsletters — you can unsubscribe at any time from any email.`,
  },
  {
    title: "3. Data Sharing",
    content: `We do not sell, rent, or share your personal information with third parties for marketing purposes. We share data only with service providers necessary to operate the platform (e.g. payment processors, cloud hosting), and only to the extent required. All processors are contractually bound to GDPR-equivalent standards.`,
  },
  {
    title: "4. Cookies",
    content: `We use a single session cookie to keep you logged in. We do not use tracking cookies, third-party analytics cookies, or advertising cookies. See our Cookies Policy for details.`,
  },
  {
    title: "5. Data Retention",
    content: `Account data is retained for as long as your account is active. You can request deletion of your account and associated personal data at any time by emailing privacy@nexus.io. Order records are retained for 7 years for legal and tax compliance.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, correct, or delete your personal data. EU/UK residents have additional rights under GDPR/UK GDPR including the right to data portability and the right to object to processing. To exercise any of these rights, email privacy@nexus.io.`,
  },
  {
    title: "7. Security",
    content: `Passwords are hashed using bcrypt and never stored in plain text. All data in transit is encrypted via HTTPS/TLS. We conduct regular security audits and penetration tests. In the event of a data breach we will notify affected users within 72 hours.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Material changes will be communicated by email and by a notice on the platform at least 30 days before taking effect.`,
  },
];

export default function Privacy() {
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
            PRIVACY POLICY
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {sections.map(s => (
              <div
                key={s.title}
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
                  {s.title}
                </h2>
                <p
                  style={{
                    color: "rgba(200,220,255,0.65)",
                    lineHeight: 1.8,
                    fontSize: "0.9rem",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {s.content}
                </p>
              </div>
            ))}
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
