import { useMutation, useQueryClient } from "@tanstack/react-query";

import { castPostVote, postQueries } from "@/shared/api/posts";

export function useCastPostVote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: castPostVote,
		onSuccess: async (_vote, { postId, roomId }) => {
			await queryClient.invalidateQueries({ queryKey: postQueries.detail(postId, roomId).queryKey });
			await queryClient.invalidateQueries({ queryKey: postQueries.feed(roomId).queryKey });
			await queryClient.invalidateQueries({ queryKey: postQueries.verdict(postId, roomId).queryKey });
		}
	});
}
