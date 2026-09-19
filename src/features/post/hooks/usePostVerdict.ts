import { replaceEqualDeep, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { type ApiErrorKind, isApiError } from "@/shared/api/api-error";
import { postQueries, type PostVerdict } from "@/shared/api/posts";
import type { Verdict } from "@/shared/domain/verdict";

const FAST_INTERVAL_MS = 1000;
const SLOW_INTERVAL_MS = 5000;
const SLOW_DOWN_AFTER_MS = 15000;
const TEMPLATE_RECHECK_MS = 30000;
const STOP_RETRY_AFTER_MS = 120000;
const POLL_THROUGH_KINDS: readonly ApiErrorKind[] = ["network", "timeout", "server"];

function settled(verdict: PostVerdict) {
	return verdict.textStatus === "AI_READY" || verdict.juryStatus === "dismissed";
}

function baseIntervalFor(elapsedMs: number) {
	return elapsedMs > SLOW_DOWN_AFTER_MS ? SLOW_INTERVAL_MS : FAST_INTERVAL_MS;
}

function intervalFor(verdict: PostVerdict, elapsedMs: number) {
	const ownInterval = verdict.textStatus === "TEMPLATE_READY" ? TEMPLATE_RECHECK_MS : baseIntervalFor(elapsedMs);
	if (!Number.isFinite(verdict.pollAfterMs)) {
		return ownInterval;
	}
	return Math.max(ownInterval, verdict.pollAfterMs);
}

function retryIntervalFor(elapsedMs: number) {
	if (elapsedMs > STOP_RETRY_AFTER_MS) {
		return false as const;
	}
	return baseIntervalFor(elapsedMs);
}

function shouldKeepPolling(error: unknown) {
	return isApiError(error) && POLL_THROUGH_KINDS.includes(error.kind);
}

function readTextVersion(data: unknown) {
	if (typeof data !== "object" || data === null || !("textVersion" in data)) {
		return null;
	}
	const { textVersion } = data;
	return typeof textVersion === "number" ? textVersion : null;
}

export function usePostVerdict(postId: string, roomId: string, enabled = true) {
	const queryClient = useQueryClient();
	const startedAt = useRef<number | null>(null);
	const lastJuryStatus = useRef<Verdict | null | undefined>(undefined);

	useEffect(() => {
		startedAt.current = Date.now();
	}, [postId]);

	const query = useQuery({
		...postQueries.verdict(postId, roomId),
		enabled: enabled && postId !== "",
		structuralSharing: (previous, next) => {
			const previousVersion = readTextVersion(previous);
			const nextVersion = readTextVersion(next);
			const isStale = previousVersion !== null && nextVersion !== null && nextVersion < previousVersion;
			return isStale ? previous : replaceEqualDeep(previous, next);
		},
		refetchInterval: (query) => {
			const { status, error, data } = query.state;

			if (data !== undefined && settled(data)) {
				return false;
			}

			const startMs = startedAt.current;
			const elapsedMs = startMs === null ? 0 : Date.now() - startMs;
			const ownInterval = data === undefined ? FAST_INTERVAL_MS : intervalFor(data, elapsedMs);

			if (status !== "error") {
				return ownInterval;
			}

			if (!shouldKeepPolling(error)) {
				return false;
			}

			const retryInterval = retryIntervalFor(elapsedMs);

			return retryInterval === false ? false : Math.max(retryInterval, ownInterval);
		}
	});

	const juryStatus = query.data === undefined ? undefined : query.data.juryStatus;

	useEffect(() => {
		const wasVoting = lastJuryStatus.current === null;
		lastJuryStatus.current = juryStatus;

		if (wasVoting && juryStatus !== null && juryStatus !== undefined) {
			void queryClient.invalidateQueries({ queryKey: postQueries.detail(postId, roomId).queryKey });
		}
	}, [juryStatus, postId, roomId, queryClient]);

	return query;
}
