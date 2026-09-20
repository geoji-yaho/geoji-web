import { useMutation } from "@tanstack/react-query";

import { leaveRoom } from "@/shared/api/rooms";

import { useClearRoomCache } from "./useClearRoomCache";

export function useLeaveRoom() {
	const clearRoomCache = useClearRoomCache();

	return useMutation({
		mutationFn: leaveRoom,
		onSuccess: (_, roomId) => clearRoomCache(roomId)
	});
}
