type TextFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	maxLength?: number;
	required?: boolean;
};

export function TextField({ label, value, onChange, maxLength, required = false }: TextFieldProps) {
	return (
		<label className="flex flex-col gap-2">
			<span className="flex items-center justify-between">
				<span className="text-sm text-muted">
					{label}
					{required && <span className="text-terracotta"> *</span>}
				</span>
				{maxLength && (
					<span className="text-xs text-muted">
						{value.length}/{maxLength}
					</span>
				)}
			</span>
			<input
				value={value}
				maxLength={maxLength}
				onChange={(event) => onChange(event.target.value)}
				className="rounded-2xl bg-card px-4 py-3 text-sm text-ink outline-none"
			/>
		</label>
	);
}
