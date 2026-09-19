import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { findMember, memberQueries, memberTier } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { profileQueries } from "@/shared/api/profile";
import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import { isVotingClosed } from "@/shared/domain/post";
import { VERDICT_LABELS, VOTE_VERDICTS } from "@/shared/domain/verdict";
import { useNow } from "@/shared/hooks/useNow";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TextField } from "@/shared/ui/TextField";
import { formatRelativeTime, formatRemaining, isPast } from "@/shared/utils/date";

import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { VerdictChoice, type VoteSide } from "../components/VerdictChoice";
import { useCastPostVote } from "../hooks/useCastPostVote";

const REASON_MAX_LENGTH = 500;
const SUBMIT_LABEL = "평결 제출";
const CLOSED_LABEL = "투표 마감";
const MESSAGES = {
	missingRoom: "방 정보가 없습니다",
	loading: "사건을 불러오는 중",
	alreadyVoted: "이미 투표했습니다",
	closed: "투표가 마감되었습니다",
	ownPost: "본인 게시물에는 투표할 수 없습니다"
} as const;

export function VotePage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const roomId = searchParams.get("room") ?? "";
	const hasRoom = roomId !== "";
	const [side, setSide] = useState<VoteSide | null>(null);
	const [reason, setReason] = useState("");

	const post = useQuery({ ...postQueries.detail(postId, roomId), enabled: hasRoom && postId !== "" });
	const members = useQuery({ ...memberQueries.list(roomId), enabled: hasRoom });
	const room = useQuery({ ...roomQueries.detail(roomId), enabled: hasRoom });
	const me = useQuery(profileQueries.me());
	const castVote = useCastPostVote();
	const now = useNow();

	const detail = post.data ?? null;
	const myUserId = me.data?.id;
	const isPending = hasRoom && (post.isPending || members.isPending || room.isPending || me.isPending);
	const firstError = [post, members, room, me].find((query) => query.isError)?.error ?? null;

	const voteCount = detail === null ? 0 : detail.tally.oppose + detail.tally.support;
	const isDeadlinePast = detail !== null && isPast(detail.voteDeadlineAt, now);
	const progressLabel =
		detail === null
			? undefined
			: `${voteCount}/${detail.eligibleVoterCount} 투표, ${formatRemaining(detail.voteDeadlineAt, now)}`;

	const blockedMessage = (() => {
		if (detail === null || myUserId === undefined) {
			return null;
		}
		if (detail.authorId === myUserId) {
			return MESSAGES.ownPost;
		}
		if (isVotingClosed(detail, now)) {
			return MESSAGES.closed;
		}
		return detail.canVote ? null : MESSAGES.alreadyVoted;
	})();

	const chosenVerdict = detail === null || side === null ? null : VOTE_VERDICTS[detail.postType][side];
	const trimmedReason = reason.trim();
	const canVote = detail !== null && detail.canVote && !isDeadlinePast;
	const hasVerdictInput = chosenVerdict !== null && trimmedReason.length > 0;
	const canSubmit = canVote && hasVerdictInput && !castVote.isPending;
	const submitLabel = (() => {
		if (isDeadlinePast) {
			return CLOSED_LABEL;
		}

		return chosenVerdict === null ? SUBMIT_LABEL : `${VERDICT_LABELS[chosenVerdict]}로 ${SUBMIT_LABEL}`;
	})();

	const submit = () => {
		if (detail === null || chosenVerdict === null) {
			return;
		}

		castVote.mutate(
			{ postId: detail.id, verdict: chosenVerdict, reason: trimmedReason, roomId },
			{ onSuccess: () => void navigate(`/rooms/${roomId}`) }
		);
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="배심원 투표" secondaryText={progressLabel} onBack={() => void navigate(-1)} />
			</div>

			<div className="flex flex-col gap-3.5 px-5 pt-1.5 pb-6">
				{!hasRoom && <Alert>{MESSAGES.missingRoom}</Alert>}
				{isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						{MESSAGES.loading}
					</Card>
				)}
				{firstError && <Alert>{firstError.message}</Alert>}

				{detail && (
					<>
						<Reveal>
							<CaseSummaryCard
								name={detail.authorNickname}
								imageUrl={findMember(members.data, detail.authorId)?.avatarUrl}
								tier={memberTier(findMember(members.data, detail.authorId))}
								timeAgo={formatRelativeTime(detail.createdAt)}
								category={detail.category}
								amount={detail.amountKrw}
								title={detail.item}
								reason={detail.reason}
								rules={room.data?.rules ?? []}
							/>
						</Reveal>

						{blockedMessage && <Alert>{blockedMessage}</Alert>}

						{detail.canVote && (
							<>
								<Reveal index={1} className="flex flex-col gap-2.5">
									<span className="text-label text-mute">
										평결<span className="text-red"> *</span>
									</span>
									<VerdictChoice postType={detail.postType} value={side} onChange={setSide} />
								</Reveal>

								<Reveal index={2}>
									<TextField
										label="판결 사유"
										required
										value={reason}
										onChange={setReason}
										maxLength={REASON_MAX_LENGTH}
										multiline
									/>
								</Reveal>

								<p className="text-caption leading-normal text-dim">
									제출 후 수정할 수 없습니다. 사유는 판결 확정 후 피고인에게 공개됩니다
								</p>
							</>
						)}

						{castVote.isError && <Alert>{castVote.error.message}</Alert>}
					</>
				)}
			</div>

			{!hasRoom && <StickyCta label="홈으로 가기" onClick={() => void navigate("/")} className="sticky-cta" />}
			{detail?.canVote && (
				<StickyCta label={submitLabel} onClick={submit} disabled={!canSubmit} className="sticky-cta" />
			)}
		</div>
	);
}
