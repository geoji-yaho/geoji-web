import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet } from "react-router";

import { RoomTabsHeader } from "@/features/room";
import { DURATION, EASE_OUT } from "@/shared/lib/motion";

const ROOM_NAME = "야근족 거지방";
const MEMBER_NAMES = ["소윤", "지민", "현우", "민재", "태양"];

const TAB_ENTER = { opacity: 0, y: 6 };
const TAB_CENTER = { opacity: 1, y: 0 };
const TAB_EXIT = { opacity: 0, y: -4 };

export function RoomLayout() {
	const outlet = useOutlet();
	const { pathname } = useLocation();

	return (
		<div className="flex flex-1 flex-col">
			<RoomTabsHeader roomName={ROOM_NAME} memberNames={MEMBER_NAMES} />
			<div className="flex flex-1 flex-col">
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial={TAB_ENTER}
						animate={TAB_CENTER}
						exit={{ ...TAB_EXIT, transition: { duration: DURATION.press, ease: "easeIn" } }}
						transition={{ duration: DURATION.fast, ease: EASE_OUT }}
						className="flex flex-1 flex-col"
					>
						{outlet}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
