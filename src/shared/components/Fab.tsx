type FabProps = {
	label: string;
	onClick?: () => void;
	fixed?: boolean;
};

export function Fab({ label, onClick, fixed = true }: FabProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex h-[52px] items-center rounded-full bg-gold px-5 text-sm font-bold text-ink ${
				fixed ? "fixed right-5 bottom-6" : ""
			}`}
		>
			{label}
		</button>
	);
}

type StickyCtaProps = {
	label: string;
	onClick?: () => void;
	fixed?: boolean;
};

export function StickyCta({ label, onClick, fixed = true }: StickyCtaProps) {
	return (
		<div className={fixed ? "fixed inset-x-5 bottom-5" : ""}>
			<button
				type="button"
				onClick={onClick}
				className="flex h-11 w-full items-center justify-center rounded-full bg-gold text-sm font-bold text-ink"
			>
				{label}
			</button>
		</div>
	);
}
