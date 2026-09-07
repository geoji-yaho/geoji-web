import { motion, useReducedMotionConfig } from "motion/react";
import type { PropsWithChildren } from "react";

import { DURATION, EASE_OUT, STAGGER_STEP } from "../lib/motion";

type RevealTag = "div" | "li" | "section" | "span";

type RevealProps = PropsWithChildren<{
	index?: number;
	className?: string;
	as?: RevealTag;
}>;

export function Reveal({ index = 0, children, className, as = "div" }: RevealProps) {
	const reduced = useReducedMotionConfig();
	const MotionTag = motion[as];

	if (reduced) {
		const StaticTag = as;
		return <StaticTag className={className}>{children}</StaticTag>;
	}

	return (
		<MotionTag
			className={className}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.base, ease: EASE_OUT, delay: Math.min(index, 8) * STAGGER_STEP }}
		>
			{children}
		</MotionTag>
	);
}
