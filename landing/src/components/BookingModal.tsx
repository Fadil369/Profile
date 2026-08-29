import { useEffect } from "react";
import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { BOOKING_EMBED_URL } from "../content";
import { CloseIcon } from "../Icons";

export function BookingModal() {
  const { t } = useAppState();
  const { isOpen, close } = useBooking();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="booking-backdrop" onClick={close}>
      <div
        className="booking-dialog glass-card"
        role="dialog"
        aria-modal="true"
        aria-label={t.bookModalTitle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="booking-header">
          <div>
            <h3>{t.bookModalTitle}</h3>
            <p>{t.bookModalSubtitle}</p>
          </div>
          <button className="icon-btn square" aria-label={t.bookModalClose} onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <div className="booking-frame-wrap">
          <iframe
            src={BOOKING_EMBED_URL}
            title={t.bookModalTitle}
            className="booking-frame"
            frameBorder="0"
          />
        </div>
        <a className="booking-external" href={BOOKING_EMBED_URL} target="_blank" rel="noopener noreferrer">
          {t.bookModalOpenExternal}
        </a>
      </div>
    </div>
  );
}
