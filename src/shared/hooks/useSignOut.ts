import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { clearOnboardingSkip } from "../lib/onboarding-skip";
import { getSupabase } from "../lib/supabase";

export function useSignOut() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async () => {
			await getSupabase().auth.signOut();
		},
		onSuccess: async () => {
			clearOnboardingSkip();
			queryClient.clear();
			await navigate("/login");
		}
	});
}
