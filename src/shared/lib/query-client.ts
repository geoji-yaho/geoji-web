import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { type ApiError, type ApiErrorKind, isApiError } from "../api/api-error";

declare module "@tanstack/react-query" {
	interface Register {
		defaultError: ApiError;
	}
}

export type CreateQueryClientOptions = {
	onUnauthorized?: () => void;
};

const STALE_TIME_MS = 10_000;
const RETRY_LIMIT = 2;
const RETRYABLE_KINDS: readonly ApiErrorKind[] = ["network", "timeout", "server"];

export function createQueryClient(options: CreateQueryClientOptions = {}) {
	const handleError = (error: unknown) => {
		if (isApiError(error) && error.kind === "unauthorized") {
			options.onUnauthorized?.();
		}
	};

	return new QueryClient({
		queryCache: new QueryCache({ onError: handleError }),
		mutationCache: new MutationCache({ onError: handleError }),
		defaultOptions: {
			queries: {
				staleTime: STALE_TIME_MS,
				retry: (failureCount, error) =>
					failureCount < RETRY_LIMIT && isApiError(error) && RETRYABLE_KINDS.includes(error.kind)
			},
			mutations: {
				retry: false
			}
		}
	});
}
