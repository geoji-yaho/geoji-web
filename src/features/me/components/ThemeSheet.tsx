import { Check } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";

import { THEME_LABELS, type ThemePreference } from "@/shared/domain/theme";
import { cn } from "@/shared/lib/cn";
import type { ResolvedTheme } from "@/shared/lib/theme-store";
import { BottomSheet } from "@/shared/ui/BottomSheet";

const THEME_OPTIONS: ThemePreference[] = ["system", "light", "dark"];

const ARROW_STEPS: Record<string, number> = {
	ArrowDown: 1,
	ArrowRight: 1,
	ArrowUp: -1,
	ArrowLeft: -1
};

type ThemeSheetProps = {
	open: boolean;
	onClose: () => void;
	value: ThemePreference;
	resolved: ResolvedTheme;
	onSelect: (next: ThemePreference) => void;
};

export function ThemeSheet({ open, onClose, value, resolved, onSelect }: ThemeSheetProps) {
	const groupRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const step = ARROW_STEPS[event.key];

		if (!step) {
			return;
		}

		event.preventDefault();
		const current = THEME_OPTIONS.indexOf(value);
		const next = THEME_OPTIONS[(current + step + THEME_OPTIONS.length) % THEME_OPTIONS.length];
		onSelect(next);
		groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[THEME_OPTIONS.indexOf(next)]?.focus();
	};

	return (
		<BottomSheet open={open} onClose={onClose} title="화면 모드">
			<div ref={groupRef} role="radiogroup" aria-label="화면 모드" onKeyDown={handleKeyDown} className="flex flex-col">
				{THEME_OPTIONS.map((option) => {
					const selected = option === value;

					return (
						<button
							key={option}
							type="button"
							role="radio"
							aria-checked={selected}
							tabIndex={selected ? 0 : -1}
							onClick={() => {
								onSelect(option);
								onClose();
							}}
							className={cn(
								"flex pressable items-center justify-between rounded-2xl px-4 py-3.5 text-sm",
								selected ? "font-black text-ink" : "text-text"
							)}
						>
							{option === "system" ? `${THEME_LABELS.system} (${THEME_LABELS[resolved]})` : THEME_LABELS[option]}
							{selected && <Check className="size-4.5 shrink-0 text-ink" aria-hidden="true" />}
						</button>
					);
				})}
			</div>
		</BottomSheet>
	);
}
