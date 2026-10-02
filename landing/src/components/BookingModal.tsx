import { useRef } from "react";
import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { BOOKING_URL } from "../booking";
import { CONTACT_EMAIL } from "../workspace/content";
import { CloseIcon } from "../Icons";
import { useDialog } from "../hooks/useDialog";

export function BookingModal() {
  const { isAr } = useAppState();
  const { isOpen, close } = useBooking();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, isOpen, close);
  if (!isOpen) return null;
  return <div className="booking-backdrop" onClick={close}>
    <div ref={ref} tabIndex={-1} className="booking-dialog glass-card schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" onClick={e => e.stopPropagation()}>
      <div className="booking-header">
        <div>
          <h2 id="booking-dialog-title">{isAr ? "احجز موعدًا" : "Book a meeting"}</h2>
          <p>{isAr ? "اختر الوقت المناسب لك في تقويم Google — مدة اللقاء 60 دقيقة." : "Choose a time in Google Calendar for a 60-minute conversation."}</p>
        </div>
        <button className="icon-btn square" aria-label={isAr ? "إغلاق" : "Close"} onClick={close}><CloseIcon /></button>
      </div>
      <div className="booking-frame-wrap">
        <iframe src={BOOKING_URL} title={isAr ? "حجز موعد عبر تقويم Google" : "Google Calendar appointment scheduling"} className="booking-frame" width="100%" height="600" />
      </div>
      <div className="booking-fallbacks">
        <a className="booking-external" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{isAr ? "افتح في تقويم Google" : "Open in Google Calendar"}</a>
        <a className="booking-external" href={`mailto:${CONTACT_EMAIL}?subject=Meeting%20inquiry`}>{isAr ? "افتح مسودة بريد" : "Open email draft"}</a>
      </div>
    </div>
  </div>;
}
