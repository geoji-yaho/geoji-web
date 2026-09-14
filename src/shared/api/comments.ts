import { queryOptions } from "@tanstack/react-query";

import { http } from "./http";

export type Comment = {
	id: string;
	expenseId: string;
	roomId: string;
	userId: string;
	content: string;
	createdAt: string;
};

export type CreateCommentInput = {
	content: string;
};

function commentsPath(roomId: string, expenseId: string) {
	return `/api/rooms/${encodeURIComponent(roomId)}/expenses/${encodeURIComponent(expenseId)}/comments`;
}

export function fetchComments(roomId: string, expenseId: string, signal?: AbortSignal) {
	return http.get<Comment[]>(commentsPath(roomId, expenseId), { signal });
}

export function createComment(roomId: string, expenseId: string, input: CreateCommentInput) {
	return http.post<Comment>(commentsPath(roomId, expenseId), { body: input });
}

export const commentQueries = {
	all: () => ["comments"] as const,
	list: (roomId: string, expenseId: string) =>
		queryOptions({
			queryKey: [...commentQueries.all(), "list", roomId, expenseId] as const,
			queryFn: ({ signal }) => fetchComments(roomId, expenseId, signal)
		})
};
