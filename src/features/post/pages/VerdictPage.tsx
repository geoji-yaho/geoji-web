import { useQuery } from "@tanstack/react-query";
import { useAnimate, useReducedMotionConfig } from "motion/react";
import { type ReactNode, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { findMember, memberQueries, memberTier } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { profileQueries } from "@/shared/api/profile";
import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import { CommentSheet } from "@/shared/components/CommentSheet";
import { MemeThumbnail } from "@/shared/components/MemeThumbnail";
import { verdictCardPath } from "@/shared/constants/routes";
import { useCreatePostComment } from "@/shared/hooks/useCreatePostComment";
import { useRemovePostComment } from "@/shared/hooks/useRemovePostComment";
import { playStampSound } from "@/shared/lib/stamp-sound";
import { isStampSoundOn, setStampSoundOn } from "@/shared/lib/stamp-sound-preference";
import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
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
import { useRemovePost } from "../hooks/useRemovePost";

const SHAKE_X = [0, -5, 5, -3, 0];
const SHAKE_DURATION = 0.24;
const LAND_VIBRATION_MS = 35;
const MESSAGES = {
	loading: "판결을 불러오는 중",
	voting: "배심원들이 투표하고 있습니다",
	generating: "AI 판사가 심리 중입니다",
	dismissed: "배심원이 모이지 않아 각하되었습니다",
	retry: "다시 시도"
} as const;
const REMOVE_COPY = {
	title: "게시물 삭제",
	message: "이 게시물을 삭제할까요? 판결과 댓글이 함께 사라집니다",
	confirmLabel: "삭제",
	pendingLabel: "삭제하는 중",
	notice: "게시물을 삭제했습니다"
} as const;

export function VerdictPage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room") ?? "";
	const navigate = useNavigate();
	const enabled = roomId !== "" && postId !== "";

	const me = useQuery(profileQueries.me());
	const post = useQuery({ ...postQueries.detail(postId, roomId), enabled });
	const members = useQuery({ ...memberQueries.list(roomId), enabled });
	const room = useQuery({ ...roomQueries.detail(roomId), enabled });
	const comments = useQuery({ ...postQueries.comments(postId, roomId), enabled });
	const verdict = usePostVerdict(postId, roomId, enabled);
	const createComment = useCreatePostComment();
	const removeComment = useRemovePostComment();
	const removePost = useRemovePost();

	const [soundOn, setSoundOn] = useState(isStampSoundOn);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [removeOpen, setRemoveOpen] = useState(false);
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

	const openComments = () => {
		createComment.reset();
		removeComment.reset();
		setCommentsOpen(true);
	};

	const closeRemoveSheet = () => {
		if (removePost.isPending) {
			return;
		}

		setRemoveOpen(false);
		removePost.reset();
	};

	const retryLoad = () => {
		void me.refetch();
		void post.refetch();
		void members.refetch();
		void room.refetch();
		void verdict.refetch();
	};

	const handleSoundChange = (on: boolean) => {
		setSoundOn(on);
		setStampSoundOn(on);
	};

	const submitRemove = () => {
		removePost.mutate(postId, {
			onSuccess: () =>
				void navigate(`/rooms/${encodeURIComponent(roomId)}`, {
					replace: true,
					state: { notice: REMOVE_COPY.notice }
				})
		});
	};

	const detail = post.data ?? null;
	const state = verdict.data ?? null;
	const view = state?.view ?? null;
	const myUserId = me.data?.id;
	const isDismissed = state?.juryStatus === "dismissed";
	const pending = me.isPending || post.isPending || members.isPending || room.isPending || verdict.isPending;
	const loadError = me.error ?? post.error ?? members.error ?? room.error ?? verdict.error;

	const waitingMessage = (() => {
		if (state === null || view !== null || isDismissed) {
			return null;
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
	} else if (detail) {
		const defendant = findMember(members.data, detail.authorId);
		const canRemove = myUserId !== undefined && detail.authorId === myUserId;
		const hasVotes = detail.tally.oppose + detail.tally.support > 0;
		const voters = detail.votes.map((vote) => ({
			id: vote.id,
			name: vote.voterNickname,
			imageUrl: findMember(members.data, vote.voterId)?.avatarUrl,
			verdict: vote.verdict,
			reason: vote.reason
		}));

		content = (
			<>
				{isDismissed && <VerdictHeadlineBlock verdict="dismissed" headline={MESSAGES.dismissed} onLand={handleLand} />}

				{view && state?.juryStatus && !isDismissed && (
					<VerdictHeadlineBlock
						verdict={state.juryStatus}
						headline={view.headline}
						sentence={view.sentence ?? undefined}
						sentenceLabel={view.sentenceLabel}
						onLand={handleLand}
					/>
				)}

				{waitingMessage && (
					<Card role="status" className="flex flex-col gap-1.5 p-4.5">
						<span className="text-subtitle text-ink">{waitingMessage}</span>
						{state?.juryStatus !== null && (
							<span className="text-chip text-mute">판결문이 만들어지면 바로 나타납니다</span>
						)}
					</Card>
				)}

				{state?.juryStatus && !isDismissed && (
					<Reveal>
						<MemeThumbnail size="lg" meme={view?.meme ? { src: view.meme.imageUrl, alt: view.headline } : undefined} />
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

				{hasVotes && (
					<JurorTallyCard postType={detail.postType} tally={detail.tally} voters={voters} rules={room.data?.rules} />
				)}

				{view && (
					<JudgeSentenceCard
						intensity={view.intensity}
						statement={view.statement}
						sentencingReason={view.sentencingReason}
						source={view.source}
					/>
				)}

				<CommentSummaryCard count={comments.isSuccess ? comments.data.length : null} onOpen={openComments} />

				{canRemove && (
					<button
						type="button"
						onClick={() => setRemoveOpen(true)}
						className="pressable self-center text-control text-mute"
					>
						{REMOVE_COPY.title}
					</button>
				)}
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
				authorImageUrl: findMember(members.data, comment.userId)?.avatarUrl,
				content: comment.content,
				createdAtLabel: formatRelativeTime(comment.createdAt),
				isMine: myUserId !== undefined && comment.userId === myUserId
			}))
		: [];

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="판결" onBack={() => void navigate(-1)}>
					<SoundToggle checked={soundOn} onChange={handleSoundChange} />
				</BackHeader>
			</div>

			<div ref={scope} className="flex flex-col gap-3 px-5 pt-1.5 pb-10">
				{!pending && loadError && (
					<>
						<Alert>{loadError.message}</Alert>
						<Button variant="outline" onClick={retryLoad}>
							{MESSAGES.retry}
						</Button>
					</>
				)}
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
				onRemove={(commentId) => removeComment.mutateAsync({ postId, roomId, commentId })}
				removingId={removeComment.isPending ? removeComment.variables.commentId : null}
				removeError={removeComment.error?.message ?? null}
			/>

			<BottomSheet open={removeOpen} onClose={closeRemoveSheet} title={REMOVE_COPY.title}>
				<p className="text-chip text-mute">{REMOVE_COPY.message}</p>
				{removePost.isError && <Alert>{removePost.error.message}</Alert>}
				<div className="flex gap-2">
					<Button variant="outline" onClick={closeRemoveSheet} disabled={removePost.isPending}>
						취소
					</Button>
					<Button variant="danger" onClick={submitRemove} disabled={removePost.isPending}>
						{removePost.isPending ? REMOVE_COPY.pendingLabel : REMOVE_COPY.confirmLabel}
					</Button>
				</div>
			</BottomSheet>
		</div>
	);
}
