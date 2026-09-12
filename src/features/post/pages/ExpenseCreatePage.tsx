import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

import { roomQueries } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import { EXPENSE_CATEGORIES } from "@/shared/constants/expense-categories";
import { POST_TYPE_LABELS, type PostType } from "@/shared/domain/post";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { AttachmentField } from "@/shared/ui/AttachmentField";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";
import { parseAmount } from "@/shared/utils/format";

import { EXPENSE_SOURCE_BY_POST_TYPE } from "../api/expenses";
import { useCreateExpense } from "../hooks/useCreateExpense";

const TITLE_MAX_LENGTH = 30;
const PLEA_MAX_LENGTH = 200;
const POST_TYPES = ["spent", "considering"] as const satisfies readonly PostType[];
const PLEA_PLACEHOLDER: Record<PostType, string> = {
	spent: "왜 썼는지 변론하세요",
	considering: "왜 사고 싶은지 말해보세요"
};

export function ExpenseCreatePage() {
	const navigate = useNavigate();
	const [postType, setPostType] = useState<PostType>("spent");
	const [amount, setAmount] = useState("");
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [plea, setPlea] = useState("");
	const [evidence, setEvidence] = useState<File | null>(null);
	const [capturedAt] = useState(() => new Date());

	const rooms = useQuery(roomQueries.list());
	const createExpense = useCreateExpense();
	const parsedAmount = parseAmount(amount);
	const trimmedTitle = title.trim();
	const draft =
		parsedAmount !== null && trimmedTitle.length > 0 && category.length > 0
			? { amount: parsedAmount, category, memo: trimmedTitle, source: EXPENSE_SOURCE_BY_POST_TYPE[postType] }
			: null;
	const canSubmit = draft !== null;
	const roomCountLabel = rooms.isSuccess ? `(${rooms.data.length}개)` : "";

	const submit = () => {
		if (!draft) return;
		createExpense.mutate(draft, { onSuccess: () => void navigate("/") });
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
					hint="선택, 지금은 저장되지 않습니다"
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

				{createExpense.isError && <Alert>{createExpense.error.message}</Alert>}
			</div>

			<div className="sticky-cta flex flex-col gap-2.5">
				<p className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-center text-chip text-mute">
					이 지출은 내가 속한 <b className="text-ink">모든 방{roomCountLabel}</b>에 공유됩니다
				</p>
				<StickyCta
					label={createExpense.isPending ? "회부 중" : "재판에 회부하기"}
					onClick={submit}
					disabled={!canSubmit || createExpense.isPending}
				/>
			</div>
		</div>
	);
}
