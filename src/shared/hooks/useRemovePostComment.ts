import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries, removePostComment } from "../api/posts";

type RemovePostCommentInput = {
	postId: string;
	roomId: string;
	commentId: string;
};

export function useRemovePostComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, commentId }: RemovePostCommentInput) => removePostComment(postId, commentId),
		onSuccess: (_, { postId, roomId }) =>
			queryClient.invalidateQueries({ queryKey: postQueries.comments(postId, roomId).queryKey })
	});
}
