import { useId } from "react";

import { cn } from "@/shared/lib/cn";

type SoundToggleProps = {
	checked: boolean;
	onChange: (next: boolean) => void;
};

export function SoundToggle({ checked, onChange }: SoundToggleProps) {
	const labelId = useId();

	return (
		<span className="flex items-center gap-1.5 text-caption text-mute">
			<span id={labelId}>효과음</span>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				aria-labelledby={labelId}
				onClick={() => onChange(!checked)}
				className={cn("inline-flex h-5 w-8.5 shrink-0 items-center rounded-full p-0.5", checked ? "bg-ink" : "bg-line")}
			>
				<span
					aria-hidden="true"
					className={cn("duration-press size-4 rounded-full bg-cta transition-transform", checked && "translate-x-3.5")}
				/>
			</button>
		</span>
	);
}
