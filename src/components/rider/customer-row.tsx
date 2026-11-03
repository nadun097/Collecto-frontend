import Link from "next/link";
import { Avatar, StatusChip } from "@/components/ui-collecto/primitives";
import { fmt } from "@/lib/calc";
import type { CalcCustomer } from "@/lib/types";

/** Tappable customer row used on rider Home ("Today's visits") and rider Customers. */
export function RiderCustomerRow({ c, sub }: { c: CalcCustomer; sub: string }) {
  return (
    <Link href={`/rider/customers/${c.id}`} className="flex w-full items-center gap-3 border-b border-line py-3.5 text-left hover:no-underline">
      <Avatar id={c.id} name={c.name} photo={c.photo} size={44} className="!text-[15px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-ink">{c.name}</span>
        <span className="truncate text-13 text-muted-ink">{sub}</span>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="num text-[15px] font-bold whitespace-nowrap text-ink">{fmt(c.dueNow)}</span>
        <StatusChip status={c.status} />
      </div>
    </Link>
  );
}
