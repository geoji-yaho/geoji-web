import { useMutation } from "@tanstack/react-query";

import { getSupabase } from "@/shared/lib/supabase";

function buildRedirectTo() {
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	return `${globalThis.location.origin}${base}/`;
}

export function useKakaoLogin() {
	return useMutation({
		mutationFn: async () => {
			const { error } = await getSupabase().auth.signInWithOAuth({
				provider: "kakao",
				options: { redirectTo: buildRedirectTo() }
			});

			if (error) {
				throw error;
			}
		}
	});
}
