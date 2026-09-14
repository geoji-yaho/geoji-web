import { memberName, type RoomMember } from "@/shared/api/members";
import { TierBadge } from "@/shared/components/TierBadge";
import { DEBT_SCORE_PENDING_LABEL } from "@/shared/domain/score";
import { tierFromScore } from "@/shared/domain/tier";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui/Avatar";

type MemberListProps = {
	members: RoomMember[];
	myUserId: string | null;
};

export function MemberList({ members, myUserId }: MemberListProps) {
	return (
		<ul className="flex flex-col gap-1.5">
			{members.map((member) => (
				<li
					key={member.userId}
					className={cn(
						"flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.25 text-control",
						member.userId === myUserId && "bg-fill"
					)}
				>
					<Avatar name={memberName(member)} size="sm" />
					<span className="flex-1 truncate font-extrabold text-ink">{memberName(member)}</span>
					{member.debtScore === null ? (
						<span className="text-tag text-dim">{DEBT_SCORE_PENDING_LABEL}</span>
					) : (
						<>
							<TierBadge tier={tierFromScore(member.debtScore)} />
							<span className="font-black text-ink">{member.debtScore}</span>
						</>
					)}
				</li>
			))}
		</ul>
	);
}
