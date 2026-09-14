import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

import { createQueryClient } from "@/shared/lib/query-client";
import { getSupabase } from "@/shared/lib/supabase";

import { router } from "../router/routes";

const queryClient = createQueryClient({
	onUnauthorized: () => {
		void (async () => {
			try {
				const supabase = getSupabase();
				const { data } = await supabase.auth.getSession();
				if (data.session) {
					await supabase.auth.signOut();
				}
			} finally {
				await router.navigate("/login");
			}
		})();
	}
});

export function QueryProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
