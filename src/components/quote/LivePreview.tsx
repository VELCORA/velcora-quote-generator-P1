import type { Quotation } from "@/lib/quotation";
import type { CompanyProfile } from "@/lib/quote-store";
import { QuoteSheet } from "@/components/QuoteSheet";
import { Button } from "@/components/ui/button";
import { Printer, MessageCircle, Mail } from "lucide-react";
import { printQuote, waLink, mailtoQuote } from "@/lib/export";

export function LivePreview({
  quote,
  profile,
  number,
  editable = false,
  onChange,
  className,
}: {
  quote: Quotation;
  profile: CompanyProfile;
  number: string;
  editable?: boolean;
  onChange?: (next: Quotation) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={printQuote}>
          <Printer className="h-4 w-4" /> Print
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(waLink(quote, profile), "_blank")}
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            window.location.href = mailtoQuote(quote, profile);
          }}
        >
          <Mail className="h-4 w-4" /> Email
        </Button>
      </div>
      <QuoteSheet
        quote={quote}
        profile={profile}
        number={number}
        editable={editable}
        onChange={onChange}
      />
    </div>
  );
}
