import { cn } from "../lib/cn";

type TextFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	maxLength?: number;
	required?: boolean;
	/** 선택 항목이면 라벨 옆에 붙는 말. 예: 선택 */
	hint?: string;
	placeholder?: string;
	multiline?: boolean;
	className?: string;
};

const FIELD_STYLES = "w-full min-w-0 bg-transparent text-ink outline-none placeholder:font-normal placeholder:text-dim";
const TEXTAREA_STYLES = `${FIELD_STYLES} min-h-13 resize-none text-body`;
const INPUT_STYLES = `${FIELD_STYLES} text-subtitle font-extrabold`;

export function TextField({
	label,
	value,
	onChange,
	maxLength,
	required = false,
	hint,
	placeholder,
	multiline = false,
	className
}: TextFieldProps) {
	const count = maxLength !== undefined && (
		<span className="shrink-0 text-caption text-dim">
			{value.length}/{maxLength}
		</span>
	);

	return (
		<label className={cn("flex flex-col gap-1.5", className)}>
			<span className="flex items-center justify-between">
				<span className="text-label text-mute">
					{label}
					{required && <span className="text-red"> *</span>}
					{hint && <span className="font-normal tracking-normal"> · {hint}</span>}
				</span>
				{multiline && count}
			</span>
			<span className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3.5 shadow-card">
				{multiline ? (
					<textarea
						value={value}
						maxLength={maxLength}
						placeholder={placeholder}
						onChange={(event) => onChange(event.target.value)}
						className={TEXTAREA_STYLES}
					/>
				) : (
					<>
						<input
							value={value}
							maxLength={maxLength}
							placeholder={placeholder}
							onChange={(event) => onChange(event.target.value)}
							className={INPUT_STYLES}
						/>
						{count}
					</>
				)}
			</span>
		</label>
	);
}
