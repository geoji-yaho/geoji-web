import { useState } from "react";
import { useNavigate } from "react-router";

import { env } from "@/shared/lib/env";
import { Alert } from "@/shared/ui/Alert";
import { AmountField } from "@/shared/ui/AmountField";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { formatAmount, parseAmount } from "@/shared/utils/format";

import { useCreateProfile } from "../hooks/useCreateProfile";

const BUDGET_PRESETS = [
	{ label: "30만", value: 300_000 },
	{ label: "50만", value: 500_000 },
	{ label: "70만", value: 700_000 },
	{ label: "100만", value: 1_000_000 }
];

const BUDGET_MIN = 10_000;
const BUDGET_MAX = 10_000_000;
const RANGE_MESSAGE = "월 예산은 1만 원부터 1,000만 원까지 넣을 수 있습니다";

export function BudgetOnboardingPage() {
	const navigate = useNavigate();
	const [amount, setAmount] = useState("");
	const [rangeError, setRangeError] = useState(false);
	const onboarding = useCreateProfile();

	const parsed = parseAmount(amount);
	const withinRange = parsed !== null && parsed >= BUDGET_MIN && parsed <= BUDGET_MAX;
	const failed = onboarding.isError && onboarding.error.kind !== "conflict";

	const submit = () => {
		if (!withinRange) {
			setRangeError(true);
			return;
		}

		setRangeError(false);
		onboarding.mutate(
			{ nickname: env.devNickname ?? undefined, monthlyBudget: parsed },
			{
				onSuccess: () => void navigate("/"),
				onError: (error) => {
					if (error.kind === "conflict") void navigate("/");
				}
			}
		);
	};

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<div className="flex flex-1 flex-col gap-6.5 pt-8">
				<div className="flex flex-col gap-2">
					<span className="text-label text-mute">STEP 1 예산</span>
					<h1 className="text-headline text-ink">
						한 달에
						<br />
						얼마까지 쓸 건가요?
					</h1>
					<p className="text-control text-mute">넘기면 배심원들이 알게 됩니다</p>
				</div>

				<AmountField label="월 예산" labelHidden caption="1만 ~ 1,000만" value={amount} onChange={setAmount} />

				<div className="flex gap-2">
					{BUDGET_PRESETS.map((preset) => (
						<Chip
							key={preset.value}
							selected={parsed === preset.value}
							onClick={() => setAmount(formatAmount(preset.value))}
							className="flex-1"
						>
							{preset.label}
						</Chip>
					))}
				</div>

				{rangeError && !withinRange && <Alert>{RANGE_MESSAGE}</Alert>}
				{failed && <Alert>{onboarding.error.message}</Alert>}
			</div>

			<div className="flex flex-col gap-3.5">
				<StickyCta
					label={onboarding.isPending ? "등록 중" : "시작하기"}
					onClick={submit}
					disabled={onboarding.isPending}
				/>
				<button type="button" onClick={() => navigate("/")} className="text-control text-mute underline">
					나중에 할게요
				</button>
			</div>
		</div>
	);
}
