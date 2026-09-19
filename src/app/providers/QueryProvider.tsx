import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

import { toAppPath } from "@/shared/lib/base-path";
import { clearOnboardingSkip } from "@/shared/lib/onboarding-skip";
import { setPathAfterLogin } from "@/shared/lib/path-after-login";
import { createQueryClient } from "@/shared/lib/query-client";
import { getSupabase } from "@/shared/lib/supabase";

import { router } from "../router/routes";

const LOGIN_PATH = "/login";
const EXPIRED_STATE = { notice: "세션이 만료되어 로그아웃되었습니다. 다시 로그인해 주세요" };

let isHandlingUnauthorized = false;

async function signOutQuietly() {
	try {
		await getSupabase().auth.signOut();
	} catch {
		return;
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

		void signOutQuietly();
		void router.navigate(LOGIN_PATH, { replace: true, state: EXPIRED_STATE }).finally(() => {
			clearOnboardingSkip();
			queryClient.clear();
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
