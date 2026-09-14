import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentQueries, createComment } from "@/shared/api/comments";

type CreateCommentInput = {
	roomId: string;
	expenseId: string;
	content: string;
};

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, expenseId, content }: CreateCommentInput) => createComment(roomId, expenseId, { content }),
		onSuccess: (_comment, { roomId, expenseId }) =>
			queryClient.invalidateQueries({ queryKey: commentQueries.list(roomId, expenseId).queryKey })
	});
}
