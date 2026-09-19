import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet, useParams } from "react-router";

import { RoomTabsHeader } from "@/features/room";
import { memberName, memberQueries } from "@/shared/api/members";
import { roomQueries } from "@/shared/api/rooms";
import { DURATION, EASE_OUT } from "@/shared/lib/motion";
import { Alert } from "@/shared/ui/Alert";

const TAB_ENTER = { opacity: 0, y: 6 };
const TAB_CENTER = { opacity: 1, y: 0 };
const TAB_EXIT = { opacity: 0, y: -4 };

export function RoomLayout() {
	const { roomId = "" } = useParams();
	const outlet = useOutlet();
	const { pathname } = useLocation();
	const room = useQuery(roomQueries.detail(roomId));
	const members = useQuery(memberQueries.list(roomId));
	const memberNames = members.data?.map((member) => memberName(member)) ?? [];

	return (
		<div className="flex flex-1 flex-col">
			<RoomTabsHeader roomId={roomId} roomName={room.data?.name ?? ""} memberNames={memberNames} />
			<div className="flex flex-1 flex-col">
				{room.isError ? (
					<div className="px-5 py-3">
						<Alert>{room.error.message}</Alert>
					</div>
				) : (
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
				)}
			</div>
		</div>
	);
}
