import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoom, roomQueries } from "@/shared/api/rooms";

export function useCreateRoom() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRoom,
		onSuccess: (room) => {
			queryClient.setQueryData(roomQueries.detail(room.id).queryKey, room);
			return queryClient.invalidateQueries({ queryKey: roomQueries.lists() });
		}
	});
}
