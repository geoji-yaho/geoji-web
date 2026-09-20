import { useMutation } from "@tanstack/react-query";

import { removeRoom } from "@/shared/api/rooms";

import { useClearRoomCache } from "./useClearRoomCache";

export function useRemoveRoom() {
	const clearRoomCache = useClearRoomCache();

	return useMutation({
		mutationFn: removeRoom,
		onSuccess: (_, roomId) => clearRoomCache(roomId)
	});
}
