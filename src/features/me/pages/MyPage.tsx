import { useState } from "react";
import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { THEME_LABELS } from "@/shared/domain/theme";
import { useMyMonthStats } from "@/shared/hooks/useMyMonthStats";
import { useSignOut } from "@/shared/hooks/useSignOut";
import { useTheme } from "@/shared/hooks/useTheme";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { kstCalendar } from "@/shared/utils/date";

import { MonthSummaryCard } from "../components/MonthSummaryCard";
import { NicknameSheet } from "../components/NicknameSheet";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { SettingsList } from "../components/SettingsList";
import { ThemeSheet } from "../components/ThemeSheet";
import { VerdictHistory } from "../components/VerdictHistory";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export function MyPage() {
	const navigate = useNavigate();
	const stats = useMyMonthStats();
	const { preference, resolved, setPreference } = useTheme();
	const signOut = useSignOut();
	const updateProfile = useUpdateProfile();
	const [themeOpen, setThemeOpen] = useState(false);
	const [nicknameOpen, setNicknameOpen] = useState(false);
	const [nickname, setNickname] = useState("");

	const profile = stats.profile;
	const monthLabel = `${kstCalendar(new Date()).month}월에 쓴 금액`;
	const themeLabel =
		preference === "system" ? `${THEME_LABELS.system} (${THEME_LABELS[resolved]})` : THEME_LABELS[preference];

	const openNickname = () => {
		setNickname(profile?.nickname ?? "");
		setNicknameOpen(true);
	};

	const submitNickname = () => {
		updateProfile.mutate({ nickname: nickname.trim() }, { onSuccess: () => setNicknameOpen(false) });
	};

	return (
		<div className="flex flex-1 flex-col px-5">
			<BackHeader title="마이페이지" onBack={() => navigate(-1)} />
			<div className="flex flex-1 flex-col gap-3 pt-1.5 pb-8.5">
				{stats.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						프로필을 불러오는 중
					</Card>
				)}
				{stats.error && <Alert>{stats.error.message}</Alert>}

				{!stats.isPending && profile && (
					<>
						<Reveal>
							<ProfileHeaderCard
								name={profile.nickname}
								tier={stats.tier}
								nextTierLabel={stats.nextTierLabel}
								onNicknameEdit={openNickname}
							/>
						</Reveal>
						<Reveal index={1}>
							<MonthSummaryCard
								monthLabel={monthLabel}
								spent={stats.spentThisMonth}
								budget={profile.monthlyBudget}
								baseline={stats.baseline ?? undefined}
								score={stats.score}
							/>
						</Reveal>
						<Reveal index={2}>
							<VerdictHistory
								guilty={stats.judged.guilty}
								notGuilty={stats.judged.notGuilty}
								dismissed={stats.judged.dismissed}
							/>
						</Reveal>
					</>
				)}

				<Reveal index={3}>
					<SettingsList
						themeLabel={themeLabel}
						onThemeClick={() => setThemeOpen(true)}
						onSignOut={() => signOut.mutate()}
						signingOut={signOut.isPending}
					/>
				</Reveal>
				{signOut.error && <Alert>{signOut.error.message}</Alert>}
			</div>

			<ThemeSheet
				open={themeOpen}
				onClose={() => setThemeOpen(false)}
				value={preference}
				resolved={resolved}
				onSelect={setPreference}
			/>
			<NicknameSheet
				open={nicknameOpen}
				onClose={() => setNicknameOpen(false)}
				value={nickname}
				onChange={setNickname}
				onSubmit={submitNickname}
				isPending={updateProfile.isPending}
				errorMessage={updateProfile.error?.message}
			/>
		</div>
	);
}
