import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinRoom, roomQueries } from "@/shared/api/rooms";

export function useJoinRoom() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: joinRoom,
		onSuccess: (room) => {
			queryClient.setQueryData(roomQueries.detail(room.id).queryKey, room);
			return queryClient.invalidateQueries({ queryKey: roomQueries.lists() });
		}
	});
}
