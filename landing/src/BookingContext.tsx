import { createContext, useContext, useState, type ReactNode } from "react";
import { withViewTransition } from "./viewTransition";

interface BookingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value: BookingContextValue = {
    isOpen,
    open: () => withViewTransition(() => setIsOpen(true)),
    close: () => withViewTransition(() => setIsOpen(false))
  };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
