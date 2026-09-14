import type { RoomMember } from "@/shared/api/members";
import { tierFromScore } from "@/shared/domain/tier";

const UNKNOWN_MEMBER_NAME = "알 수 없는 멤버";

export function findMember(members: RoomMember[] | undefined, userId: string) {
	return members?.find((member) => member.userId === userId) ?? null;
}

export function memberName(member: RoomMember | null) {
	return member?.nickname ?? UNKNOWN_MEMBER_NAME;
}

export function memberTier(member: RoomMember | null) {
	if (member === null || member.debtScore === null) {
		return undefined;
	}

	return tierFromScore(member.debtScore);
}
