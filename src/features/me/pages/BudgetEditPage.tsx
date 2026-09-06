import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { Card } from "@/shared/ui/Card";
import { StickyCta } from "@/shared/ui/StickyCta";
import { formatAmount } from "@/shared/utils/format";

const CURRENT_BUDGET = 500000;
const NEW_BUDGET = "400,000";

export function BudgetEditPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title="월 예산 변경" onBack={() => navigate(-1)} />
			<div className="flex flex-1 flex-col gap-6 pt-4">
				<Card className="flex items-center justify-between px-4 py-3.5 text-control">
					<span className="text-mute">현재 예산</span>
					<span className="font-black text-ink">{formatAmount(CURRENT_BUDGET)}원</span>
				</Card>
				<AmountField label="새 예산" value={NEW_BUDGET} onChange={() => {}} disabled />
				<Alert>이번 달 예산은 이미 변경했습니다. 다음 달 1일부터 다시 바꿀 수 있어요.</Alert>
			</div>
			<StickyCta label="변경하기" disabled />
		</div>
	);
}
