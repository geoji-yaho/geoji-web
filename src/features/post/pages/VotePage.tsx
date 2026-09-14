import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { expenseQueries, POST_TYPE_BY_EXPENSE_SOURCE } from "@/shared/api/expenses";
import { memberQueries } from "@/shared/api/members";
import { roomQueries } from "@/shared/api/rooms";
import { TRIAL_VERDICT_BY_VERDICT, trialQueries } from "@/shared/api/trials";
import { BackHeader } from "@/shared/components/BackHeader";
import { tierFromScore } from "@/shared/domain/tier";
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
import { useCastVote } from "../hooks/useCastVote";

const REASON_PRESETS = ["지하철이 있었잖아요", "라면은 900원", "이건 인정", "다음엔 도시락"];
const REASON_MAX_LENGTH = 500;
const MESSAGES = {
	missingRoom: "방 정보가 없습니다",
	loading: "사건을 불러오는 중",
	noExpense: "지출을 찾을 수 없습니다",
	noTrial: "재판이 없는 지출입니다"
} as const;

export function VotePage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const roomId = searchParams.get("room") ?? "";
	const hasRoom = roomId !== "";
	const [side, setSide] = useState<VoteSide>("oppose");
	const [reason, setReason] = useState("");

	const expense = useQuery({ ...expenseQueries.detailInRoom(roomId, postId), enabled: hasRoom });
	const trial = useQuery({ ...trialQueries.detail(roomId, postId), enabled: hasRoom });
	const members = useQuery({ ...memberQueries.list(roomId), enabled: hasRoom });
	const room = useQuery({ ...roomQueries.detail(roomId), enabled: hasRoom });
	const castVote = useCastVote();

	const currentExpense = expense.data ?? null;
	const currentTrial = trial.data ?? null;
	const isPending = hasRoom && (expense.isPending || trial.isPending || members.isPending || room.isPending);
	const firstError = [expense, trial, members, room].find((query) => query.isError)?.error ?? null;
	const notFound = expense.isSuccess && currentExpense === null;
	const noTrial = !notFound && trial.isSuccess && currentTrial === null;
	const eligibleCount = members.data ? Math.max(0, members.data.length - 1) : null;
	const progressLabel =
		currentTrial !== null && eligibleCount !== null
			? `${currentTrial.guiltyVotes + currentTrial.notGuiltyVotes}/${eligibleCount} 투표, ${formatRemaining(currentTrial.votingDeadline)}`
			: undefined;

	const trialCase =
		currentExpense !== null && currentTrial !== null
			? {
					expense: currentExpense,
					trial: currentTrial,
					postType: POST_TYPE_BY_EXPENSE_SOURCE[currentExpense.source],
					defendant: members.data?.find((member) => member.userId === currentExpense.userId)
				}
			: null;
	const defendantTier =
		trialCase?.defendant && trialCase.defendant.debtScore !== null
			? tierFromScore(trialCase.defendant.debtScore)
			: undefined;
	const chosenVerdict = trialCase === null ? null : VOTE_VERDICTS[trialCase.postType][side];
	const trialVerdict = chosenVerdict === null ? undefined : TRIAL_VERDICT_BY_VERDICT[chosenVerdict];
	const trimmedReason = reason.trim();
	const canSubmit =
		trialVerdict !== undefined && eligibleCount !== null && trimmedReason.length > 0 && !castVote.isPending;

	const appendReason = (preset: string) => {
		setReason((current) => (current ? `${current} ${preset}` : preset));
	};

	const submit = () => {
		if (trialCase === null || trialVerdict === undefined || eligibleCount === null) {
			return;
		}

		castVote.mutate(
			{
				roomId,
				expenseId: trialCase.expense.id,
				eligibleCount,
				input: { verdict: trialVerdict, reason: trimmedReason }
			},
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
				{notFound && <Alert>{MESSAGES.noExpense}</Alert>}
				{noTrial && <Alert>{MESSAGES.noTrial}</Alert>}

				{trialCase && (
					<>
						<Reveal>
							<CaseSummaryCard
								name={trialCase.defendant?.nickname ?? ""}
								tier={defendantTier}
								timeAgo={formatRelativeTime(trialCase.expense.spentAt)}
								category={trialCase.expense.category ?? undefined}
								amount={trialCase.expense.amount}
								title={trialCase.expense.memo ?? undefined}
								rules={room.data?.rules ?? []}
							/>
						</Reveal>

						<Reveal index={1} className="flex flex-col gap-2.5">
							<span className="text-label text-mute">
								평결<span className="text-red"> *</span>
							</span>
							<VerdictChoice postType={trialCase.postType} value={side} onChange={setSide} />
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
							{REASON_PRESETS.map((preset) => (
								<Chip key={preset} onClick={() => appendReason(preset)}>
									{preset}
								</Chip>
							))}
						</div>

						<p className="text-caption leading-normal text-dim">
							제출 후 수정할 수 없습니다. 사유는 판결 확정 후 피고인에게 공개됩니다
						</p>

						{castVote.isError && <Alert>{castVote.error.message}</Alert>}
					</>
				)}
			</div>

			{!hasRoom && <StickyCta label="홈으로 가기" onClick={() => void navigate("/")} className="sticky-cta" />}
			{chosenVerdict && (
				<StickyCta
					label={`${VERDICT_LABELS[chosenVerdict]}로 평결 제출`}
					onClick={submit}
					disabled={!canSubmit}
					className="sticky-cta"
				/>
			)}
		</div>
	);
}
