import { useState } from "react";
import { useNavigate } from "react-router";

import { AmountField } from "@/shared/ui/AmountField";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";

const BUDGET_PRESETS = [
	{ label: "30만", value: "300,000" },
	{ label: "50만", value: "500,000" },
	{ label: "70만", value: "700,000" },
	{ label: "100만", value: "1,000,000" }
];

const INITIAL_AMOUNT = "500,000";

export function BudgetOnboardingPage() {
	const navigate = useNavigate();
	const [amount, setAmount] = useState(INITIAL_AMOUNT);

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
							selected={amount === preset.value}
							onClick={() => setAmount(preset.value)}
							className="flex-1"
						>
							{preset.label}
						</Chip>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-3.5">
				<StickyCta label="시작하기" onClick={() => navigate("/")} />
				<button type="button" onClick={() => navigate("/")} className="text-control text-mute underline">
					나중에 할게요
				</button>
			</div>
		</div>
	);
}
