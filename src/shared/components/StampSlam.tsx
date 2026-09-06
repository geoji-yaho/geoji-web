import { cva, type VariantProps } from "class-variance-authority";
import { type Easing, motion, type ResolvedValues, useReducedMotionConfig } from "motion/react";
import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

import { cn } from "../lib/cn";
import { DURATION, EASE_OUT } from "../lib/motion";

const SLAM_DURATION = 0.44;
const SLAM_TIMES = [0, 0.5, 0.75, 1];
const SLAM_EASE: Easing[] = ["easeIn", "easeOut", "easeInOut"];
const SLAM_SCALE = [2.2, 0.92, 1.03, 1];
const SLAM_OPACITY = [0, 1, 1, 1];
const SLAM_Y = [-28, 0, 0, 0];
const SLAM_ROTATE = [-16, 2, -1, 0];

const RIPPLE_SCALE_FROM = 0.7;
const RIPPLE_SCALE_TO = 1.7;
const RIPPLE_OPACITY_FROM = 0.35;

const rippleVariants = cva("pointer-events-none absolute inset-0 rounded-full", {
	variants: {
		side: {
			oppose: "bg-red/25",
			support: "bg-green/25",
			none: "bg-gray/25"
		}
	},
	defaultVariants: {
		side: "oppose"
	}
});

type StampSlamProps = PropsWithChildren<
	{
		onLand?: () => void;
		className?: string;
	} & VariantProps<typeof rippleVariants>
>;

export function StampSlam({ children, side, onLand, className }: StampSlamProps) {
	const reduced = useReducedMotionConfig();
	const [landed, setLanded] = useState(false);
	const landedRef = useRef(false);

	const onLandRef = useRef(onLand);
	useEffect(() => {
		onLandRef.current = onLand;
	});

	const land = useCallback(() => {
		if (landedRef.current) {
			return;
		}

		landedRef.current = true;
		setLanded(true);
		onLandRef.current?.();
	}, []);

	useEffect(() => {
		if (reduced) {
			land();
		}
	}, [reduced, land]);

	const handleUpdate = (latest: ResolvedValues) => {
		const scale = Number(latest.scale);

		if (!Number.isNaN(scale) && scale <= 1) {
			land();
		}
	};

	if (reduced) {
		return <span className={cn("relative inline-flex", className)}>{children}</span>;
	}

	return (
		<span className={cn("relative inline-flex", className)}>
			{landed && (
				<motion.span
					aria-hidden="true"
					className={rippleVariants({ side })}
					initial={{ scale: RIPPLE_SCALE_FROM, opacity: RIPPLE_OPACITY_FROM }}
					animate={{ scale: RIPPLE_SCALE_TO, opacity: 0 }}
					transition={{ duration: DURATION.slow, ease: EASE_OUT }}
				/>
			)}
			<motion.span
				className="relative inline-flex"
				animate={{
					scale: SLAM_SCALE,
					opacity: SLAM_OPACITY,
					y: SLAM_Y,
					rotate: SLAM_ROTATE
				}}
				transition={{ duration: SLAM_DURATION, times: SLAM_TIMES, ease: SLAM_EASE }}
				onUpdate={handleUpdate}
			>
				{children}
			</motion.span>
		</span>
	);
}
