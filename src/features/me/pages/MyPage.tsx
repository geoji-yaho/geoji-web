import { useState } from "react";
import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { THEME_LABELS } from "@/shared/domain/theme";
import { type Verdict, VERDICT_LABELS, VERDICT_SIDES, type VerdictSide } from "@/shared/domain/verdict";
import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";

import { MonthSummaryCard } from "../components/MonthSummaryCard";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { SettingsList } from "../components/SettingsList";
import { ThemeSheet } from "../components/ThemeSheet";

const PROFILE = {
	name: "소윤",
	tier: "flower",
	nextTierLabel: "거지왕까지",
	nextTierScore: 14
} as const;

const MONTH_SUMMARY = {
	monthLabel: "9월에 쓴 금액",
	spent: 412000,
	budget: 500000,
	noSpendDays: 6,
	score: 71
} as const;

const VERDICT_HISTORY: { verdict: Verdict; count: number }[] = [
	{ verdict: "guilty", count: 2 },
	{ verdict: "notGuilty", count: 5 },
	{ verdict: "dismissed", count: 1 }
];

const VERDICT_SIDE_STYLES: Record<VerdictSide, string> = {
	oppose: "text-red",
	support: "text-green",
	none: "text-mute"
};

export function MyPage() {
	const navigate = useNavigate();
	const { preference, resolved, setPreference } = useTheme();
	const [themeOpen, setThemeOpen] = useState(false);

	const themeLabel =
		preference === "system" ? `${THEME_LABELS.system} (${THEME_LABELS[resolved]})` : THEME_LABELS[preference];

	return (
		<div className="flex flex-1 flex-col px-5">
			<BackHeader title="마이페이지" onBack={() => navigate(-1)} />
			<div className="flex flex-1 flex-col gap-3 pt-1.5 pb-8.5">
				<Reveal>
					<ProfileHeaderCard {...PROFILE} />
				</Reveal>
				<Reveal index={1}>
					<MonthSummaryCard {...MONTH_SUMMARY} />
				</Reveal>
				<Reveal index={2} className="flex gap-2">
					{VERDICT_HISTORY.map(({ verdict, count }) => (
						<Card key={verdict} className="flex-1 p-2.75 text-center">
							<p className={cn("text-tag font-black", VERDICT_SIDE_STYLES[VERDICT_SIDES[verdict]])}>
								{VERDICT_LABELS[verdict]}
							</p>
							<p className="text-title text-ink">{count}</p>
						</Card>
					))}
				</Reveal>
				<Reveal index={3}>
					<SettingsList themeLabel={themeLabel} onThemeClick={() => setThemeOpen(true)} />
				</Reveal>
			</div>

			<ThemeSheet
				open={themeOpen}
				onClose={() => setThemeOpen(false)}
				value={preference}
				resolved={resolved}
				onSelect={setPreference}
			/>
		</div>
	);
}
