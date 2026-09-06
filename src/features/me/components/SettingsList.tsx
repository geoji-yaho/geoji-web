import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";

type SettingsRow = {
	label: string;
	to?: string;
	value?: string;
	onClick?: () => void;
	dimmed?: boolean;
};

const ROW_STYLES = "pressable flex w-full items-center justify-between px-4 py-3.25 text-sm";

type SettingsListProps = {
	themeLabel: string;
	onThemeClick: () => void;
};

export function SettingsList({ themeLabel, onThemeClick }: SettingsListProps) {
	const rows: SettingsRow[] = [
		{ label: "월 예산 변경", to: "/me/budget" },
		{ label: "화면 모드", value: themeLabel, onClick: onThemeClick },
		{ label: "알림 설정" },
		{ label: "로그아웃" },
		{ label: "회원 탈퇴", dimmed: true }
	];

	return (
		<div className="flex flex-col gap-3">
			<Card className="overflow-hidden">
				{rows.map((row) => {
					const rowClassName = cn(
						ROW_STYLES,
						"border-b border-line last:border-b-0",
						row.dimmed ? "text-dim" : "text-text"
					);
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
						<Link key={row.label} to={row.to} className={rowClassName}>
							{rowContent}
						</Link>
					) : (
						<button key={row.label} type="button" onClick={row.onClick} className={rowClassName}>
							{rowContent}
						</button>
					);
				})}
			</Card>
			<p className="text-center text-tag text-dim">약관, 개인정보처리방침, v1.0.0</p>
		</div>
	);
}
