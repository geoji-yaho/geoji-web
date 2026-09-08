import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

import { createQueryClient } from "@/shared/lib/query-client";

import { router } from "../router/routes";

const queryClient = createQueryClient({
	onUnauthorized: () => {
		void router.navigate("/login");
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
