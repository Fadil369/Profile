import { useAppState } from "../AppState";

export function Footer() {
  const { t } = useAppState();
  return (
    <footer className="site-footer">
      <span>{t.footerText}</span>
      <nav className="site-footer-links">
        <a href="/the_leverage_point.html" target="_blank" rel="noopener noreferrer">
          {t.leveragePoint}
        </a>
        <a href="https://orcid.org/0009-0003-7485-3575" target="_blank" rel="noopener noreferrer">
          ORCID
        </a>
        <a href="https://registry.brainsait.de/p/SA-PHY-000003" target="_blank" rel="noopener noreferrer">
          BPR · SA-PHY-000003
        </a>
      </nav>
    </footer>
  );
}
