import { X } from "lucide-react";

import { Chip } from "@/shared/ui/Chip";

const RULE_PRESETS = ["한 달에 배달음식 1번", "한 달에 택시 1번", "커피는 하루 1잔", "주말 외식 금지", "충동구매 금지"];

type RoomRuleEditorProps = {
	rules: string[];
	onChange: (rules: string[]) => void;
};

export function RoomRuleEditor({ rules, onChange }: RoomRuleEditorProps) {
	const presets = RULE_PRESETS.filter((preset) => !rules.includes(preset));

	return (
		<div className="flex flex-col gap-2">
			<span className="text-label text-mute">방 규칙, 선택, 최대 10</span>
			<div className="flex flex-wrap gap-1.5">
				{presets.map((preset) => (
					<Chip key={preset} onClick={() => onChange([...rules, preset])}>
						+ {preset}
					</Chip>
				))}
				<button
					type="button"
					className="inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-dim px-3.5 py-2 text-chip font-extrabold text-ink"
				>
					직접 입력
				</button>
			</div>
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
