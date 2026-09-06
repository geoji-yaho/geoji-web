import { Camera } from "lucide-react";

import { cn } from "../lib/cn";

type AttachmentFieldProps = {
	label: string;
	file?: File | null;
	onSelect: (file: File | null) => void;
	className?: string;
};

export function AttachmentField({ label, file, onSelect, className }: AttachmentFieldProps) {
	return (
		<label
			className={cn(
				"flex cursor-pointer items-center gap-2 rounded-2xl bg-fill px-3.5 py-3 text-chip text-mute",
				"focus-within:ring-2 focus-within:ring-ink",
				file && "font-bold text-ink",
				className
			)}
		>
			<Camera className="size-4" aria-hidden="true" />
			<span className="truncate">{file?.name ?? label}</span>
			<input
				type="file"
				accept="image/*"
				className="sr-only"
				onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
			/>
		</label>
	);
}
