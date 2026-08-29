import { useAppState } from "../AppState";

export function Footer() {
  const { t } = useAppState();
  return <footer className="site-footer">{t.footerText}</footer>;
}
