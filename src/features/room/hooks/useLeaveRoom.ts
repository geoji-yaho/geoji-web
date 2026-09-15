import { useMutation } from "@tanstack/react-query";

import { leaveRoom } from "@/shared/api/rooms";

import { ignoreNotFound } from "../utils/ignoreNotFound";
import { useClearRoomCache } from "./useClearRoomCache";

export function useLeaveRoom() {
	const clearRoomCache = useClearRoomCache();

	return useMutation({
		mutationFn: (roomId: string) => ignoreNotFound(leaveRoom(roomId)),
		onSuccess: (_, roomId) => clearRoomCache(roomId)
	});
}
