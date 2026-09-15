import type { ChangeEvent } from "react";

import { cn } from "../lib/cn";
import { formatAmount } from "../utils/format";

const MAX_AMOUNT_DIGITS = 15;

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

function toDigits(value: string) {
	return value.replace(/\D/g, "");
}

function formatAmountInput(value: string) {
	const digits = toDigits(value)
		.replace(/^0+(?=\d)/, "")
		.slice(0, MAX_AMOUNT_DIGITS);
	return digits === "" ? "" : formatAmount(Number(digits));
}

function findCaretPosition(formatted: string, digitCount: number) {
	if (digitCount === 0) {
		return 0;
	}

	let seen = 0;
	for (let index = 0; index < formatted.length; index += 1) {
		if (/\d/.test(formatted.charAt(index))) {
			seen += 1;
		}

		if (seen === digitCount) {
			return index + 1;
		}
	}

	return formatted.length;
}

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
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.currentTarget;
		const caretDigitCount = toDigits(input.value.slice(0, input.selectionStart ?? input.value.length)).length;
		const next = formatAmountInput(input.value);

		onChange(next);
		requestAnimationFrame(() => {
			const position = findCaretPosition(next, caretDigitCount);
			input.setSelectionRange(position, position);
		});
	};

	return (
		<label className={cn("flex flex-col gap-1.5", className)}>
			<span className={cn("text-label text-mute", labelHidden && "sr-only")}>{label}</span>
			<span className={cn("flex items-end gap-1 border-b-2 pb-1", disabled ? "border-line" : "border-red")}>
				<input
					inputMode="numeric"
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					onChange={handleChange}
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
