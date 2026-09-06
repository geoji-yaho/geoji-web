import { VerdictStamp } from "@/shared/components/VerdictStamp";
import type { Verdict } from "@/shared/domain/verdict";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { formatAmount } from "@/shared/utils/format";

type ShareCardPreviewProps = {
	caseLine: string;
	caseNumber: string;
	amount: number;
	headline: string;
	verdict: Verdict;
};

export function ShareCardPreview({ caseLine, caseNumber, amount, headline, verdict }: ShareCardPreviewProps) {
	return (
		<Reveal>
			<Card className="flex aspect-square w-full flex-col gap-2.5 overflow-hidden rounded-3xl p-4.5">
				<div className="flex justify-between text-caption font-bold text-mute">
					<span>{caseLine}</span>
					<span>{caseNumber}</span>
				</div>
				<div className="flex h-11/20 shrink-0 items-center justify-center rounded-xl border border-dashed border-line bg-screen text-xs text-dim">
					판결 짤 이미지 (카드의 절반 이상)
				</div>
				<div className="flex flex-1 items-center gap-3">
					<div className="flex flex-1 flex-col gap-1">
						<span className="text-amount-sm text-ink">{formatAmount(amount)}원</span>
						<p className="text-chip text-text">{headline}</p>
					</div>
					<VerdictStamp verdict={verdict} size="md" className="shrink-0 -rotate-10" />
				</div>
				<div className="flex items-center justify-between border-t border-line pt-2">
					<span className="text-control font-black text-ink">떼거지</span>
					<span className="text-caption font-extrabold text-mute">ttegeoji.app</span>
				</div>
			</Card>
		</Reveal>
	);
}
