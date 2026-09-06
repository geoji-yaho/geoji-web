import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";

type MyRankRowProps = {
	name: string;
	noSpendRank: number;
	nagRank: number;
	className?: string;
};

export function MyRankRow({ name, noSpendRank, nagRank, className }: MyRankRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-card bg-ink px-5 py-3.5 text-control text-card shadow-card",
				className
			)}
		>
			<Avatar name={name} size="sm" />
			<span className="flex-1 font-black">내 순위</span>
			<span>
				<b className="font-black text-cta">무지출 {noSpendRank}위</b>, 잔소리 {nagRank}위
			</span>
		</div>
	);
}
