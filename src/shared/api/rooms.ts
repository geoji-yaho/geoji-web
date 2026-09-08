import { queryOptions } from "@tanstack/react-query";

import { http } from "./http";

export type RoomSpiceLevel = "mild" | "hot" | "direct";

export type RoomVoteDeadlineMinutes = 30 | 60 | 180 | 360 | 720;

export type Room = {
	id: string;
	name: string;
	spiceLevel: RoomSpiceLevel;
	voteDeadlineMinutes: RoomVoteDeadlineMinutes;
	rules: string[];
	inviteCode: string;
	createdBy: string;
};

export type CreateRoomInput = {
	name: string;
	spiceLevel: RoomSpiceLevel;
	voteDeadlineMinutes: RoomVoteDeadlineMinutes;
	rules?: string[];
};

export function createRoom(input: CreateRoomInput) {
	return http.post<Room>("/api/rooms", { body: input });
}

export function joinRoom(inviteCode: string) {
	return http.post<Room>(`/api/rooms/join/${encodeURIComponent(inviteCode)}`);
}

export const roomQueries = {
	all: () => ["rooms"] as const,
	lists: () => [...roomQueries.all(), "list"] as const,
	list: () =>
		queryOptions({
			queryKey: roomQueries.lists(),
			queryFn: ({ signal }) => http.get<Room[]>("/api/rooms", { signal })
		}),
	details: () => [...roomQueries.all(), "detail"] as const,
	detail: (roomId: string) =>
		queryOptions({
			queryKey: [...roomQueries.details(), roomId] as const,
			queryFn: ({ signal }) => http.get<Room>(`/api/rooms/${encodeURIComponent(roomId)}`, { signal })
		})
};
