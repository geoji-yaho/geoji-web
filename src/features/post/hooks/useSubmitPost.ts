import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeSubmission, postQueries, submitPost } from "@/shared/api/posts";

function useInvalidateFeeds() {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: postQueries.feeds() });
}

export function useSubmitPost() {
	const invalidateFeeds = useInvalidateFeeds();

	return useMutation({
		mutationFn: submitPost,
		onSuccess: (submission) => (submission.postId ? invalidateFeeds() : undefined)
	});
}

export function useCompleteSubmission() {
	const invalidateFeeds = useInvalidateFeeds();

	return useMutation({
		mutationFn: completeSubmission,
		onSuccess: (submission) => (submission.postId ? invalidateFeeds() : undefined)
	});
}
