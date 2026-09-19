import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import type { ApiError } from "@/shared/api/api-error";
import type { CompleteSubmissionInput, PostDraft, Submission } from "@/shared/api/posts";
import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import { type Category, EXPENSE_CATEGORIES } from "@/shared/constants/expense-categories";
import { POST_TYPE_LABELS, type PostType } from "@/shared/domain/post";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";
import { parseAmount } from "@/shared/utils/format";

import { HonestyModal } from "../components/HonestyModal";
import { useCompleteSubmission, useSubmitPost } from "../hooks/useSubmitPost";

const TITLE_MAX_LENGTH = 30;
const PLEA_MAX_LENGTH = 200;
const POST_TYPES = ["spent", "considering"] as const satisfies readonly PostType[];
const PLEA_PLACEHOLDER: Record<PostType, string> = {
	spent: "왜 썼는지 변론하세요",
	considering: "왜 사고 싶은지 말해보세요"
};
const AMOUNT_LABEL: Record<PostType, string> = {
	spent: "얼마 썼어요?",
	considering: "얼마예요?"
};
const SUBJECT_LABEL: Record<PostType, string> = {
	spent: "무엇을?",
	considering: "무엇을 살까요?"
};
const BLOCKED_MESSAGE = "이대로는 등록할 수 없습니다. 내용을 고쳐 다시 회부해 주세요";

export function ExpenseCreatePage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room");
	const [postType, setPostType] = useState<PostType>("spent");
	const [amount, setAmount] = useState("");
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState<Category | null>(null);
	const [plea, setPlea] = useState("");
	const [capturedAt] = useState(() => new Date());
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

	const rooms = useQuery(roomQueries.list());
	const submitPost = useSubmitPost();
	const completeSubmission = useCompleteSubmission();

	const parsedAmount = parseAmount(amount);
	const trimmedTitle = title.trim();
	const trimmedPlea = plea.trim();
	const roomIds = rooms.data?.map((room) => room.id) ?? [];
	const canBuildDraft = parsedAmount !== null && trimmedTitle.length > 0 && category !== null && roomIds.length > 0;
	const draft: PostDraft | null = canBuildDraft
		? {
				postType,
				amountKrw: parsedAmount,
				category,
				item: trimmedTitle,
				reason: trimmedPlea.length > 0 ? trimmedPlea : null,
				roomIds
			}
		: null;

	const isSubmitting = submitPost.isPending;
	const isModalOpen = submission !== null;
	const intake = submission?.intakeResult ?? null;
	const roomCountLabel = rooms.isSuccess ? `(${rooms.data.length}개)` : "";
	const requestError = submitPost.error ?? completeSubmission.error;

	const handleResult = (result: Submission) => {
		if (result.status === "COMPLETED") {
			const notice = `${roomIds.length}개 방의 배심원에게 회부되었습니다`;
			void navigate(`/rooms/${roomId ?? roomIds[0]}`, { state: { notice } });
			return;
		}

		if (result.status === "BLOCKED" && result.intakeResult?.mode === "FINAL_CHECK") {
			setSubmission(null);
			setBlockedMessage(BLOCKED_MESSAGE);
			return;
		}

		setSubmission(result);
	};

	const handleCompleteError = (error: ApiError) => {
		if (error.kind === "conflict") {
			setSubmission(null);
		}
	};

	const handleSubmit = () => {
		if (draft === null) {
			return;
		}

		setBlockedMessage(null);
		completeSubmission.reset();
		submitPost.mutate(draft, { onSuccess: handleResult });
	};

	const handleRevise = (item: string) => {
		if (draft === null || submission === null) {
			return;
		}

		const input: CompleteSubmissionInput = {
			...draft,
			item,
			submissionId: submission.submissionId,
			action: "REVISE",
			revision: submission.revision
		};
		completeSubmission.mutate(input, {
			onSuccess: (result) => {
				setTitle(item);
				handleResult(result);
			},
			onError: handleCompleteError
		});
	};

	const handleProceed = () => {
		if (draft === null || submission === null) {
			return;
		}

		const input: CompleteSubmissionInput = {
			...draft,
			submissionId: submission.submissionId,
			action: "PROCEED",
			revision: submission.revision
		};
		completeSubmission.mutate(input, { onSuccess: handleResult, onError: handleCompleteError });
	};

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

				<AmountField label={AMOUNT_LABEL[postType]} value={amount} onChange={setAmount} />

				<TextField
					label={SUBJECT_LABEL[postType]}
					required
					value={title}
					onChange={setTitle}
					maxLength={TITLE_MAX_LENGTH}
				/>

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

				<p className="text-chip text-mute">
					일시 오늘 {capturedAt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
					{postType === "considering" && " (변경 불가)"}
				</p>

				{blockedMessage && <Alert>{blockedMessage}</Alert>}
				{!isModalOpen && requestError && <Alert>{requestError.message}</Alert>}
			</div>

			<div className="sticky-cta flex flex-col gap-2.5">
				<p className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-center text-chip text-mute">
					이 지출은 내가 속한 <b className="text-ink">모든 방{roomCountLabel}</b>에 공유됩니다
				</p>
				{!isModalOpen && (
					<StickyCta
						label={isSubmitting ? "회부 중" : "재판에 회부하기"}
						onClick={handleSubmit}
						disabled={draft === null || isSubmitting}
					/>
				)}
			</div>

			<HonestyModal
				open={isModalOpen}
				originalTitle={trimmedTitle}
				message={intake?.message ?? null}
				suggestedTitle={intake?.itemReview?.suggestedItem ?? null}
				canProceed={submission?.status === "NEEDS_INPUT"}
				isPending={completeSubmission.isPending}
				errorMessage={completeSubmission.error?.message ?? null}
				onRevise={handleRevise}
				onProceed={handleProceed}
			/>
		</div>
	);
}
