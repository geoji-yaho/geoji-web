import { useState } from "react";

import { IntensityTag } from "@/shared/components/IntensityTag";
import { TierBadge } from "@/shared/components/TierBadge";
import type { Tier } from "@/shared/domain/tier";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { InfoTable } from "@/shared/ui/InfoTable";
import { Reveal } from "@/shared/ui/Reveal";

import { InviteSheet } from "../components/InviteSheet";
import { RoomRuleList } from "../components/RoomRuleList";

const INVITE_URL = "ttegeoji.app/i/K7X2M";

const ROOM_INFO = {
	createdAt: "2026.08.28",
	owner: "소윤 (나)",
	intensity: "spicy",
	deadlineLabel: "12시간",
	memberCount: 5
} as const;

const ROOM_RULES = ["한 달에 배달음식 1번", "커피는 하루 1잔", "충동구매 금지"];

const MEMBERS: { name: string; tier: Tier; score: number }[] = [
	{ name: "소윤", tier: "flower", score: 71 },
	{ name: "지민", tier: "hardcore", score: 38 },
	{ name: "현우", tier: "flower", score: 65 }
];

const CHANGE_LINK_STYLES = "whitespace-nowrap font-black text-red";

export function RoomInfoPage() {
	const [inviteOpen, setInviteOpen] = useState(false);

	return (
		<>
			<div className="flex flex-1 flex-col gap-3.5 px-5 pt-3 pb-8.5">
				<Reveal>
					<InfoTable
						rows={[
							{ label: "생성일", value: ROOM_INFO.createdAt },
							{ label: "방장", value: ROOM_INFO.owner, strong: true },
							{
								label: "잔소리 강도",
								value: (
									<span className="flex items-center justify-end gap-1.5">
										<IntensityTag intensity={ROOM_INFO.intensity} />
										<button type="button" aria-label="잔소리 강도 변경" className={CHANGE_LINK_STYLES}>
											변경 <span aria-hidden="true">›</span>
										</button>
									</span>
								)
							},
							{
								label: "투표 마감",
								value: (
									<span className="whitespace-nowrap">
										{ROOM_INFO.deadlineLabel}&nbsp;
										<button type="button" aria-label="투표 마감 변경" className={CHANGE_LINK_STYLES}>
											변경 <span aria-hidden="true">›</span>
										</button>
									</span>
								)
							}
						]}
					/>
				</Reveal>

				<Reveal as="section" index={1} className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<h2 className="text-sm font-black text-ink">방 규칙</h2>
						<button type="button" className="text-xs font-black text-red">
							편집
						</button>
					</div>
					<Card className="px-4 py-1">
						<RoomRuleList rules={ROOM_RULES} />
					</Card>
				</Reveal>

				<Reveal as="section" index={2} className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<h2 className="text-sm font-black text-ink">멤버 {ROOM_INFO.memberCount}</h2>
						<span className="text-xs text-dim">이번 달 거지력</span>
					</div>
					<ul className="flex flex-col gap-1.5">
						{MEMBERS.map((member) => (
							<li
								key={member.name}
								className="flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.25 text-control"
							>
								<Avatar name={member.name} size="sm" />
								<span className="font-extrabold text-ink">{member.name}</span>
								<TierBadge tier={member.tier} />
								<span className="ml-auto font-black text-ink">{member.score}</span>
							</li>
						))}
					</ul>
				</Reveal>

				<Button variant="secondary" onClick={() => setInviteOpen(true)}>
					초대 링크 공유
				</Button>

				<div className="mt-auto flex gap-2.5">
					<Button variant="outline" className="flex-1">
						방 나가기
					</Button>
					<Button variant="danger" className="flex-1">
						방 삭제
					</Button>
				</div>
			</div>

			<InviteSheet open={inviteOpen} onClose={() => setInviteOpen(false)} inviteUrl={INVITE_URL} />
		</>
	);
}
