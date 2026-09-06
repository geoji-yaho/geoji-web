import { animate, motion, useMotionValue, useReducedMotionConfig, useTransform } from "motion/react";
import { useEffect } from "react";

import { DURATION, EASE_OUT } from "../lib/motion";
import { formatAmount } from "../utils/format";

const DEFAULT_DURATION_SEC = DURATION.slow;

type AnimatedAmountProps = {
	value: number;
	className?: string;
	durationSec?: number;
};

export function AnimatedAmount({ value, className, durationSec = DEFAULT_DURATION_SEC }: AnimatedAmountProps) {
	const reduced = useReducedMotionConfig();
	const amount = useMotionValue(0);
	const text = useTransform(amount, (latest) => formatAmount(Math.round(latest)));

	useEffect(() => {
		if (reduced) {
			return;
		}

		const controls = animate(amount, value, { duration: durationSec, ease: EASE_OUT });

		return () => controls.stop();
	}, [amount, value, durationSec, reduced]);

	if (reduced) {
		return <span className={className}>{formatAmount(value)}</span>;
	}

	return <motion.span className={className}>{text}</motion.span>;
}
