import { useMutation, useQueryClient } from "@tanstack/react-query";

import { memberQueries } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { addAiMember } from "@/shared/api/rooms";

export function useAddAiMember(roomId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => addAiMember(roomId),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: memberQueries.list(roomId).queryKey }),
				queryClient.invalidateQueries({ queryKey: postQueries.feed(roomId).queryKey })
			])
	});
}
