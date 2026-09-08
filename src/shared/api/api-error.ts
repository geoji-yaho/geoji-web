export type ApiErrorKind =
	"badRequest" | "unauthorized" | "forbidden" | "notFound" | "conflict" | "server" | "network" | "timeout";

export type ApiErrorOptions = {
	status?: number;
	body?: unknown;
	cause?: unknown;
};

export const API_ERROR_MESSAGES: Record<ApiErrorKind, string> = {
	badRequest: "요청이 올바르지 않습니다",
	unauthorized: "로그인이 필요합니다",
	forbidden: "권한이 없습니다",
	notFound: "찾을 수 없습니다",
	conflict: "지금 상태에서는 할 수 없습니다",
	server: "서버에 문제가 생겼습니다",
	network: "네트워크에 연결할 수 없습니다",
	timeout: "응답이 늦어 요청을 취소했습니다"
};

function kindFromStatus(status: number) {
	if (status >= 500) {
		return "server";
	}

	switch (status) {
		case 401:
			return "unauthorized";
		case 403:
			return "forbidden";
		case 404:
			return "notFound";
		case 409:
			return "conflict";
		default:
			return "badRequest";
	}
}

function readMessage(body: unknown) {
	if (typeof body !== "object" || body === null || !("message" in body)) {
		return null;
	}

	const { message } = body;
	return typeof message === "string" && message !== "" ? message : null;
}

export class ApiError extends Error {
	readonly kind: ApiErrorKind;
	readonly status: number | null;
	readonly body: unknown;

	constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
		super(message, { cause: options.cause });
		this.name = "ApiError";
		this.kind = kind;
		this.status = options.status ?? null;
		this.body = options.body;
	}

	static fromResponse(status: number, body: unknown) {
		const kind = kindFromStatus(status);
		const message = readMessage(body) ?? API_ERROR_MESSAGES[kind];

		return new ApiError(kind, message, { status, body });
	}
}

export function isApiError(error: unknown) {
	return error instanceof ApiError;
}
