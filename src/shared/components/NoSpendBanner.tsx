import { Avatar } from "./Avatar";

type NoSpendBannerProps = {
	name: string;
	amount: number;
	clapCount: number;
};

export function NoSpendBanner({ name, amount, clapCount }: NoSpendBannerProps) {
	return (
		<div className="flex items-center gap-3 rounded-full bg-praise-soft px-4 py-3">
			<Avatar label={name.slice(0, 1)} size="sm" highlighted />
			<span className="flex-1 text-sm font-bold text-praise">
				{name}님이 오늘 {amount.toLocaleString("ko-KR")}원 썼어요
			</span>
			<span className="text-sm text-praise">👏 {clapCount}</span>
		</div>
	);
}
