import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router/dom";

import { API_ERROR_MESSAGES, ApiError } from "@/shared/api/api-error";
import { setAccessTokenProvider } from "@/shared/api/auth-token";
import { env } from "@/shared/lib/env";
import { getSupabase } from "@/shared/lib/supabase";

import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router/routes";

function toTokenError(error: unknown) {
	if (isAuthRetryableFetchError(error)) {
		return new ApiError("network", API_ERROR_MESSAGES.network, { cause: error });
	}

	return new ApiError("unauthorized", API_ERROR_MESSAGES.unauthorized, { cause: error });
}

setAccessTokenProvider(async () => {
	const supabase = getSupabase();

	try {
		const { data, error } = await supabase.auth.getSession();

		if (error !== null) {
			throw error;
		}

		return data.session?.access_token ?? env.devAccessToken;
	} catch (error) {
		throw toTokenError(error);
	}
});

export default function App() {
	return (
		<MotionConfig reducedMotion="user">
			<QueryProvider>
				<RouterProvider router={router} />
			</QueryProvider>
		</MotionConfig>
	);
}
