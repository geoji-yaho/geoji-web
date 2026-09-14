import { env } from "../lib/env";
import { API_ERROR_MESSAGES, ApiError } from "./api-error";
import { getAccessToken } from "./auth-token";

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export type RequestOptions = {
	query?: QueryParams;
	body?: unknown;
	signal?: AbortSignal;
	timeoutMs?: number;
	auth?: boolean;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const DEFAULT_TIMEOUT_MS = 10_000;

function buildUrl(path: string, query: QueryParams | undefined) {
	const url = env.apiBaseUrl + path;

	if (!query) {
		return url;
	}

	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === null || value === undefined) {
			continue;
		}

		params.set(key, String(value));
	}

	const search = params.toString();
	return search === "" ? url : `${url}?${search}`;
}

async function buildHeaders(body: unknown, auth: boolean) {
	const headers: Record<string, string> = { Accept: "application/json" };

	if (body !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	if (auth) {
		const token = await getAccessToken();

		if (token !== null) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	return headers;
}

async function readErrorBody(response: Response) {
	try {
		const body: unknown = await response.json();
		return body;
	} catch (error) {
		if (error instanceof SyntaxError) {
			return undefined;
		}

		throw error;
	}
}

async function readSuccessBody<T>(response: Response) {
	if (response.status === 204) {
		return undefined as T;
	}

	const text = await response.text();

	if (text === "") {
		return undefined as T;
	}

	return JSON.parse(text) as T;
}

function toRequestError(error: unknown, signal: AbortSignal | undefined) {
	if (error instanceof ApiError || signal?.aborted) {
		return error;
	}

	if (error instanceof Error && error.name === "TimeoutError") {
		return new ApiError("timeout", API_ERROR_MESSAGES.timeout, { cause: error });
	}

	if (error instanceof TypeError) {
		return new ApiError("network", API_ERROR_MESSAGES.network, { cause: error });
	}

	return error;
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}) {
	const { query, body, signal, timeoutMs = DEFAULT_TIMEOUT_MS, auth = true } = options;
	const url = buildUrl(path, query);
	const headers = await buildHeaders(body, auth);
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

	try {
		const response = await fetch(url, {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: requestSignal
		});

		if (!response.ok) {
			throw ApiError.fromResponse(response.status, await readErrorBody(response));
		}

		return await readSuccessBody<T>(response);
	} catch (error) {
		throw toRequestError(error, signal);
	}
}

export const http = {
	get<T>(path: string, options?: Omit<RequestOptions, "body">) {
		return request<T>("GET", path, options);
	},
	post<T>(path: string, options?: RequestOptions) {
		return request<T>("POST", path, options);
	},
	put<T>(path: string, options?: RequestOptions) {
		return request<T>("PUT", path, options);
	},
	delete<T>(path: string, options?: RequestOptions) {
		return request<T>("DELETE", path, options);
	}
};
