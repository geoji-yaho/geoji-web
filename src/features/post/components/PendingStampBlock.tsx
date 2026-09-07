import { VerdictStamp } from "@/shared/components/VerdictStamp";
import type { Verdict } from "@/shared/domain/verdict";

type PendingStampBlockProps = {
	verdict: Verdict;
	caption: string;
	onStamp: () => void;
};

export function PendingStampBlock({ verdict, caption, onStamp }: PendingStampBlockProps) {
	return (
		<button
			type="button"
			onClick={onStamp}
			className="flex h-37.5 w-full pressable flex-col items-center justify-end gap-7"
		>
			<VerdictStamp verdict={verdict} size="lg" className="scale-140 -rotate-4 opacity-30 blur-xs" />
			<span className="text-control text-dim">{caption}</span>
		</button>
	);
}
