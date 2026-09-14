import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentQueries, createComment, type CreateCommentInput } from "../api/comments";

type CreateCommentVariables = CreateCommentInput & {
	roomId: string;
	expenseId: string;
};

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, expenseId, content }: CreateCommentVariables) =>
			createComment(roomId, expenseId, { content }),
		onSuccess: (_comment, { roomId, expenseId }) =>
			queryClient.invalidateQueries({ queryKey: commentQueries.list(roomId, expenseId).queryKey })
	});
}
