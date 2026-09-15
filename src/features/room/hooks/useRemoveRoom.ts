import { useMutation } from "@tanstack/react-query";

import { removeRoom } from "@/shared/api/rooms";

import { ignoreNotFound } from "../utils/ignoreNotFound";
import { useClearRoomCache } from "./useClearRoomCache";

export function useRemoveRoom() {
	const clearRoomCache = useClearRoomCache();

	return useMutation({
		mutationFn: (roomId: string) => ignoreNotFound(removeRoom(roomId)),
		onSuccess: (_, roomId) => clearRoomCache(roomId)
	});
}
