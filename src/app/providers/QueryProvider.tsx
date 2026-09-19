import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

import { toAppPath } from "@/shared/lib/base-path";
import { setPathAfterLogin } from "@/shared/lib/path-after-login";
import { createQueryClient } from "@/shared/lib/query-client";
import { getSupabase } from "@/shared/lib/supabase";

import { router } from "../router/routes";

const LOGIN_PATH = "/login";

let isHandlingUnauthorized = false;

async function signOutAndGoToLogin() {
	try {
		const supabase = getSupabase();
		const { data } = await supabase.auth.getSession();

		if (data.session) {
			await supabase.auth.signOut();
		}
	} finally {
		await router.navigate(LOGIN_PATH, { replace: true });
	}
}

const queryClient = createQueryClient({
	onUnauthorized: () => {
		if (isHandlingUnauthorized) {
			return;
		}

		const { pathname, search } = router.state.location;

		if (toAppPath(pathname) === LOGIN_PATH) {
			return;
		}

		isHandlingUnauthorized = true;
		setPathAfterLogin(pathname + search);

		void signOutAndGoToLogin().finally(() => {
			isHandlingUnauthorized = false;
		});
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
