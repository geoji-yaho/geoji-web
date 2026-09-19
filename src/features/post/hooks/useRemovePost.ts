import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries, removePost } from "@/shared/api/posts";

export function useRemovePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removePost,
		onSuccess: async (_result, postId) => {
			await queryClient.invalidateQueries({ queryKey: postQueries.feeds() });
			queryClient.removeQueries({ queryKey: [...postQueries.details(), postId] });
			queryClient.removeQueries({ queryKey: [...postQueries.commentLists(), postId] });
			queryClient.removeQueries({ queryKey: [...postQueries.verdicts(), postId] });
			queryClient.removeQueries({ queryKey: [...postQueries.shareCards(), postId] });
		}
	});
}
