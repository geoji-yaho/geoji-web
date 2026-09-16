import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

import type { Category, PostDraft, Submission } from "@/shared/api/posts";
import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import { EXPENSE_CATEGORIES } from "@/shared/constants/expense-categories";
import { POST_TYPE_LABELS, type PostType } from "@/shared/domain/post";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { AttachmentField } from "@/shared/ui/AttachmentField";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";
import { parseAmount } from "@/shared/utils/format";

import { useCompleteSubmission, useSubmitPost } from "../hooks/useSubmitPost";

const TITLE_MAX_LENGTH = 30;
const PLEA_MAX_LENGTH = 200;
const POST_TYPES = ["spent", "considering"] as const satisfies readonly PostType[];
const PLEA_PLACEHOLDER: Record<PostType, string> = {
	spent: "왜 썼는지 변론하세요",
	considering: "왜 사고 싶은지 말해보세요"
};
const BLOCKED_FALLBACK = "이대로는 등록할 수 없습니다. 내용을 고쳐 주세요";

export function ExpenseCreatePage() {
	const navigate = useNavigate();
	const [postType, setPostType] = useState<PostType>("spent");
	const [amount, setAmount] = useState("");
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [plea, setPlea] = useState("");
	const [evidence, setEvidence] = useState<File | null>(null);
	const [capturedAt] = useState(() => new Date());
	const [submission, setSubmission] = useState<Submission | null>(null);

	const rooms = useQuery(roomQueries.list());
	const submitPost = useSubmitPost();
	const completeSubmission = useCompleteSubmission();

	const parsedAmount = parseAmount(amount);
	const trimmedTitle = title.trim();
	const trimmedPlea = plea.trim();
	const roomIds = rooms.data?.map((room) => room.id) ?? [];
	const draft: PostDraft | null =
		parsedAmount !== null && trimmedTitle.length > 0 && category.length > 0 && roomIds.length > 0
			? {
					postType,
					amountKrw: parsedAmount,
					category: category as Category,
					item: trimmedTitle,
					reason: trimmedPlea.length > 0 ? trimmedPlea : null,
					roomIds
				}
			: null;

	const working = submitPost.isPending || completeSubmission.isPending;
	const roomCountLabel = rooms.isSuccess ? `(${rooms.data.length}개)` : "";
	const requestError = submitPost.error ?? completeSubmission.error;
	const intake = submission?.intakeResult ?? null;
	const blocked = submission?.status === "BLOCKED";
	const asking = submission?.status === "NEEDS_INPUT";

	const done = (result: Submission) => {
		setSubmission(result);
		if (result.postId) {
			void navigate(`/rooms/${roomIds[0]}`);
		}
	};

	const submit = () => {
		if (!draft) {
			return;
		}
		submitPost.mutate(draft, { onSuccess: done });
	};

	const complete = (action: "REVISE" | "PROCEED") => {
		if (!draft || submission === null) {
			return;
		}
		completeSubmission.mutate(
			{ ...draft, submissionId: submission.submissionId, action, revision: submission.revision },
			{ onSuccess: done }
		);
	};

	const suggestion = intake?.itemReview?.suggestedItem ?? null;

	return (
		<div className="relative flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="지출 등록" secondaryText="30초 컷" leftIcon="close" onBack={() => void navigate(-1)} />
			</div>

			<div className="flex flex-col gap-3 px-5 pt-2 pb-6">
				<TabSegment
					tabs={POST_TYPES}
					value={postType}
					renderLabel={(key) => POST_TYPE_LABELS[key]}
					onChange={setPostType}
				/>

				<AmountField label="얼마 썼어요?" value={amount} onChange={setAmount} />

				<TextField label="무엇을?" required value={title} onChange={setTitle} maxLength={TITLE_MAX_LENGTH} />

				<div className="flex flex-col gap-2">
					<span className="text-label text-mute">어디에?</span>
					<div className="flex flex-wrap gap-1.5">
						{EXPENSE_CATEGORIES.map((name) => (
							<Chip key={name} selected={name === category} onClick={() => setCategory(name)}>
								{name}
							</Chip>
						))}
					</div>
				</div>

				<TextField
					label="변론"
					hint="선택, 판결문에 반영됩니다"
					value={plea}
					onChange={setPlea}
					maxLength={PLEA_MAX_LENGTH}
					placeholder={PLEA_PLACEHOLDER[postType]}
					multiline
				/>

				<AttachmentField label="증거 사진 1장" file={evidence} onSelect={setEvidence} />

				<p className="text-chip text-mute">
					일시 오늘 {capturedAt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
					{postType === "considering" && " (변경 불가)"}
				</p>

				{(asking || blocked) && (
					<Card className="flex flex-col gap-2.5 p-4">
						<span className="text-label text-mute">심문관</span>
						<p className="text-body text-text">{intake?.message ?? BLOCKED_FALLBACK}</p>
						{suggestion && (
							<Chip selected={false} onClick={() => setTitle(suggestion)}>
								{suggestion}
							</Chip>
						)}
						<div className="flex gap-2.5 pt-1">
							<Button
								variant="secondary"
								className="flex-1"
								onClick={() => complete("REVISE")}
								disabled={working || !draft}
							>
								고쳐서 다시
							</Button>
							{asking && (
								<Button className="flex-1" onClick={() => complete("PROCEED")} disabled={working}>
									그대로 등록
								</Button>
							)}
						</div>
					</Card>
				)}

				{requestError && <Alert>{requestError.message}</Alert>}
			</div>

			<div className="sticky-cta flex flex-col gap-2.5">
				<p className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-center text-chip text-mute">
					이 지출은 내가 속한 <b className="text-ink">모든 방{roomCountLabel}</b>에 공유됩니다
				</p>
				{!asking && !blocked && (
					<StickyCta
						label={working ? "회부 중" : "재판에 회부하기"}
						onClick={submit}
						disabled={draft === null || working}
					/>
				)}
			</div>
		</div>
	);
}
