type AttachmentFieldProps = {
	label: string;
	onSelect: (file: File | null) => void;
};

export function AttachmentField({ label, onSelect }: AttachmentFieldProps) {
	return (
		<label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-line py-6 text-sm font-bold text-muted">
			<span aria-hidden="true">📷</span>
			{label}
			<input
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
			/>
		</label>
	);
}
