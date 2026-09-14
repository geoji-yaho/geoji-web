import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProfile, profileQueries } from "@/shared/api/profile";

export function useCreateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProfile,
		onSuccess: (profile) => {
			queryClient.setQueryData(profileQueries.me().queryKey, profile);
		},
		onError: (error) => {
			if (error.kind === "conflict") {
				return queryClient.invalidateQueries({ queryKey: profileQueries.me().queryKey });
			}
		}
	});
}
