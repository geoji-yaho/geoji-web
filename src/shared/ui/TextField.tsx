import { cn } from "../lib/cn";

type TextFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	maxLength?: number;
	required?: boolean;
	hint?: string;
	placeholder?: string;
	multiline?: boolean;
	autoCapitalize?: string;
	autoComplete?: string;
	className?: string;
};

const FIELD_STYLES = "w-full min-w-0 bg-transparent text-ink outline-none placeholder:font-normal placeholder:text-dim";
const TEXTAREA_STYLES = cn(FIELD_STYLES, "min-h-13 resize-none text-base");
const INPUT_STYLES = cn(FIELD_STYLES, "text-base font-extrabold");

export function TextField({
	label,
	value,
	onChange,
	maxLength,
	required = false,
	hint,
	placeholder,
	multiline = false,
	autoCapitalize,
	autoComplete,
	className
}: TextFieldProps) {
	const count = maxLength !== undefined && (
		<span aria-hidden="true" className="shrink-0 text-caption text-dim">
			{value.length}/{maxLength}
		</span>
	);

	return (
		<label className={cn("flex flex-col gap-1.5", className)}>
			<span className="flex items-center justify-between">
				<span className="text-label text-mute">
					{label}
					{required && <span className="text-red"> *</span>}
					{hint && <span className="font-normal tracking-normal"> ({hint})</span>}
				</span>
				{count}
			</span>
			<span className="flex items-center rounded-2xl bg-card px-4 py-3.5 shadow-card">
				{multiline ? (
					<textarea
						value={value}
						maxLength={maxLength}
						placeholder={placeholder}
						onChange={(event) => onChange(event.target.value)}
						className={TEXTAREA_STYLES}
					/>
				) : (
					<input
						value={value}
						maxLength={maxLength}
						placeholder={placeholder}
						autoCapitalize={autoCapitalize}
						autoComplete={autoComplete}
						onChange={(event) => onChange(event.target.value)}
						className={INPUT_STYLES}
					/>
				)}
			</span>
		</label>
	);
}
