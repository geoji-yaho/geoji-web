import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { Card } from "@/shared/ui/Card";

type SettingsRow = {
	label: string;
	to?: string;
	value?: string;
	onClick?: () => void;
	disabled?: boolean;
};

const ROW_STYLES =
	"pressable flex w-full items-center justify-between border-b border-line px-4 py-3.25 text-sm text-text last:border-b-0 disabled:text-dim";

type SettingsListProps = {
	themeLabel: string;
	onThemeClick: () => void;
	onSignOut: () => void;
	signingOut: boolean;
};

export function SettingsList({ themeLabel, onThemeClick, onSignOut, signingOut }: SettingsListProps) {
	const rows: SettingsRow[] = [
		{ label: "월 예산 변경", to: "/me/budget" },
		{ label: "화면 모드", value: themeLabel, onClick: onThemeClick },
		{ label: "로그아웃", onClick: onSignOut, disabled: signingOut }
	];

	return (
		<Card className="overflow-hidden">
			{rows.map((row) => {
				const rowContent = (
					<>
						<span>{row.label}</span>
						<span className="flex items-center gap-1.5">
							{row.value && <span className="text-dim">{row.value}</span>}
							<ChevronRight className="size-4 shrink-0 text-dim" aria-hidden="true" />
						</span>
					</>
				);

				return row.to ? (
					<Link key={row.label} to={row.to} className={ROW_STYLES}>
						{rowContent}
					</Link>
				) : (
					<button key={row.label} type="button" onClick={row.onClick} disabled={row.disabled} className={ROW_STYLES}>
						{rowContent}
					</button>
				);
			})}
		</Card>
	);
}
