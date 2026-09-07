import { useState } from "react";
import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import type { PostType } from "@/shared/domain/post";
import { VERDICT_LABELS, VOTE_VERDICTS } from "@/shared/domain/verdict";
import { Chip } from "@/shared/ui/Chip";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TextField } from "@/shared/ui/TextField";

import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { VerdictChoice, type VoteSide } from "../components/VerdictChoice";

const ROOM_PATH = "/rooms/1";

const CASE_POST_TYPE: PostType = "spent";

const CASE = {
	name: "지민",
	tier: "hardcore",
	timeAgo: "3시간 전",
	category: "배달",
	amount: 24000,
	title: "치킨 배달",
	plea: "야근하고 집에 왔는데 밥이 없었어요",
	ruleNote: "한 달에 배달음식 1번"
} as const;

const PROGRESS_LABEL = "4/5 투표, 마감 8시간";
const INITIAL_REASON = "라면 900원이 냉장고 옆에 있었을 텐데요. 밥이 없다는 건 변론이 아니라 자백입니다.";
const REASON_PRESETS = ["지하철이 있었잖아요", "라면은 900원", "이건 인정", "다음엔 도시락"];
const REASON_MAX_LENGTH = 500;

export function VotePage() {
	const navigate = useNavigate();
	const [side, setSide] = useState<VoteSide>("oppose");
	const [reason, setReason] = useState(INITIAL_REASON);

	const appendReason = (preset: string) => {
		setReason((current) => (current ? `${current} ${preset}` : preset));
	};

	const verdictLabel = VERDICT_LABELS[VOTE_VERDICTS[CASE_POST_TYPE][side]];

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="배심원 투표" secondaryText={PROGRESS_LABEL} onBack={() => navigate(-1)} />
			</div>

			<div className="flex flex-col gap-3.5 px-5 pt-1.5 pb-6">
				<Reveal>
					<CaseSummaryCard {...CASE} />
				</Reveal>

				<Reveal index={1} className="flex flex-col gap-2.5">
					<span className="text-label text-mute">
						평결<span className="text-red"> *</span>
					</span>
					<VerdictChoice postType={CASE_POST_TYPE} value={side} onChange={setSide} />
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
			</div>

			<StickyCta label={`${verdictLabel}로 평결 제출`} onClick={() => navigate(ROOM_PATH)} className="sticky-cta" />
		</div>
	);
}
