import type { TextSource } from "@/shared/api/posts";
import { IntensityTag } from "@/shared/components/IntensityTag";
import type { Intensity } from "@/shared/domain/room";
import { Avatar } from "@/shared/ui/Avatar";
import { Card } from "@/shared/ui/Card";

type JudgeSentenceCardProps = {
	intensity: Intensity;
	statement: string[];
	sentencingReason: string | null;
	source: TextSource;
};

export function JudgeSentenceCard({ intensity, statement, sentencingReason, source }: JudgeSentenceCardProps) {
	const byAi = source === "AI";

	return (
		<Card className="flex flex-col gap-2.5 p-4">
			<div className="flex items-center gap-2">
				<Avatar name="판" size="xs" className="size-6.5 bg-ink text-card" />
				<h2 className="text-xs font-black text-ink">{byAi ? "AI 판사 선고" : "판결문"}</h2>
				<IntensityTag intensity={intensity} className="ml-auto" />
			</div>

			<div className="flex flex-col gap-1.5">
				{statement.map((line) => (
					<p key={line} className="text-body text-text">
						{line}
					</p>
				))}
			</div>

			{byAi && sentencingReason && (
				<div className="flex flex-col gap-1 border-t border-line pt-2.5">
					<span className="text-label text-mute">양형 이유</span>
					<p className="text-body text-text">{sentencingReason}</p>
				</div>
			)}

			{byAi && <p className="text-caption text-dim">판결문은 AI가 작성했습니다</p>}
		</Card>
	);
}
