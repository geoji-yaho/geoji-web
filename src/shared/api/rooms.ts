import { queryOptions } from "@tanstack/react-query";

import type { Intensity, VoteDeadlineMinutes } from "../domain/room";
import { http } from "./http";

export type RoomSpiceLevel = Intensity;

export type RoomVoteDeadlineMinutes = VoteDeadlineMinutes;

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

export function leaveRoom(roomId: string) {
	return http.delete<void>(`/api/rooms/${encodeURIComponent(roomId)}/members/me`);
}

export function removeRoom(roomId: string) {
	return http.delete<void>(`/api/rooms/${encodeURIComponent(roomId)}`);
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
