import { DEBT_SCORE_PENDING_LABEL } from "../domain/score";
import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";

type MyRankRowProps = {
	name: string;
	imageUrl?: string | null;
	rank: number | null;
	className?: string;
};

export function MyRankRow({ name, imageUrl, rank, className }: MyRankRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-card bg-ink px-5 py-3.5 text-control text-card shadow-card",
				className
			)}
		>
			<Avatar name={name} src={imageUrl} size="sm" />
			<span className="flex-1 font-black">내 순위</span>
			<b className="font-black text-cta">{rank === null ? DEBT_SCORE_PENDING_LABEL : `거지력 ${rank}위`}</b>
		</div>
	);
}
