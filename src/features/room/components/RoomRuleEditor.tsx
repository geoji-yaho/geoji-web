import { X } from "lucide-react";
import { type SubmitEvent, useState } from "react";

import { Button } from "@/shared/ui/Button";
import { Chip } from "@/shared/ui/Chip";
import { TextField } from "@/shared/ui/TextField";

const RULE_PRESETS = ["한 달에 배달음식 1번", "한 달에 택시 1번", "커피는 하루 1잔", "주말 외식 금지", "충동구매 금지"];

const RULE_MAX_COUNT = 10;
const RULE_MAX_LENGTH = 50;
const CUSTOM_RULE_LABEL = "직접 입력";
const DUPLICATE_MESSAGE = "이미 있는 규칙입니다";

type RoomRuleEditorProps = {
	rules: string[];
	onChange: (rules: string[]) => void;
};

export function RoomRuleEditor({ rules, onChange }: RoomRuleEditorProps) {
	const [draft, setDraft] = useState("");
	const [isCustomOpen, setIsCustomOpen] = useState(false);

	const presets = RULE_PRESETS.filter((preset) => !rules.includes(preset));
	const full = rules.length >= RULE_MAX_COUNT;
	const trimmedDraft = draft.trim();
	const isDuplicate = trimmedDraft !== "" && rules.includes(trimmedDraft);
	const canAddDraft = !full && trimmedDraft !== "" && !isDuplicate;

	const addRule = (rule: string) => {
		const trimmed = rule.trim();
		if (full || !trimmed || rules.includes(trimmed)) {
			return;
		}
		onChange([...rules, trimmed]);
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!canAddDraft) {
			return;
		}

		addRule(draft);
		setDraft("");
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-label text-mute">
				방 규칙, 선택, 최대 {RULE_MAX_COUNT} ({rules.length}/{RULE_MAX_COUNT})
			</span>
			<div className="flex flex-wrap gap-1.5">
				{presets.map((preset) => (
					<Chip key={preset} disabled={full} onClick={() => addRule(preset)}>
						+ {preset}
					</Chip>
				))}
				<Chip selected={isCustomOpen} disabled={full} onClick={() => setIsCustomOpen(!isCustomOpen)}>
					{CUSTOM_RULE_LABEL}
				</Chip>
			</div>
			{isCustomOpen && !full && (
				<form onSubmit={handleSubmit} className="flex flex-col gap-1">
					<div className="flex items-end gap-2">
						<TextField
							label={CUSTOM_RULE_LABEL}
							value={draft}
							onChange={setDraft}
							maxLength={RULE_MAX_LENGTH}
							className="flex-1"
						/>
						<Button type="submit" variant="secondary" disabled={!canAddDraft} className="w-auto px-5">
							추가
						</Button>
					</div>
					{isDuplicate && (
						<span role="status" className="text-caption text-red">
							{DUPLICATE_MESSAGE}
						</span>
					)}
				</form>
			)}
			{rules.length > 0 && (
				<ol className="flex flex-col gap-1.5">
					{rules.map((rule, index) => (
						<li
							key={rule}
							className="flex items-center justify-between gap-2 rounded-xl border border-line bg-card px-3.5 py-2.75 text-control"
						>
							<span>
								{index + 1}. {rule}
							</span>
							<button
								type="button"
								aria-label={`규칙 삭제: ${rule}`}
								onClick={() => onChange(rules.filter((item) => item !== rule))}
								className="shrink-0 text-dim"
							>
								<X className="size-3.5" aria-hidden="true" />
							</button>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
