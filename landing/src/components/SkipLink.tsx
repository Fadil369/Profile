import { useAppState } from "../AppState";

export function SkipLink() {
  const { isAr } = useAppState();
  return (
    <a className="skip-link" href="#main">
      {isAr ? "انتقل إلى المحتوى" : "Skip to content"}
    </a>
  );
}
