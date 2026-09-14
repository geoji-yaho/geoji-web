import { useQuery } from "@tanstack/react-query";
import { useAnimate, useReducedMotionConfig } from "motion/react";
import { type ReactNode, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { commentQueries } from "@/shared/api/comments";
import { expenseQueries, POST_TYPE_BY_EXPENSE_SOURCE } from "@/shared/api/expenses";
import { findMember, memberName, memberQueries, memberTier } from "@/shared/api/members";
import { INTENSITY_BY_SPICE_LEVEL, roomQueries } from "@/shared/api/rooms";
import {
	headlineFromVerdictText,
	sentenceFromDays,
	trialQueries,
	VERDICT_BY_TRIAL_VERDICT,
	verdictFromTrial
} from "@/shared/api/trials";
import { BackHeader } from "@/shared/components/BackHeader";
import { CommentSheet } from "@/shared/components/CommentSheet";
import { ExecutionCard } from "@/shared/components/ExecutionCard";
import { verdictCardPath } from "@/shared/constants/routes";
import { useCreateComment } from "@/shared/hooks/useCreateComment";
import { playStampSound, primeStampSound } from "@/shared/lib/stamp-sound";
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
import { useJudgeTrial } from "../hooks/useJudgeTrial";
import { executionFromTrial, TRIAL_MESSAGES } from "../utils/trial";

const SHAKE_X = [0, -5, 5, -3, 0];
const SHAKE_DURATION = 0.24;
const LAND_VIBRATION_MS = 35;
const DISMISSED_MESSAGE = "배심원이 모이지 않아 각하되었습니다";

export function VerdictPage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room") ?? "";
	const navigate = useNavigate();
	const enabled = roomId !== "" && postId !== "";

	const trial = useQuery({ ...trialQueries.detail(roomId, postId), enabled });
	const expense = useQuery({ ...expenseQueries.detailInRoom(roomId, postId), enabled });
	const members = useQuery({ ...memberQueries.list(roomId), enabled });
	const room = useQuery({ ...roomQueries.detail(roomId), enabled });
	const comments = useQuery({ ...commentQueries.list(roomId, postId), enabled });
	const judge = useJudgeTrial();
	const createComment = useCreateComment();

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

	const judgeNow = () => {
		if (soundOn) {
			primeStampSound();
		}

		judge.mutate({ roomId, expenseId: postId });
	};

	const pending = trial.isPending || expense.isPending || members.isPending || room.isPending;
	const loadError = trial.error ?? expense.error ?? members.error ?? room.error;

	let content: ReactNode = null;
	let cta: ReactNode = null;

	if (pending) {
		content = (
			<Card role="status" className="p-4 text-chip text-mute">
				{TRIAL_MESSAGES.loading}
			</Card>
		);
	} else if (loadError) {
		content = <Alert>{loadError.message}</Alert>;
	} else if (trial.isSuccess && expense.isSuccess && members.isSuccess && room.isSuccess) {
		const trialData = trial.data;
		const expenseData = expense.data;

		if (!trialData) {
			content = <Alert>{TRIAL_MESSAGES.noTrial}</Alert>;
		} else if (!expenseData) {
			content = <Alert>{TRIAL_MESSAGES.noExpense}</Alert>;
		} else {
			const verdict = verdictFromTrial(trialData);
			const judged = trialData.verdict !== null;
			const defendant = findMember(members.data, expenseData.userId);
			const sentence = verdict === "guilty" ? sentenceFromDays(trialData.sentenceDays) : undefined;
			const execution = executionFromTrial(trialData);
			const headline = verdict === "dismissed" ? DISMISSED_MESSAGE : headlineFromVerdictText(trialData.verdictText);
			const voters = trialData.votes.map((vote) => ({
				id: vote.id,
				name: memberName(findMember(members.data, vote.voterUserId)),
				verdict: VERDICT_BY_TRIAL_VERDICT[vote.verdict],
				reason: judged ? vote.reason : null
			}));

			content = (
				<>
					{verdict && (
						<VerdictHeadlineBlock verdict={verdict} headline={headline} sentence={sentence} onLand={handleLand} />
					)}

					<CaseOverviewTable
						expense={expenseData}
						defendantName={memberName(defendant)}
						defendantTier={memberTier(defendant)}
					/>

					<JurorTallyCard
						postType={POST_TYPE_BY_EXPENSE_SOURCE[expenseData.source]}
						tally={{ oppose: trialData.guiltyVotes, support: trialData.notGuiltyVotes }}
						voters={voters}
					/>

					{judged && trialData.verdictText && (
						<JudgeSentenceCard
							intensity={INTENSITY_BY_SPICE_LEVEL[room.data.spiceLevel]}
							message={trialData.verdictText}
						/>
					)}

					{execution && (
						<Reveal>
							<ExecutionCard execution={execution} />
						</Reveal>
					)}

					<CommentSummaryCard
						count={comments.isSuccess ? comments.data.length : null}
						onOpen={() => setCommentsOpen(true)}
					/>

					{judge.isError && <Alert>{judge.error.message}</Alert>}
				</>
			);

			cta =
				verdict === null ? (
					<StickyCta
						label={judge.isPending ? "판결하는 중" : "지금 판결하기"}
						onClick={judgeNow}
						disabled={judge.isPending}
						className="sticky-cta"
					/>
				) : (
					<StickyCta
						label="판결 카드 공유하기"
						onClick={() => void navigate(verdictCardPath(postId, roomId))}
						className="sticky-cta"
					/>
				);
		}
	}

	const commentItems = comments.isSuccess
		? comments.data.map((comment) => ({
				id: comment.id,
				authorName: memberName(findMember(members.data, comment.userId)),
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
				onSubmit={(content) => createComment.mutateAsync({ roomId, expenseId: postId, content })}
				isSubmitting={createComment.isPending}
				submitError={createComment.error?.message ?? null}
			/>
		</div>
	);
}
