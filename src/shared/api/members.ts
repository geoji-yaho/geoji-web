import { queryOptions } from "@tanstack/react-query";

import { http } from "./http";

export type RoomMember = {
	userId: string;
	nickname: string;
	avatarUrl: string | null;
	debtScore: number | null;
	joinedAt: string;
};

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
