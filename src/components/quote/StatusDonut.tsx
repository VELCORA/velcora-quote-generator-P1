import type { QuoteStatus } from "@/lib/storage-types";
import { statusColor } from "./StatusBadge";

export interface DonutDatum {
  status: QuoteStatus;
  count: number;
}

export function StatusDonut({
  data,
  size = 160,
}: {
  data: DonutDatum[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const r = 15.9155;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 36 36" width={size} height={size} className="shrink-0 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-paper-line)" strokeWidth="3.5" />
        {total > 0 &&
          data.map((d) => {
            const len = (d.count / total) * c;
            const seg = (
              <circle
                key={d.status}
                cx="18"
                cy="18"
                r={r}
                fill="none"
                stroke={statusColor(d.status)}
                strokeWidth="3.5"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return seg;
          })}
        <text
          x="18"
          y="18"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 fill-ink"
          style={{ fontSize: "7px", fontWeight: 600 }}
        >
          {total}
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.status} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColor(d.status) }}
            />
            <span className="capitalize text-ink-soft">{d.status}</span>
            <span className="ml-auto font-medium text-ink">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
