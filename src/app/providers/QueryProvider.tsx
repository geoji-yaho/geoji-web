import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

import { getSessionSnapshot } from "@/shared/hooks/useSession";
import { toAppPath } from "@/shared/lib/base-path";
import { clearOnboardingSkip } from "@/shared/lib/onboarding-skip";
import { setPathAfterLogin } from "@/shared/lib/path-after-login";
import { createQueryClient } from "@/shared/lib/query-client";
import { getSupabase } from "@/shared/lib/supabase";

import { router } from "../router/routes";

const LOGIN_PATH = "/login";
const EXPIRED_STATE = { notice: "세션이 만료되어 로그아웃되었습니다. 다시 로그인해 주세요" };
const SIGN_IN_STATE = { notice: "로그인하면 이어서 볼 수 있습니다" };

let isHandlingUnauthorized = false;

async function signOutQuietly() {
	try {
		await getSupabase().auth.signOut();
	} catch {
		return;
	}
}

async function goToLogin(hadSession: boolean) {
	try {
		await router.navigate(LOGIN_PATH, { replace: true, state: hadSession ? EXPIRED_STATE : SIGN_IN_STATE });
	} catch {
		return;
	} finally {
		clearOnboardingSkip();
		queryClient.clear();
		isHandlingUnauthorized = false;
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

		const { session, hasFailed } = getSessionSnapshot();

		void signOutQuietly();
		void goToLogin(session !== null || hasFailed);
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
