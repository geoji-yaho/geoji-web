import { memberTier, type RoomMember } from "@/shared/api/members";
import type { PostVerdict, RoomPostSummary } from "@/shared/api/posts";
import { ExpenseCard } from "@/shared/components/ExpenseCard";
import { type ImageSource, isVotingClosed } from "@/shared/domain/post";
import type { Tier } from "@/shared/domain/tier";
import { useNow } from "@/shared/hooks/useNow";
import { formatRelativeTime, formatRemaining } from "@/shared/utils/date";

function voteDeadlineLabel(deadline: string, now: Date) {
	const remaining = formatRemaining(deadline, now);

	if (remaining === "마감") {
		return "투표 마감";
	}

	return remaining.startsWith("마감까지") ? `투표 ${remaining}` : `투표 마감까지 ${remaining}`;
}

function voteStateOf(post: RoomPostSummary, myUserId: string | undefined, closed: boolean) {
	if (closed) {
		return "closed";
	}

	if (myUserId === undefined) {
		return "unknownMe";
	}

	if (post.authorId === myUserId) {
		return "own";
	}

	return post.voted ? "voted" : "open";
}

type PostFeedCardProps = {
	post: RoomPostSummary;
	verdict: PostVerdict | undefined;
	author: RoomMember | undefined;
	myUserId: string | undefined;
	eligibleCount: number;
	commentCount: number;
	onVote: () => void;
	onOpenVerdict: () => void;
	onComments: () => void;
};

export function PostFeedCard({
	post,
	verdict,
	author,
	myUserId,
	eligibleCount,
	commentCount,
	onVote,
	onOpenVerdict,
	onComments
}: PostFeedCardProps) {
	const now = useNow();
	const tier: Tier | undefined = memberTier(author);
	const base = {
		name: post.authorNickname,
		imageUrl: author?.avatarUrl,
		tier,
		timeAgo: formatRelativeTime(post.createdAt, now),
		postType: post.postType,
		category: post.category,
		title: post.item,
		amount: post.amountKrw,
		commentCount,
		onComments
	};

	if (post.juryStatus === "dismissed") {
		return <ExpenseCard {...base} state="dismissed" />;
	}

	if (post.juryStatus !== null) {
		const view = verdict?.view ?? null;
		const meme: ImageSource | undefined = view?.meme ? { src: view.meme.imageUrl, alt: view.headline } : undefined;
		return (
			<ExpenseCard
				{...base}
				state="judged"
				verdict={post.juryStatus}
				tally={post.tally}
				sentence={view?.sentence ?? undefined}
				sentenceLabel={view?.sentenceLabel ?? undefined}
				headline={view?.headline ?? undefined}
				meme={meme}
				onOpenVerdict={onOpenVerdict}
			/>
		);
	}

	const closed = isVotingClosed(post, now);

	return (
		<ExpenseCard
			{...base}
			state="voting"
			deadlineLabel={voteDeadlineLabel(post.voteDeadlineAt, now)}
			tally={post.tally}
			eligibleCount={eligibleCount}
			voteState={voteStateOf(post, myUserId, closed)}
			onVote={onVote}
		/>
	);
}
