export type AccessTokenProvider = () => Promise<string | null>;

let provider: AccessTokenProvider | null = null;

export function setAccessTokenProvider(next: AccessTokenProvider | null) {
	provider = next;
}

export async function getAccessToken() {
	if (provider === null) {
		return null;
	}

	return provider();
}
