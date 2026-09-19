import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries, removePost } from "@/shared/api/posts";

export function useRemovePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removePost,
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: postQueries.feeds() }),
				queryClient.invalidateQueries({ queryKey: postQueries.details(), refetchType: "none" }),
				queryClient.invalidateQueries({ queryKey: postQueries.verdicts(), refetchType: "none" }),
				queryClient.invalidateQueries({ queryKey: postQueries.shareCards(), refetchType: "none" })
			])
	});
}
