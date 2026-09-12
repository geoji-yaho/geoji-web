import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router/dom";

import { setAccessTokenProvider } from "@/shared/api/auth-token";
import { env } from "@/shared/lib/env";

import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router/routes";

setAccessTokenProvider(() => Promise.resolve(env.devAccessToken));

export default function App() {
	return (
		<MotionConfig reducedMotion="user">
			<QueryProvider>
				<RouterProvider router={router} />
			</QueryProvider>
		</MotionConfig>
	);
}
