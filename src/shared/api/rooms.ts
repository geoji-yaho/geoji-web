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

/** 초대장 화면(참여 전). 아직 멤버가 아니어도 볼 수 있어서 방 안의 지출·댓글은 들어 있지 않다. */
export type RoomInvitePreview = {
	id: string;
	name: string;
	spiceLevel: RoomSpiceLevel;
	voteDeadlineMinutes: RoomVoteDeadlineMinutes;
	rules: string[];
	ownerNickname: string;
	memberCount: number;
	/** true 면 이미 참여한 방이다. 참여하기 대신 바로 방으로 보낸다. */
	alreadyMember: boolean;
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
		}),
	invites: () => [...roomQueries.all(), "invite"] as const,
	invite: (inviteCode: string) =>
		queryOptions({
			queryKey: [...roomQueries.invites(), inviteCode] as const,
			queryFn: ({ signal }) =>
				http.get<RoomInvitePreview>(`/api/rooms/invite/${encodeURIComponent(inviteCode)}`, { signal })
		})
};
