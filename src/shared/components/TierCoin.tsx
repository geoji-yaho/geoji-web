import { LOGO_COLORS } from "../constants/logo-colors";

type TierCoinProps = {
	filled: boolean;
};

export function TierCoin({ filled }: TierCoinProps) {
	const color = filled ? LOGO_COLORS.line : LOGO_COLORS.emptyCoin;

	return (
		<svg viewBox="0 0 40 40" aria-hidden="true" className="size-5 shrink-0">
			<circle cx="20" cy="20" r="16" fill={filled ? LOGO_COLORS.coin : "none"} stroke={color} strokeWidth={3.5} />
			<rect x="14.5" y="14.5" width="11" height="11" rx="2" fill={color} />
		</svg>
	);
}
