import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router/dom";

import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router/routes";

export default function App() {
	return (
		<MotionConfig reducedMotion="user">
			<QueryProvider>
				<RouterProvider router={router} />
			</QueryProvider>
		</MotionConfig>
	);
}
