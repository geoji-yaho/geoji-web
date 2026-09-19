import { TierBadge } from "@/shared/components/TierBadge";
import type { Tier } from "@/shared/domain/tier";
import { InfoTable } from "@/shared/ui/InfoTable";
import { formatAmount } from "@/shared/utils/format";

import { formatSpentAt } from "../utils/formatSpentAt";

type CaseOverviewTableProps = {
	amount: number;
	category: string | null;
	item: string | null;
	reason: string | null;
	spentAt: string;
	defendantName: string;
	defendantTier?: Tier;
};

export function CaseOverviewTable({
	amount,
	category,
	item,
	reason,
	spentAt,
	defendantName,
	defendantTier
}: CaseOverviewTableProps) {
	const amountLabel = `${formatAmount(amount)}원`;
	const rows = [
		{ label: "지출", value: category ? `${category}, ${amountLabel}` : amountLabel, strong: true },
		...(item ? [{ label: "무엇을", value: item }] : []),
		...(reason ? [{ label: "사유", value: reason }] : []),
		{ label: "일시", value: formatSpentAt(spentAt) },
		{
			label: "피고인",
			value: (
				<span className="inline-flex items-center gap-1.5">
					{defendantName}
					{defendantTier && <TierBadge tier={defendantTier} />}
				</span>
			),
			strong: true
		}
	];

	return <InfoTable rows={rows} />;
}
