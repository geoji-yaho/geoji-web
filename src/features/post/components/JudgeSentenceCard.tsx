import { IntensityTag } from "@/shared/components/IntensityTag";
import type { Intensity } from "@/shared/domain/room";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";

type JudgeSentenceCardProps = {
	intensity: Intensity;
	message: string;
};

export function JudgeSentenceCard({ intensity, message }: JudgeSentenceCardProps) {
	return (
		<Card className="flex flex-col gap-2.5 p-4">
			<div className="flex items-center gap-2">
				<Avatar name="판" size="xs" className="size-6.5 bg-ink text-card" />
				<h2 className="text-xs font-black text-ink">AI 판사 선고</h2>
				<IntensityTag intensity={intensity} className="ml-auto" />
			</div>
			<p className="text-body whitespace-pre-line text-text">{message}</p>
			<p className="text-caption text-dim">판결문은 AI가 작성했습니다</p>
		</Card>
	);
}
