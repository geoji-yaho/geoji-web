import { queryOptions } from "@tanstack/react-query";

import { tierFromScore } from "../domain/tier";
import { http } from "./http";

export const UNKNOWN_MEMBER_NAME = "알 수 없는 멤버";
export const AI_MEMBER_NICKNAME = "떼거지봇";

export type RoomMember = {
	userId: string;
	nickname: string | null;
	avatarUrl: string | null;
	debtScore: number | null;
	joinedAt: string;
};

export function findMember(members: RoomMember[] | undefined, userId: string) {
	return members?.find((member) => member.userId === userId) ?? null;
}

export function memberName(member: RoomMember | null | undefined) {
	return member?.nickname ?? UNKNOWN_MEMBER_NAME;
}

export function hasAiMember(members: RoomMember[] | undefined) {
	return members?.some((member) => member.nickname === AI_MEMBER_NICKNAME) ?? false;
}

export function memberTier(member: RoomMember | null | undefined) {
	if (!member || member.debtScore === null) {
		return undefined;
	}

	return tierFromScore(member.debtScore);
}

export function fetchRoomMembers(roomId: string, signal?: AbortSignal) {
	return http.get<RoomMember[]>(`/api/rooms/${encodeURIComponent(roomId)}/members`, { signal });
}

export const memberQueries = {
	all: () => ["members"] as const,
	list: (roomId: string) =>
		queryOptions({
			queryKey: [...memberQueries.all(), "list", roomId] as const,
			queryFn: ({ signal }) => fetchRoomMembers(roomId, signal)
		})
};
