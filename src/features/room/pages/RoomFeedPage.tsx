import { Link, useNavigate } from "react-router";

import { ExpenseCard } from "@/shared/components/ExpenseCard";
import { TierBadge } from "@/shared/components/TierBadge";
import type { Reaction } from "@/shared/domain/post";
import { Fab } from "@/shared/ui/Fab";
import { Reveal } from "@/shared/ui/Reveal";

const ME = {
	tier: "flower",
	noSpendDays: 6,
	score: 71
} as const;

const VOTING_REACTIONS: Reaction[] = [
	{ emoji: "😭", count: 2 },
	{ emoji: "😂", count: 5 }
];

const VOTING_POST = {
	id: 24,
	name: "지민",
	tier: "hardcore",
	timeAgo: "3시간 전",
	postType: "spent",
	category: "배달",
	title: "치킨 배달",
	amount: 24000,
	memo: "야근하고 집에 왔는데 밥이 없었어요",
	deadlineLabel: "마감까지 8시간",
	tally: { oppose: 3, support: 1 },
	eligibleCount: 5,
	commentCount: 4
} as const;

const JUDGED_POST = {
	id: 25,
	name: "현우",
	tier: "flower",
	timeAgo: "어제",
	postType: "considering",
	category: "쇼핑/패션",
	title: "에어팟 노캔",
	amount: 359000,
	memo: "에어팟 노캔, 통근이 힘들어요",
	verdict: "disagree",
	tally: { oppose: 4, support: 1 },
	headline: "통근 힘들면 이어폰 말고 일찍 자세요."
} as const;

export function RoomFeedPage() {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex flex-1 flex-col gap-3 px-5 py-3">
				<Reveal>
					<Link to="/me" className="flex pressable items-center gap-2 rounded-2xl bg-card px-3.5 py-2.5 text-chip">
						<span className="font-black whitespace-nowrap text-ink">무지출 {ME.noSpendDays}일</span>
						<TierBadge tier={ME.tier} />
						<span className="ml-auto font-black whitespace-nowrap text-red">
							{ME.score}점 <span aria-hidden="true">›</span>
						</span>
					</Link>
				</Reveal>

				<Reveal index={1}>
					<ExpenseCard
						state="voting"
						name={VOTING_POST.name}
						tier={VOTING_POST.tier}
						timeAgo={VOTING_POST.timeAgo}
						postType={VOTING_POST.postType}
						category={VOTING_POST.category}
						title={VOTING_POST.title}
						amount={VOTING_POST.amount}
						memo={VOTING_POST.memo}
						deadlineLabel={VOTING_POST.deadlineLabel}
						tally={VOTING_POST.tally}
						eligibleCount={VOTING_POST.eligibleCount}
						voteState="open"
						onVote={() => navigate(`/posts/${VOTING_POST.id}/vote`)}
						reactions={VOTING_REACTIONS}
						commentCount={VOTING_POST.commentCount}
					/>
				</Reveal>

				<Reveal index={2}>
					<Link to={`/posts/${JUDGED_POST.id}`} className="block pressable">
						<ExpenseCard
							state="judged"
							name={JUDGED_POST.name}
							tier={JUDGED_POST.tier}
							timeAgo={JUDGED_POST.timeAgo}
							postType={JUDGED_POST.postType}
							category={JUDGED_POST.category}
							title={JUDGED_POST.title}
							amount={JUDGED_POST.amount}
							memo={JUDGED_POST.memo}
							verdict={JUDGED_POST.verdict}
							tally={JUDGED_POST.tally}
							headline={JUDGED_POST.headline}
						/>
					</Link>
				</Reveal>
			</div>

			<Fab label="+ 지출 등록" onClick={() => navigate("/posts/new")} className="sticky bottom-6 z-40 mr-5 self-end" />
		</>
	);
}
