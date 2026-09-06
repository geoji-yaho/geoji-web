type AmountFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	unit?: string;
};

export function AmountField({ label, value, onChange, unit = "원" }: AmountFieldProps) {
	return (
		<label className="flex flex-col gap-2">
			<span className="text-sm text-muted">{label}</span>
			<span className="flex items-baseline gap-1 border-b-2 border-terracotta pb-2">
				<input
					inputMode="numeric"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					className="w-full min-w-0 text-[44px] font-black text-ink outline-none"
				/>
				<span className="text-lg font-bold text-muted">{unit}</span>
			</span>
		</label>
	);
}
