import type { Expense } from "@/shared/api/expenses";
import { TierBadge } from "@/shared/components/TierBadge";
import type { Tier } from "@/shared/domain/tier";
import { InfoTable } from "@/shared/ui/InfoTable";
import { formatAmount } from "@/shared/utils/format";

import { formatSpentAt } from "../utils/trial";

type CaseOverviewTableProps = {
	expense: Expense;
	defendantName: string;
	defendantTier?: Tier;
};

export function CaseOverviewTable({ expense, defendantName, defendantTier }: CaseOverviewTableProps) {
	const amountLabel = `${formatAmount(expense.amount)}원`;
	const rows = [
		{ label: "지출", value: expense.category ? `${expense.category}, ${amountLabel}` : amountLabel, strong: true },
		...(expense.memo ? [{ label: "무엇을", value: expense.memo }] : []),
		{ label: "일시", value: formatSpentAt(expense.spentAt) },
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
