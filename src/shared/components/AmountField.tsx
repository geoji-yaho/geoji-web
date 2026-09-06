import { cn } from "../lib/cn";

type AmountFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	unit?: string;
	placeholder?: string;
	className?: string;
};

export function AmountField({ label, value, onChange, unit = "원", placeholder = "0", className }: AmountFieldProps) {
	return (
		<label className={cn("flex flex-col gap-1.5", className)}>
			<span className="text-label text-mute">{label}</span>
			<span className="flex items-end gap-1 border-b-2 border-red pb-1">
				<input
					inputMode="numeric"
					value={value}
					placeholder={placeholder}
					onChange={(event) => onChange(event.target.value)}
					className="w-full min-w-0 bg-transparent text-amount text-ink outline-none placeholder:text-dim"
				/>
				<span className="pb-1 text-lg font-bold text-mute">{unit}</span>
			</span>
		</label>
	);
}
