import { useQueries, useQuery } from "@tanstack/react-query";

import { postQueries, type RoomPostSummary } from "../api/posts";
import { profileQueries } from "../api/profile";
import { roomQueries } from "../api/rooms";
import { baselineSpend, calculateDebtScore } from "../domain/score";
import { type Tier, TIER_LABELS, TIER_MIN_SCORES, tierFromScore } from "../domain/tier";
import { monthRange } from "../utils/date";

const TIER_ORDER: Tier[] = ["penniless", "hardcore", "flower", "king"];
const KING_LABEL = "이 방의 지배자";

type MyPost = {
	amountKrw: number;
	verdicts: Set<string>;
};

function formatNextTier(tier: Tier, score: number) {
	const next = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];

	if (next === undefined) {
		return KING_LABEL;
	}

	return `${TIER_LABELS[next]}까지 ${TIER_MIN_SCORES[next] - score}점`;
}

/**
 * 이번 달에 내가 올린 지출을 게시물 단위로 모은다.
 *
 * 게시물 하나가 내가 속한 방마다 한 번씩 피드에 나오므로 id 로 합친다. 판결은 방마다 따로 나기
 * 때문에 평결은 게시물당 여러 개가 될 수 있고, 그것을 모아 두었다가 아래에서 하나로 정한다.
 * 살까 말까(considering)는 쓴 돈이 아니라 제외한다.
 */
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

			const collected = byPostId.get(post.id) ?? { amountKrw: post.amountKrw, verdicts: new Set<string>() };

			if (post.juryStatus !== null) {
				collected.verdicts.add(post.juryStatus);
			}

			byPostId.set(post.id, collected);
		}
	}

	return byPostId;
}

/**
 * 게시물 단위로 센다. 한 게시물이 방마다 다른 평결을 받았으면 무죄가 하나라도 있으면 무죄로 본다
 * (백엔드 거지력 집계 DebtScoreQueries 와 같은 규칙).
 */
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

	return { guilty, notGuilty, dismissed, total: guilty + notGuilty + dismissed };
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
	const errors = [me.error, rooms.error, ...feeds.map((result) => result.error)];
	const error = errors.find((candidate) => candidate !== null) ?? null;

	return {
		isPending,
		isError: error !== null,
		error,
		profile,
		spentThisMonth,
		baseline: profile === null ? null : baselineSpend(profile.monthlyBudget, now),
		score,
		tier,
		nextTierLabel: formatNextTier(tier, score),
		judged
	};
}
