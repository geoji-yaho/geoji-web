import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router/dom";

import { setAccessTokenProvider } from "@/shared/api/auth-token";
import { env } from "@/shared/lib/env";
import { getSupabase } from "@/shared/lib/supabase";

import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router/routes";

setAccessTokenProvider(async () => {
	const { data } = await getSupabase().auth.getSession();
	return data.session?.access_token ?? env.devAccessToken;
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
