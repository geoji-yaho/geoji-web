import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { postQueries, type PostVerdict } from "@/shared/api/posts";

const FAST_INTERVAL_MS = 1000;
const SLOW_INTERVAL_MS = 5000;
const SLOW_DOWN_AFTER_MS = 15000;
const TEMPLATE_RECHECK_MS = 30000;

function settled(verdict: PostVerdict) {
	return verdict.textStatus === "AI_READY" || verdict.juryStatus === "dismissed";
}

function intervalFor(verdict: PostVerdict, elapsedMs: number) {
	if (settled(verdict)) {
		return false as const;
	}
	if (verdict.textStatus === "TEMPLATE_READY") {
		return TEMPLATE_RECHECK_MS;
	}
	return elapsedMs > SLOW_DOWN_AFTER_MS ? SLOW_INTERVAL_MS : FAST_INTERVAL_MS;
}

export function usePostVerdict(postId: string, roomId: string | null, enabled = true) {
	const startedAt = useRef<number | null>(null);

	useEffect(() => {
		startedAt.current = Date.now();
	}, [postId]);

	return useQuery({
		...postQueries.verdict(postId, roomId),
		enabled: enabled && postId !== "",
		structuralSharing: (previous, next) => {
			const before = previous as PostVerdict | undefined;
			const after = next as PostVerdict;
			return before && after.textVersion < before.textVersion ? before : after;
		},
		refetchInterval: (query) => {
			if (query.state.status === "error") {
				return false;
			}
			const verdict = query.state.data;
			if (!verdict) {
				return FAST_INTERVAL_MS;
			}
			const startMs = startedAt.current;
			return intervalFor(verdict, startMs === null ? 0 : Date.now() - startMs);
		}
	});
}
