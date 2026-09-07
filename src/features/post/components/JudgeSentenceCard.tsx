import { motion } from "motion/react";

import { IntensityTag } from "@/shared/components/IntensityTag";
import type { Intensity } from "@/shared/domain/room";
import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";

const LOCKED_OPACITY = 0.4;

type JudgeSentenceCardProps = {
	intensity: Intensity;
	message: string;
	locked?: boolean;
};

export function JudgeSentenceCard({ intensity, message, locked = false }: JudgeSentenceCardProps) {
	return (
		<Card className="p-4">
			<motion.div
				className="flex flex-col gap-2.5"
				initial={false}
				animate={{ opacity: locked ? LOCKED_OPACITY : 1 }}
				transition={{ duration: DURATION.base, ease: EASE_OUT }}
			>
				<div className="flex items-center gap-2">
					<Avatar name="판" size="xs" className="size-6.5 bg-ink text-card" />
					<h2 className="text-xs font-black text-ink">AI 판사 선고</h2>
					<IntensityTag intensity={intensity} className="ml-auto" />
				</div>
				<p className="text-body text-text">
					{message}
					{locked && (
						<span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-ink align-middle" />
					)}
				</p>
			</motion.div>
		</Card>
	);
}
