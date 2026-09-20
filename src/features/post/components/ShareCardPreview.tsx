import type { Ref } from "react";

import type { Meme } from "@/shared/api/posts";
import { Logo } from "@/shared/components/Logo";
import { MemeThumbnail } from "@/shared/components/MemeThumbnail";
import { TierBadge } from "@/shared/components/TierBadge";
import { VerdictStamp } from "@/shared/components/VerdictStamp";
import type { Tier } from "@/shared/domain/tier";
import { type Sentence, SENTENCE_LABELS, SENTENCE_NOTES, type Verdict } from "@/shared/domain/verdict";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";
import { formatAmount } from "@/shared/utils/format";

type ShareCardPreviewProps = {
	ref?: Ref<HTMLDivElement>;
	verdict: Verdict;
	amount: number;
	category: string | null;
	headline: string | null;
	statement: string[];
	sentence?: Sentence;
	sentenceLabel?: string | null;
	defendantName: string;
	defendantTier?: Tier;
	siteLabel: string;
	meme?: Meme | null;
};

export function ShareCardPreview({
	ref,
	verdict,
	amount,
	category,
	headline,
	statement,
	sentence,
	sentenceLabel,
	defendantName,
	defendantTier,
	siteLabel,
	meme
}: ShareCardPreviewProps) {
	const label = sentence ? (sentenceLabel ?? SENTENCE_LABELS[sentence]) : null;
	const note = sentence && !sentenceLabel ? SENTENCE_NOTES[sentence] : null;

	return (
		<div ref={ref} className="w-full">
			<Card className="flex aspect-square w-full flex-col gap-3 overflow-hidden rounded-3xl p-4.5">
				{meme ? (
					<div className="relative -mx-4.5 -mt-4.5 min-h-0 flex-1 overflow-hidden">
						<MemeThumbnail size="lg" meme={{ src: meme.imageUrl, alt: headline ?? "판결 짤" }} className="size-full" />
						<div className="from-black/70 text-white absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-linear-to-b to-transparent px-4.5 pt-4.5 pb-7 text-caption font-bold">
							<span className="flex min-w-0 items-center gap-1.5">
								<span className="truncate">{defendantName}</span>
								{defendantTier && <TierBadge tier={defendantTier} />}
							</span>
							{category && <span className="shrink-0">{category}</span>}
						</div>
						<VerdictStamp verdict={verdict} size="lg" className="absolute right-2 bottom-2" />
					</div>
				) : (
					<div className="flex items-center justify-between gap-2 text-caption font-bold text-mute">
						<span className="flex min-w-0 items-center gap-1.5">
							<span className="truncate">{defendantName}</span>
							{defendantTier && <TierBadge tier={defendantTier} />}
						</span>
						{category && <span className="shrink-0">{category}</span>}
					</div>
				)}

				<div className={cn("flex items-center gap-3", meme ? "shrink-0" : "min-h-0 flex-1")}>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<span className="text-amount text-ink">{formatAmount(amount)}원</span>
						{headline && <p className="text-subtitle text-text">{headline}</p>}
						{statement.map((line) => (
							<p key={line} className="text-caption text-mute">
								{line}
							</p>
						))}
						{label && (
							<p className="flex flex-wrap items-baseline gap-1.5">
								<span className="text-caption text-mute">형량</span>
								<span className="text-control font-black text-red">{label}</span>
								{note && <span className="text-caption text-mute">{note}</span>}
							</p>
						)}
					</div>
					{!meme && <VerdictStamp verdict={verdict} size="lg" className="shrink-0" />}
				</div>

				<div className="flex items-center justify-between gap-3 border-t border-line pt-2.5">
					<Logo size="header" />
					<span className="truncate text-caption font-extrabold text-mute">{siteLabel}</span>
				</div>
			</Card>
		</div>
	);
}
