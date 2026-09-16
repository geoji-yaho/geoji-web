function roomSearch(roomId: string) {
	return new URLSearchParams({ room: roomId }).toString();
}

export function verdictPath(expenseId: string, roomId: string) {
	return `/posts/${encodeURIComponent(expenseId)}?${roomSearch(roomId)}`;
}

export function verdictCardPath(expenseId: string, roomId: string) {
	return `/posts/${encodeURIComponent(expenseId)}/card?${roomSearch(roomId)}`;
}

export function invitePath(inviteCode: string) {
	return `/invite/${encodeURIComponent(inviteCode)}`;
}

export function votePath(expenseId: string, roomId: string) {
	return `/posts/${encodeURIComponent(expenseId)}/vote?${roomSearch(roomId)}`;
}

export function expenseCreatePath(roomId: string) {
	return `/posts/new?${roomSearch(roomId)}`;
}
