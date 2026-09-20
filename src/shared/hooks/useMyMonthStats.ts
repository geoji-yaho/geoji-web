import { useQueries, useQuery } from "@tanstack/react-query";

import { postQueries, type RoomPostSummary } from "../api/posts";
import { profileQueries } from "../api/profile";
import { roomQueries } from "../api/rooms";
import { baselineSpend, calculateDebtScore, DEBT_SCORE_MAX_WITHOUT_API } from "../domain/score";
import { type Tier, TIER_LABELS, TIER_MIN_SCORES, tierFromScore } from "../domain/tier";
import type { Verdict } from "../domain/verdict";
import { monthRange } from "../utils/date";

const TIER_ORDER: Tier[] = ["penniless", "hardcore", "flower", "king"];
const KING_LABEL = "이 방의 지배자";
const UNREACHABLE_TIER_LABEL = "무지출과 참여 점수 집계 전";

type MyPost = {
	amountKrw: number;
	verdicts: Set<Verdict>;
};

function formatNextTier(tier: Tier, score: number) {
	const next = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];

	if (next === undefined) {
		return KING_LABEL;
	}

	if (TIER_MIN_SCORES[next] > DEBT_SCORE_MAX_WITHOUT_API) {
		return UNREACHABLE_TIER_LABEL;
	}

	return `${TIER_LABELS[next]}까지 ${TIER_MIN_SCORES[next] - score}점`;
}

function collectMyPosts(
	feeds: (RoomPostSummary[] | undefined)[],
	userId: string | null,
	range: { from: Date; to: Date }
) {
	const byPostId = new Map<string, MyPost>();

	if (userId === null) {
		return byPostId;
	}

	for (const feed of feeds) {
		if (feed === undefined) {
			continue;
		}

		for (const post of feed) {
			const createdAt = new Date(post.createdAt);
			const inThisMonth = createdAt >= range.from && createdAt <= range.to;

			if (post.authorId !== userId || post.postType !== "spent" || !inThisMonth) {
				continue;
			}

			const collected = byPostId.get(post.id) ?? { amountKrw: post.amountKrw, verdicts: new Set<Verdict>() };

			if (post.juryStatus !== null) {
				collected.verdicts.add(post.juryStatus);
			}

			byPostId.set(post.id, collected);
		}
	}

	return byPostId;
}

function countJudged(posts: Map<string, MyPost>) {
	let guilty = 0;
	let notGuilty = 0;
	let dismissed = 0;

	for (const post of posts.values()) {
		if (post.verdicts.has("notGuilty")) {
			notGuilty += 1;
		} else if (post.verdicts.has("guilty")) {
			guilty += 1;
		} else if (post.verdicts.has("dismissed")) {
			dismissed += 1;
		}
	}

	return { guilty, notGuilty, dismissed };
}

export function useMyMonthStats() {
	const now = new Date();
	const { from, to } = monthRange(now);
	const range = { from: new Date(from), to: new Date(to) };

	const me = useQuery(profileQueries.me());
	const rooms = useQuery(roomQueries.list());

	const roomIds = (rooms.data ?? []).map((room) => room.id);
	const feeds = useQueries({
		queries: roomIds.map((roomId) => postQueries.feed(roomId))
	});

	const profile = me.data ?? null;
	const myPosts = collectMyPosts(
		feeds.map((result) => result.data),
		profile?.id ?? null,
		range
	);

	let spentThisMonth = 0;
	for (const post of myPosts.values()) {
		spentThisMonth += post.amountKrw;
	}

	const judged = countJudged(myPosts);
	const score = calculateDebtScore({
		monthlyBudget: profile === null ? null : profile.monthlyBudget,
		spentThisMonth,
		today: now,
		judged: { total: judged.guilty + judged.notGuilty, acquitted: judged.notGuilty }
	});
	const tier: Tier = tierFromScore(score);

	const isPending = me.isPending || rooms.isPending || feeds.some((result) => result.isPending);
	const summaryErrors = [me.error, ...feeds.map((result) => result.error)];
	const summaryError = summaryErrors.find((candidate) => candidate !== null) ?? null;
	const error = summaryError ?? rooms.error;

	const retry = () => {
		void me.refetch();
		void rooms.refetch();

		for (const feed of feeds) {
			void feed.refetch();
		}
	};

	return {
		isPending,
		isError: error !== null,
		error,
		retry,
		summaryError,
		profile,
		spentThisMonth,
		baseline: profile === null ? null : baselineSpend(profile.monthlyBudget, now),
		score,
		tier,
		nextTierLabel: formatNextTier(tier, score),
		judged
	};
}
