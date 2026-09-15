const INVITE_PATH_PATTERN = /\/invite\/([^/?#\s]+)/;
const INVITE_CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

export function parseInviteCode(input: string) {
	const trimmed = input.trim();
	const candidate = INVITE_PATH_PATTERN.exec(trimmed)?.[1] ?? trimmed;
	return INVITE_CODE_PATTERN.test(candidate) ? candidate : null;
}
