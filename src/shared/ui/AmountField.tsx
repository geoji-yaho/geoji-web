import { cn } from "../lib/cn";

type AmountFieldProps = {
	label: string;
	labelHidden?: boolean;
	caption?: string;
	value: string;
	onChange: (value: string) => void;
	unit?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
};

export function AmountField({
	label,
	labelHidden = false,
	caption,
	value,
	onChange,
	unit = "원",
	placeholder = "0",
	disabled = false,
	className
}: AmountFieldProps) {
	return (
		<label className={cn("flex flex-col gap-1.5", className)}>
			<span className={cn("text-label text-mute", labelHidden && "sr-only")}>{label}</span>
			<span className={cn("flex items-end gap-1 border-b-2 pb-1", disabled ? "border-line" : "border-red")}>
				<input
					inputMode="numeric"
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
					className={cn(
						"w-full min-w-0 bg-transparent text-amount outline-none placeholder:text-dim",
						disabled ? "text-dim" : "text-ink"
					)}
				/>
				<span className={cn("pb-1 text-lg font-bold", disabled ? "text-dim" : "text-mute")}>{unit}</span>
				{caption && <span className="ml-auto shrink-0 pb-1.5 text-caption whitespace-nowrap text-mute">{caption}</span>}
			</span>
		</label>
	);
}
