export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

export const DURATION = {
	press: 0.15,
	fast: 0.18,
	base: 0.26,
	slow: 0.4
} as const;

export const SPRING_SHEET = {
	type: "spring",
	stiffness: 420,
	damping: 38,
	mass: 0.9
} as const;

export const STAGGER_STEP = 0.045;
