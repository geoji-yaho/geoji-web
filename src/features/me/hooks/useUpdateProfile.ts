import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileQueries, updateProfile } from "@/shared/api/profile";

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,
		onSuccess: (profile) => {
			queryClient.setQueryData(profileQueries.me().queryKey, profile);
		}
	});
}
