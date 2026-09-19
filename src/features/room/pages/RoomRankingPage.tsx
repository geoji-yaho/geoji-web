import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { memberName, memberQueries, type RoomMember } from "@/shared/api/members";
import { profileQueries } from "@/shared/api/profile";
import { MyRankRow } from "@/shared/components/MyRankRow";
import { type PodiumPlace, RankingPodium } from "@/shared/components/RankingPodium";
import { RankingRow } from "@/shared/components/RankingRow";
import { tierFromScore } from "@/shared/domain/tier";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";

const PODIUM_PLACES = [1, 2, 3] as const satisfies readonly PodiumPlace[];
const ROW_REVEAL_FROM = 2;

function rankMembers(members: RoomMember[]) {
	const scored = members.flatMap((member) => (member.debtScore === null ? [] : [{ member, score: member.debtScore }]));

	return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function formatScore(score: number) {
	return `${score}점`;
}

export function RoomRankingPage() {
	const { roomId = "" } = useParams();
	const members = useQuery(memberQueries.list(roomId));
	const me = useQuery(profileQueries.me());

	const memberList = members.data ?? [];
	const myUserId = me.data?.id ?? null;
	const ranked = rankMembers(memberList);
	const podium = ranked.slice(0, PODIUM_PLACES.length);
	const rows = ranked.slice(PODIUM_PLACES.length);
	const pending = memberList.filter((member) => member.debtScore === null);
	const mine = memberList.find((member) => member.userId === myUserId);
	const myRank = ranked.find((entry) => entry.member.userId === myUserId)?.rank ?? null;

	return (
		<>
			<div className="flex flex-1 flex-col gap-2.5 px-5 py-3">
				<Reveal>
					<h2 className="text-base font-black text-ink">거지력</h2>
				</Reveal>

				{members.isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						랭킹을 불러오는 중
					</Card>
				)}
				{members.isError && <Alert>{members.error.message}</Alert>}
				{me.isError && <Alert>{me.error.message}</Alert>}

				{podium.length > 0 && (
					<Reveal index={1}>
						<RankingPodium
							entries={podium.map((entry, index) => ({
								place: PODIUM_PLACES[index],
								name: memberName(entry.member),
								imageUrl: entry.member.avatarUrl,
								tier: tierFromScore(entry.score),
								value: formatScore(entry.score),
								isMe: entry.member.userId === myUserId
							}))}
						/>
					</Reveal>
				)}

				{(rows.length > 0 || pending.length > 0) && (
					<ol className="flex flex-col gap-2.5">
						{rows.map((entry, index) => (
							<Reveal key={entry.member.userId} as="li" index={ROW_REVEAL_FROM + index}>
								<RankingRow
									rank={entry.rank}
									name={memberName(entry.member)}
									imageUrl={entry.member.avatarUrl}
									tier={tierFromScore(entry.score)}
									value={formatScore(entry.score)}
									isMe={entry.member.userId === myUserId}
								/>
							</Reveal>
						))}
						{pending.map((member, index) => (
							<Reveal key={member.userId} as="li" index={ROW_REVEAL_FROM + rows.length + index}>
								<RankingRow
									rank={null}
									name={memberName(member)}
									imageUrl={member.avatarUrl}
									tier={null}
									value={null}
									isMe={member.userId === myUserId}
								/>
							</Reveal>
						))}
					</ol>
				)}
			</div>

			{mine && (
				<MyRankRow
					name={memberName(mine)}
					imageUrl={mine.avatarUrl}
					rank={myRank}
					className="sticky bottom-0 z-40 rounded-none"
				/>
			)}
		</>
	);
}
