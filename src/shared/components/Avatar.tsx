const SIZE_STYLES = {
	sm: "size-8 text-xs",
	md: "size-9 text-sm",
	lg: "size-14 text-lg"
} as const;

type AvatarProps = {
	label: string;
	size?: keyof typeof SIZE_STYLES;
	highlighted?: boolean;
};

export function Avatar({ label, size = "md", highlighted = false }: AvatarProps) {
	return (
		<span
			className={`flex shrink-0 items-center justify-center rounded-full font-bold ${SIZE_STYLES[size]} ${
				highlighted ? "bg-gold text-ink" : "bg-terracotta-soft text-ink"
			}`}
		>
			{label}
		</span>
	);
}
