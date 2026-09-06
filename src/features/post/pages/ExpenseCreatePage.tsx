import { useState } from "react";
import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { EXPENSE_CATEGORIES } from "@/shared/constants/expense-categories";
import { POST_TYPE_LABELS, type PostType } from "@/shared/domain/post";
import { AmountField } from "@/shared/ui/AmountField";
import { AttachmentField } from "@/shared/ui/AttachmentField";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";

import { HonestyModal } from "../components/HonestyModal";

const INITIAL_AMOUNT = "24,000";
const INITIAL_TITLE = "치킨 배달";
const INITIAL_CATEGORY = "배달";
const CAPTURED_AT_LABEL = "오늘 19:42";
const SHARED_ROOM_COUNT = 2;
const VAGUE_TITLE = "바쁘다바빠 현대사회 속 단비 같은 감각적 쾌락 추구";
const TITLE_MAX_LENGTH = 30;
const PLEA_MAX_LENGTH = 200;
const POST_TYPES = ["spent", "considering"] as const satisfies readonly PostType[];

export function ExpenseCreatePage() {
	const navigate = useNavigate();
	const [postType, setPostType] = useState<PostType>("spent");
	const [amount, setAmount] = useState(INITIAL_AMOUNT);
	const [title, setTitle] = useState(INITIAL_TITLE);
	const [category, setCategory] = useState<string>(INITIAL_CATEGORY);
	const [plea, setPlea] = useState("");
	const [evidence, setEvidence] = useState<File | null>(null);
	const [honestyOpen, setHonestyOpen] = useState(false);

	const openHonesty = () => {
		setTitle(VAGUE_TITLE);
		setHonestyOpen(true);
	};

	return (
		<div className="relative flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="지출 등록" secondaryText="30초 컷" leftIcon="close" onBack={() => navigate(-1)} />
			</div>

			<div className="flex flex-col gap-3 px-5 pt-2 pb-6">
				<TabSegment
					tabs={POST_TYPES}
					value={postType}
					renderLabel={(key) => POST_TYPE_LABELS[key]}
					onChange={setPostType}
				/>

				<AmountField label="얼마 썼어요?" value={amount} onChange={setAmount} />

				<TextField label="무엇을?" value={title} onChange={setTitle} maxLength={TITLE_MAX_LENGTH} />

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
					hint="선택"
					value={plea}
					onChange={setPlea}
					maxLength={PLEA_MAX_LENGTH}
					placeholder="왜 썼는지 변론하세요"
					multiline
				/>

				<div className="flex gap-2">
					<AttachmentField label="증거 사진 1장" file={evidence} onSelect={setEvidence} className="flex-1" />
					<span className="flex items-center rounded-2xl bg-card px-3.5 py-3 text-chip whitespace-nowrap text-mute">
						{CAPTURED_AT_LABEL}
					</span>
				</div>
			</div>

			<div className="sticky-cta flex flex-col gap-2.5">
				<p className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-center text-chip text-mute">
					이 지출은 내가 속한 <b className="text-ink">모든 방({SHARED_ROOM_COUNT}개)</b>에 공유됩니다
				</p>
				<StickyCta label="재판에 회부하기" onClick={openHonesty} />
			</div>

			<HonestyModal open={honestyOpen} originalTitle={VAGUE_TITLE} />
		</div>
	);
}
