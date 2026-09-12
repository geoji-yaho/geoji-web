import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const avatarVariants = cva(
	"inline-flex shrink-0 items-center justify-center rounded-full bg-tan font-extrabold text-ink select-none",
	{
		variants: {
			size: {
				xl: "size-15 text-xl",
				lg: "size-10.5 text-subtitle font-extrabold",
				md: "size-9 text-control",
				sm: "size-7 text-xs",
				xs: "size-5.5 text-tag"
			}
		},
		defaultVariants: {
			size: "md"
		}
	}
);

type AvatarProps = VariantProps<typeof avatarVariants> & {
	name: string;
	className?: string;
};

export function Avatar({ name, size, className }: AvatarProps) {
	return (
		<span
			role={name ? "img" : undefined}
			aria-label={name || undefined}
			aria-hidden={name ? undefined : true}
			className={cn(avatarVariants({ size }), className)}
		>
			<span aria-hidden="true">{name.slice(0, 1)}</span>
		</span>
	);
}
