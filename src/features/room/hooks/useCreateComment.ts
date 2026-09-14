import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentQueries, createComment, type CreateCommentInput } from "@/shared/api/comments";

type CreateCommentVariables = {
	roomId: string;
	expenseId: string;
	input: CreateCommentInput;
};

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, expenseId, input }: CreateCommentVariables) => createComment(roomId, expenseId, input),
		onSuccess: (_comment, { roomId, expenseId }) =>
			queryClient.invalidateQueries({ queryKey: commentQueries.list(roomId, expenseId).queryKey })
	});
}
