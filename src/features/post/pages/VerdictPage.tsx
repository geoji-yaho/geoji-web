import { useQuery } from "@tanstack/react-query";
import { useAnimate, useReducedMotionConfig } from "motion/react";
import { type ReactNode, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { findMember, memberQueries, memberTier } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { BackHeader } from "@/shared/components/BackHeader";
import { CommentSheet } from "@/shared/components/CommentSheet";
import { MemeThumbnail } from "@/shared/components/MemeThumbnail";
import { verdictCardPath } from "@/shared/constants/routes";
import { useCreatePostComment } from "@/shared/hooks/useCreatePostComment";
import { playStampSound } from "@/shared/lib/stamp-sound";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { formatRelativeTime } from "@/shared/utils/date";

import { CaseOverviewTable } from "../components/CaseOverviewTable";
import { CommentSummaryCard } from "../components/CommentSummaryCard";
import { JudgeSentenceCard } from "../components/JudgeSentenceCard";
import { JurorTallyCard } from "../components/JurorTallyCard";
import { RoomMissingNotice } from "../components/RoomMissingNotice";
import { SoundToggle } from "../components/SoundToggle";
import { VerdictHeadlineBlock } from "../components/VerdictHeadlineBlock";
import { usePostVerdict } from "../hooks/usePostVerdict";

const SHAKE_X = [0, -5, 5, -3, 0];
const SHAKE_DURATION = 0.24;
const LAND_VIBRATION_MS = 35;
const MESSAGES = {
	loading: "판결을 불러오는 중",
	voting: "배심원들이 투표하고 있습니다",
	generating: "AI 판사가 심리 중입니다",
	dismissed: "배심원이 모이지 않아 각하되었습니다"
} as const;

export function VerdictPage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room") ?? "";
	const navigate = useNavigate();
	const enabled = roomId !== "" && postId !== "";

	const post = useQuery({ ...postQueries.detail(postId), enabled });
	const members = useQuery({ ...memberQueries.list(roomId), enabled });
	const comments = useQuery({ ...postQueries.comments(postId, roomId), enabled });
	const verdict = usePostVerdict(postId, roomId, enabled);
	const createComment = useCreatePostComment();

	const [soundOn, setSoundOn] = useState(true);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [scope, animate] = useAnimate();
	const reducedMotion = useReducedMotionConfig();

	if (!enabled) {
		return <RoomMissingNotice title="판결" />;
	}

	const handleLand = () => {
		if (soundOn) {
			playStampSound();
		}

		navigator.vibrate?.(LAND_VIBRATION_MS);

		if (!reducedMotion) {
			void animate(scope.current, { x: SHAKE_X }, { duration: SHAKE_DURATION, ease: "easeOut" });
		}
	};

	const detail = post.data ?? null;
	const state = verdict.data ?? null;
	const view = state?.view ?? null;
	const pending = post.isPending || members.isPending || verdict.isPending;
	const loadError = post.error ?? members.error ?? verdict.error;

	const waitingMessage = (() => {
		if (state === null || view !== null) {
			return null;
		}
		if (state.juryStatus === "dismissed") {
			return MESSAGES.dismissed;
		}
		return state.juryStatus === null ? MESSAGES.voting : MESSAGES.generating;
	})();

	let content: ReactNode = null;
	let cta: ReactNode = null;

	if (pending) {
		content = (
			<Card role="status" className="p-4 text-chip text-mute">
				{MESSAGES.loading}
			</Card>
		);
	} else if (loadError) {
		content = <Alert>{loadError.message}</Alert>;
	} else if (detail) {
		const defendant = findMember(members.data, detail.authorId);
		const voters = detail.votes.map((vote) => ({
			id: vote.id,
			name: vote.voterNickname,
			verdict: vote.verdict,
			reason: vote.reason
		}));

		content = (
			<>
				{view && state?.juryStatus && (
					<VerdictHeadlineBlock
						verdict={state.juryStatus}
						headline={view.headline}
						sentence={view.sentence ?? undefined}
						onLand={handleLand}
					/>
				)}

				{waitingMessage && (
					<Card role="status" className="flex flex-col gap-1.5 p-4.5">
						<span className="text-subtitle text-ink">{waitingMessage}</span>
						{state?.juryStatus !== null && state?.juryStatus !== "dismissed" && (
							<span className="text-chip text-mute">판결문이 만들어지면 바로 나타납니다</span>
						)}
					</Card>
				)}

				{view?.meme && (
					<Reveal>
						<MemeThumbnail size="lg" meme={{ src: view.meme.imageUrl, alt: view.headline }} />
					</Reveal>
				)}

				<CaseOverviewTable
					amount={detail.amountKrw}
					category={detail.category}
					item={detail.item}
					reason={detail.reason}
					spentAt={detail.createdAt}
					defendantName={detail.authorNickname}
					defendantTier={memberTier(defendant)}
				/>

				<JurorTallyCard postType={detail.postType} tally={detail.tally} voters={voters} />

				{view && (
					<JudgeSentenceCard
						intensity={view.intensity}
						statement={view.statement}
						sentencingReason={view.sentencingReason}
						source={view.source}
					/>
				)}

				<CommentSummaryCard
					count={comments.isSuccess ? comments.data.length : null}
					onOpen={() => setCommentsOpen(true)}
				/>
			</>
		);

		cta = view && (
			<StickyCta
				label="판결 카드 공유하기"
				onClick={() => void navigate(verdictCardPath(postId, roomId))}
				className="sticky-cta"
			/>
		);
	}

	const commentItems = comments.isSuccess
		? comments.data.map((comment) => ({
				id: comment.id,
				authorName: comment.nickname,
				content: comment.content,
				createdAtLabel: formatRelativeTime(comment.createdAt)
			}))
		: [];

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="판결" onBack={() => void navigate(-1)}>
					<SoundToggle checked={soundOn} onChange={setSoundOn} />
				</BackHeader>
			</div>

			<div ref={scope} className="flex flex-col gap-3 px-5 pt-1.5 pb-10">
				{content}
			</div>

			{cta}

			<CommentSheet
				open={commentsOpen}
				onClose={() => setCommentsOpen(false)}
				comments={commentItems}
				isLoading={comments.isPending}
				error={comments.error?.message ?? null}
				onSubmit={(content) => createComment.mutateAsync({ postId, roomId, content })}
				isSubmitting={createComment.isPending}
				submitError={createComment.error?.message ?? null}
			/>
		</div>
	);
}
