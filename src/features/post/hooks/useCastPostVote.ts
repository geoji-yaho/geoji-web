import { useMutation, useQueryClient } from "@tanstack/react-query";

import { castPostVote, postQueries } from "@/shared/api/posts";

export function useCastPostVote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: castPostVote,
		onSuccess: async (_vote, { postId }) => {
			await queryClient.invalidateQueries({ queryKey: [...postQueries.details(), postId] });
			await queryClient.invalidateQueries({ queryKey: postQueries.feeds() });
			await queryClient.invalidateQueries({ queryKey: postQueries.verdicts() });
		}
	});
}
