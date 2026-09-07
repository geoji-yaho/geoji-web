import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Card } from "./Card";

type InfoTableRow = {
	label: string;
	value: ReactNode;
	strong?: boolean;
};

type InfoTableProps = {
	rows: InfoTableRow[];
	className?: string;
};

export function InfoTable({ rows, className }: InfoTableProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<dl>
				{rows.map((row) => (
					<div
						key={row.label}
						className="flex justify-between gap-3 border-b border-line px-4 py-2.75 text-control last:border-b-0"
					>
						<dt className="whitespace-nowrap text-mute">{row.label}</dt>
						<dd className={cn("text-right text-text", row.strong && "font-black")}>{row.value}</dd>
					</div>
				))}
			</dl>
		</Card>
	);
}
