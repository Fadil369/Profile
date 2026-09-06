import { useEffect, type CSSProperties } from "react";

const LINKEDIN_BADGE_SCRIPT = "https://platform.linkedin.com/badges/js/profile.js";

const badgeFrameStyle: CSSProperties = {
  minHeight: "78px",
  width: "min(100%, 420px)",
  display: "flex",
  justifyContent: "center",
  padding: "12px",
  overflow: "hidden",
  borderRadius: "var(--radius-md)"
};

const fallbackStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "54px",
  padding: "12px 16px",
  color: "var(--accent)",
  fontWeight: 700,
  textDecoration: "none"
};

export function LinkedInBadge() {
  useEffect(() => {
    if (document.querySelector(`script[src="${LINKEDIN_BADGE_SCRIPT}"]`)) return;

    const script = document.createElement("script");
    script.src = LINKEDIN_BADGE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="linkedin-badge-wrap glass-card" style={badgeFrameStyle} aria-label="LinkedIn profile badge">
      <div
        className="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size="large"
        data-theme="dark"
        data-type="HORIZONTAL"
        data-vanity="fadil369"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link linkedin-badge-fallback"
          style={fallbackStyle}
          href="https://sa.linkedin.com/in/fadil369?trk=profile-badge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dr.Mohamed E.
        </a>
      </div>
    </div>
  );
}
