import { useQueryClient } from "@tanstack/react-query";

import { memberQueries } from "@/shared/api/members";
import { roomQueries } from "@/shared/api/rooms";

export function useClearRoomCache() {
	const queryClient = useQueryClient();

	return (roomId: string) => {
		void queryClient.invalidateQueries({ queryKey: roomQueries.detail(roomId).queryKey, refetchType: "none" });
		void queryClient.invalidateQueries({ queryKey: memberQueries.list(roomId).queryKey, refetchType: "none" });
		queryClient.setQueryData(roomQueries.list().queryKey, (prev) => prev?.filter((room) => room.id !== roomId));
		return queryClient.invalidateQueries({ queryKey: roomQueries.lists() });
	};
}
