import type { Ref } from "react";

import type { Meme } from "@/shared/api/posts";
import { Logo } from "@/shared/components/Logo";
import { MemeThumbnail } from "@/shared/components/MemeThumbnail";
import { TierBadge } from "@/shared/components/TierBadge";
import { VerdictStamp } from "@/shared/components/VerdictStamp";
import type { Tier } from "@/shared/domain/tier";
import { type Sentence, SENTENCE_LABELS, SENTENCE_NOTES, type Verdict } from "@/shared/domain/verdict";
import { Card } from "@/shared/ui/Card";
import { formatAmount } from "@/shared/utils/format";

type ShareCardPreviewProps = {
	ref?: Ref<HTMLDivElement>;
	verdict: Verdict;
	amount: number;
	category: string | null;
	headline: string | null;
	sentence?: Sentence;
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
	sentence,
	defendantName,
	defendantTier,
	siteLabel,
	meme
}: ShareCardPreviewProps) {
	const note = sentence ? SENTENCE_NOTES[sentence] : null;

	return (
		<div ref={ref} className="w-full">
			<Card className="flex aspect-square w-full flex-col gap-3 overflow-hidden rounded-3xl p-4.5">
				<div className="flex items-center justify-between gap-2 text-caption font-bold text-mute">
					<span className="flex min-w-0 items-center gap-1.5">
						<span className="truncate">{defendantName}</span>
						{defendantTier && <TierBadge tier={defendantTier} />}
					</span>
					{category && <span className="shrink-0">{category}</span>}
				</div>

				{meme && (
					<div className="relative flex-3 overflow-hidden rounded-card">
						<MemeThumbnail size="lg" meme={{ src: meme.imageUrl, alt: headline ?? "판결 짤" }} className="size-full" />
						<VerdictStamp verdict={verdict} size="lg" className="absolute right-2 bottom-2 -rotate-10" />
					</div>
				)}

				<div className="flex flex-2 items-center gap-3">
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<span className="text-amount text-ink">{formatAmount(amount)}원</span>
						{headline && <p className="text-subtitle text-text">{headline}</p>}
						{sentence && (
							<p className="flex flex-wrap items-baseline gap-1.5">
								<span className="text-caption text-mute">형량</span>
								<span className="text-control font-black text-red">{SENTENCE_LABELS[sentence]}</span>
								{note && <span className="text-caption text-mute">{note}</span>}
							</p>
						)}
					</div>
					{!meme && <VerdictStamp verdict={verdict} size="lg" className="shrink-0 -rotate-10" />}
				</div>

				<div className="flex items-center justify-between gap-3 border-t border-line pt-2.5">
					<Logo size="header" />
					<span className="truncate text-caption font-extrabold text-mute">{siteLabel}</span>
				</div>
			</Card>
		</div>
	);
}
