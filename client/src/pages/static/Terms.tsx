import Navigation from "@/components/Navigation";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the NEXUS marketplace ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 16 years old to use NEXUS. By creating an account you confirm you meet this requirement. Accounts may be suspended if we discover a user is under the minimum age.`,
  },
  {
    title: "3. Account Responsibilities",
    content: `You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately at security@nexus.io if you suspect unauthorised access to your account. NEXUS is not liable for losses arising from unauthorised use due to your failure to safeguard your credentials.`,
  },
  {
    title: "4. Purchasing Assets",
    content: `All sales are final unless otherwise stated. Buyers receive a license to use the purchased asset under the terms specified on the product page. Ownership of intellectual property remains with the original creator.`,
  },
  {
    title: "5. Selling on NEXUS",
    content: `Sellers must ensure they own or have the right to sell all listed assets. Uploading content that infringes third-party intellectual property rights will result in immediate removal and potential account termination. NEXUS takes a 20% platform fee on all sales.`,
  },
  {
    title: "6. Prohibited Content",
    content: `You may not list or use assets for: illegal purposes, creation of malware or deceptive content, adult content without explicit approval, content that infringes intellectual property, or content that promotes hate speech or violence.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `NEXUS is provided "as is" without warranties of any kind. To the maximum extent permitted by law, NEXUS and its affiliates shall not be liable for indirect, incidental, or consequential damages arising from your use of the Service.`,
  },
  {
    title: "8. Termination",
    content: `We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to other users. You may also delete your account at any time from your Profile settings.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration, except where prohibited by law.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We may update these Terms periodically. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms. Material changes will be notified via email at least 14 days in advance.`,
  },
];

export default function Terms() {
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
            TERMS OF SERVICE
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
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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
            <span style={{ color: "#00f5ff" }}>legal@nexus.io</span>
          </p>
        </div>
      </div>
    </div>
  );
}
