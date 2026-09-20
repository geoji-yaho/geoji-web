import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { ScrollRestoration, useLocation, useMatches, useNavigate, useNavigationType, useOutlet } from "react-router";

import { useIsOnline } from "@/shared/hooks/useIsOnline";
import { useSession } from "@/shared/hooks/useSession";
import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { takePathAfterLogin } from "@/shared/lib/path-after-login";

const ENTER_X = 24;
const EXIT_X = 12;

const OFFLINE_MESSAGE = "연결이 끊겼습니다. 연결되면 이어서 불러옵니다";

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
	const { pathname, search } = useLocation();
	const navigate = useNavigate();
	const navigationType = useNavigationType();
	const matches = useMatches();
	const { session } = useSession();
	const isOnline = useIsOnline();
	const hasSessionRef = useRef(false);

	const direction = navigationType === "POP" ? -1 : 1;

	const isAppStart = !hasEnteredApp;

	useEffect(() => {
		hasEnteredApp = true;
	}, []);

	useEffect(() => {
		const hadSession = hasSessionRef.current;
		hasSessionRef.current = session !== null;

		if (hadSession || session === null) {
			return;
		}

		const pathAfterLogin = takePathAfterLogin();

		if (pathAfterLogin === null || pathAfterLogin === pathname + search) {
			return;
		}

		void navigate(pathAfterLogin, { replace: true });
	}, [session, pathname, search, navigate]);

	const transitionKey = matches[1]?.pathname ?? pathname;

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-phone flex-col overflow-x-clip bg-screen">
			<ScrollRestoration />
			{!isOnline && (
				<p role="status" className="sticky top-0 z-50 bg-ink px-5 py-2 text-center text-caption font-bold text-card">
					{OFFLINE_MESSAGE}
				</p>
			)}
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
