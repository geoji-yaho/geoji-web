import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { findMember, memberQueries, memberTier } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { profileQueries } from "@/shared/api/profile";
import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import type { PostType } from "@/shared/domain/post";
import { VERDICT_LABELS, VOTE_VERDICTS } from "@/shared/domain/verdict";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Chip } from "@/shared/ui/Chip";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TextField } from "@/shared/ui/TextField";
import { formatRelativeTime, formatRemaining } from "@/shared/utils/date";

import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { VerdictChoice, type VoteSide } from "../components/VerdictChoice";
import { useCastPostVote } from "../hooks/useCastPostVote";

const REASON_PRESETS: Record<PostType, string[]> = {
	spent: ["지하철이 있었잖아요", "라면은 900원", "이건 인정", "다음엔 도시락"],
	considering: ["이미 비슷한 거 있잖아요", "한 달만 참아봐요", "이건 필요하죠", "살 만해요"]
};
const REASON_MAX_LENGTH = 500;
const SUBMIT_LABEL = "평결 제출";
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

	const detail = post.data ?? null;
	const myUserId = me.data?.id;
	const isPending = hasRoom && (post.isPending || members.isPending || room.isPending || me.isPending);
	const firstError = [post, members, room, me].find((query) => query.isError)?.error ?? null;

	const voteCount = detail === null ? 0 : detail.tally.oppose + detail.tally.support;
	const progressLabel =
		detail === null
			? undefined
			: `${voteCount}/${detail.eligibleVoterCount} 투표, ${formatRemaining(detail.voteDeadlineAt)}`;

	const blockedMessage = (() => {
		if (detail === null || detail.canVote || myUserId === undefined) {
			return null;
		}
		if (detail.authorId === myUserId) {
			return MESSAGES.ownPost;
		}
		if (detail.juryStatus !== null) {
			return MESSAGES.closed;
		}
		return MESSAGES.alreadyVoted;
	})();

	const chosenVerdict = detail === null || side === null ? null : VOTE_VERDICTS[detail.postType][side];
	const trimmedReason = reason.trim();
	const canSubmit =
		detail !== null && detail.canVote && chosenVerdict !== null && trimmedReason.length > 0 && !castVote.isPending;

	const appendReason = (preset: string) => {
		setReason((current) => (current ? `${current} ${preset}` : preset));
	};

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

								<div className="flex flex-wrap gap-1.5">
									{REASON_PRESETS[detail.postType].map((preset) => (
										<Chip key={preset} onClick={() => appendReason(preset)}>
											{preset}
										</Chip>
									))}
								</div>

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
			{detail && detail.canVote && (
				<StickyCta
					label={chosenVerdict === null ? SUBMIT_LABEL : `${VERDICT_LABELS[chosenVerdict]}로 ${SUBMIT_LABEL}`}
					onClick={submit}
					disabled={!canSubmit}
					className="sticky-cta"
				/>
			)}
		</div>
	);
}
