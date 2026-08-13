import * as React from "react";
import type { Quotation } from "@/lib/quotation";
import type { CompanyProfile } from "@/lib/quote-store";
import { LivePreview } from "@/components/quote/LivePreview";

/**
 * Renders a saved quote full-screen and triggers the browser print dialog.
 * The print CSS (in index.css) hides everything except `.print-sheet`, so only
 * the quotation is printed. After printing (or cancel) we call onClose.
 */
export function PrintSheet({
  quote,
  profile,
  number,
  onClose,
}: {
  quote: Quotation;
  profile: CompanyProfile;
  number: string;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handler = () => onClose();
    window.addEventListener("afterprint", handler);
    const t = window.setTimeout(() => window.print(), 60);
    return () => {
      window.removeEventListener("afterprint", handler);
      window.clearTimeout(t);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] overflow-auto bg-white">
      <LivePreview quote={quote} profile={profile} number={number} />
    </div>
  );
}
