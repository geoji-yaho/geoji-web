import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

import { profileQueries } from "@/shared/api/profile";
import { BackHeader } from "@/shared/components/BackHeader";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { Card } from "@/shared/ui/Card";
import { StickyCta } from "@/shared/ui/StickyCta";
import { formatAmount, parseAmount } from "@/shared/utils/format";

import { useUpdateProfile } from "../hooks/useUpdateProfile";

const BUDGET_MIN = 10_000;
const BUDGET_MAX = 10_000_000;
const RANGE_MESSAGE = "월 예산은 1만 원부터 1,000만 원까지 넣을 수 있습니다";

export function BudgetEditPage() {
	const navigate = useNavigate();
	const me = useQuery(profileQueries.me());
	const updateProfile = useUpdateProfile();
	const [amount, setAmount] = useState("");
	const [rangeError, setRangeError] = useState(false);

	const parsed = parseAmount(amount);
	const withinRange = parsed !== null && parsed >= BUDGET_MIN && parsed <= BUDGET_MAX;

	const submit = () => {
		if (!withinRange) {
			setRangeError(true);
			return;
		}

		setRangeError(false);
		updateProfile.mutate({ monthlyBudget: parsed }, { onSuccess: () => void navigate("/me") });
	};

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title="월 예산 변경" onBack={() => navigate(-1)} />
			<div className="flex flex-1 flex-col gap-6 pt-4">
				{me.isPending && (
					<Card role="status" className="px-4 py-3.5 text-control text-mute">
						프로필을 불러오는 중
					</Card>
				)}
				{me.data && (
					<Card className="flex items-center justify-between px-4 py-3.5 text-control">
						<span className="text-mute">현재 예산</span>
						<span className="font-black text-ink">{formatAmount(me.data.monthlyBudget)}원</span>
					</Card>
				)}
				<AmountField label="새 예산" caption="1만 ~ 1,000만" value={amount} onChange={setAmount} />

				{me.error && <Alert>{me.error.message}</Alert>}
				{rangeError && !withinRange && <Alert>{RANGE_MESSAGE}</Alert>}
				{updateProfile.error && <Alert>{updateProfile.error.message}</Alert>}
			</div>
			<StickyCta
				label={updateProfile.isPending ? "변경 중" : "변경하기"}
				onClick={submit}
				disabled={updateProfile.isPending}
			/>
		</div>
	);
}
