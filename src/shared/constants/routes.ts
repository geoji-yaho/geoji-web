function roomSearch(roomId: string) {
	return new URLSearchParams({ room: roomId }).toString();
}

export function verdictPath(postId: string, roomId: string) {
	return `/posts/${encodeURIComponent(postId)}?${roomSearch(roomId)}`;
}

export function verdictCardPath(postId: string, roomId: string) {
	return `/posts/${encodeURIComponent(postId)}/card?${roomSearch(roomId)}`;
}

export function roomPath(roomId: string) {
	return `/rooms/${encodeURIComponent(roomId)}`;
}

export function roomInfoPath(roomId: string) {
	return `${roomPath(roomId)}/info`;
}

export function invitePath(inviteCode: string) {
	return `/invite/${encodeURIComponent(inviteCode)}`;
}

export function votePath(postId: string, roomId: string) {
	return `/posts/${encodeURIComponent(postId)}/vote?${roomSearch(roomId)}`;
}

export function expenseCreatePath(roomId: string) {
	return `/posts/new?${roomSearch(roomId)}`;
}
