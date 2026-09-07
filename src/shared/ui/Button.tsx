import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../lib/cn";

const buttonVariants = cva(
	"inline-flex w-full pressable items-center justify-center rounded-full disabled:bg-line disabled:text-mute disabled:shadow-none",
	{
		variants: {
			variant: {
				primary: "bg-cta py-4.25 text-base font-extrabold text-ink",
				secondary: "bg-fill py-3.5 text-sm font-bold text-ink",
				outline: "border border-line bg-transparent py-3 text-control text-mute",
				danger: "border border-red bg-transparent py-3 text-control text-red",
				ink: "bg-ink py-3.25 text-sm font-extrabold text-card",
				kakao: "bg-kakao py-4.25 text-base font-extrabold text-kakao-text"
			}
		},
		defaultVariants: {
			variant: "primary"
		}
	}
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
	return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}
