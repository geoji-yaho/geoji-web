import { queryOptions } from "@tanstack/react-query";

import type { Intensity, VoteDeadlineMinutes } from "../domain/room";
import type { ApiError } from "./api-error";
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

export type RoomInvitePreview = {
	id: string;
	name: string;
	spiceLevel: RoomSpiceLevel;
	voteDeadlineMinutes: RoomVoteDeadlineMinutes;
	rules: string[];
	ownerNickname: string | null;
	memberCount: number;
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

export type AiMember = {
	userId: string;
	nickname: string;
	postIds: string[];
};

export const AI_MEMBER_UNAVAILABLE_CODE = "AI_JUROR_NOT_CONFIGURED";

export function addAiMember(roomId: string) {
	return http.post<AiMember>(`/api/rooms/${encodeURIComponent(roomId)}/ai-member`);
}

export function isAiMemberUnavailable(error: ApiError) {
	const { body } = error;
	const hasCode = typeof body === "object" && body !== null && "code" in body;
	return error.kind === "server" && hasCode && body.code === AI_MEMBER_UNAVAILABLE_CODE;
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
