import { ChevronRight } from "lucide-react";

import { Card } from "@/shared/ui/Card";

type CommentSummaryCardProps = {
	count: number | null;
	onOpen: () => void;
};

export function CommentSummaryCard({ count, onOpen }: CommentSummaryCardProps) {
	return (
		<Card>
			<button
				type="button"
				onClick={onOpen}
				className="flex w-full pressable items-center justify-between px-4 py-3.25 text-left"
			>
				<span className="text-control font-bold text-mute">{count === null ? "댓글" : `댓글 ${count}개`}</span>
				<ChevronRight className="size-4 text-dim" strokeWidth={2.5} aria-hidden="true" />
			</button>
		</Card>
	);
}
