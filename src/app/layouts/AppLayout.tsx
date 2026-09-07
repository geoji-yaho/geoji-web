import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect } from "react";
import { ScrollRestoration, useLocation, useMatches, useNavigationType, useOutlet } from "react-router";

import { DURATION, EASE_OUT } from "@/shared/lib/motion";

const ENTER_X = 24;
const EXIT_X = 12;

let hasEnteredApp = false;

const pageVariants: Variants = {
	enter: (direction: number) => ({ opacity: 0, x: ENTER_X * direction }),
	still: { opacity: 0, x: 0 },
	center: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
	exit: (direction: number) => ({
		opacity: 0,
		x: -EXIT_X * direction,
		transition: { duration: DURATION.fast, ease: "easeIn" }
	})
};

export function AppLayout() {
	const outlet = useOutlet();
	const { pathname } = useLocation();
	const navigationType = useNavigationType();
	const matches = useMatches();

	const direction = navigationType === "POP" ? -1 : 1;

	const isAppStart = !hasEnteredApp;

	useEffect(() => {
		hasEnteredApp = true;
	}, []);

	const transitionKey = matches[1]?.pathname ?? pathname;

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-phone flex-col overflow-x-clip bg-screen">
			<ScrollRestoration />
			<AnimatePresence mode="wait" custom={direction}>
				<motion.main
					key={transitionKey}
					custom={direction}
					variants={pageVariants}
					initial={isAppStart ? "still" : "enter"}
					animate="center"
					exit="exit"
					className="flex min-h-dvh flex-1 flex-col"
				>
					{outlet}
				</motion.main>
			</AnimatePresence>
		</div>
	);
}
