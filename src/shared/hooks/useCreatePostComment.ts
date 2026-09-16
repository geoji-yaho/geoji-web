import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPostComment, postQueries } from "../api/posts";

export function useCreatePostComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPostComment,
		onSuccess: (_comment, { postId }) =>
			queryClient.invalidateQueries({ queryKey: postQueries.comments(postId).queryKey })
	});
}
