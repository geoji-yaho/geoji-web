import { useMutation } from "@tanstack/react-query";

import { toAbsoluteUrl } from "@/shared/lib/base-path";
import { getSupabase } from "@/shared/lib/supabase";

export function useKakaoLogin() {
	return useMutation({
		mutationFn: async () => {
			const { error } = await getSupabase().auth.signInWithOAuth({
				provider: "kakao",
				options: { redirectTo: toAbsoluteUrl("/") }
			});

			if (error) {
				throw error;
			}
		}
	});
}
