import { queryOptions } from "@tanstack/react-query";

import type { PostType } from "../domain/post";
import type { VoteVerdict } from "../domain/verdict";
import { isPast } from "../utils/date";
import { isApiError } from "./api-error";
import { http } from "./http";

export type TrialVerdict = VoteVerdict;

export type TrialVote = {
	id: string;
	voterUserId: string;
	verdict: TrialVerdict;
	reason: string;
	createdAt: string;
};

export type Trial = {
	id: string;
	roomId: string;
	expenseId: string;
	votingDeadline: string;
	verdict: TrialVerdict | null;
	verdictText: string | null;
	sentenceDays: number | null;
	sentenceStartedAt: string | null;
	sentenceEndedAt: string | null;
	judgedAt: string | null;
	guiltyVotes: number;
	notGuiltyVotes: number;
	agreeVotes: number;
	disagreeVotes: number;
	myVote: TrialVerdict | null;
	votes: TrialVote[];
};

export type CastVoteInput = {
	verdict: TrialVerdict;
	reason: string;
};

export const TRIAL_QUORUM = 2;

const HEADLINE_MAX_LENGTH = 30;
const FIRST_SENTENCE = /^[\s\S]*?[.!?](?=\s|$)/;

export function tallyFromTrial(trial: Trial, postType: PostType) {
	return postType === "considering"
		? { oppose: trial.disagreeVotes, support: trial.agreeVotes }
		: { oppose: trial.guiltyVotes, support: trial.notGuiltyVotes };
}

export function sentenceFromDays(days: number | null) {
	if (days === null || days === 0) {
		return "probation";
	}

	if (days === 1) {
		return "oneDay";
	}

	return "life";
}

export function voteCount(trial: Trial) {
	return trial.guiltyVotes + trial.notGuiltyVotes + trial.agreeVotes + trial.disagreeVotes;
}

export function verdictFromTrial(trial: Trial, now = new Date()) {
	if (trial.verdict !== null) {
		return trial.verdict;
	}

	if (isPast(trial.votingDeadline, now) && voteCount(trial) < TRIAL_QUORUM) {
		return "dismissed";
	}

	return null;
}

export function headlineFromVerdictText(verdictText: string | null) {
	const text = verdictText?.trim();

	if (!text) {
		return null;
	}

	const sentence = (FIRST_SENTENCE.exec(text)?.[0] ?? text).trim();

	return sentence.length > HEADLINE_MAX_LENGTH ? `${sentence.slice(0, HEADLINE_MAX_LENGTH)}…` : sentence;
}

function trialPath(roomId: string, expenseId: string) {
	return `/api/rooms/${encodeURIComponent(roomId)}/expenses/${encodeURIComponent(expenseId)}`;
}

export async function fetchTrial(roomId: string, expenseId: string, signal?: AbortSignal) {
	try {
		return await http.get<Trial>(`${trialPath(roomId, expenseId)}/trial`, { signal });
	} catch (error) {
		if (isApiError(error) && error.kind === "badRequest") {
			return null;
		}

		throw error;
	}
}

export function castVote(roomId: string, expenseId: string, input: CastVoteInput) {
	return http.post<Trial>(`${trialPath(roomId, expenseId)}/votes`, { body: input });
}

export function judgeTrial(roomId: string, expenseId: string) {
	return http.post<Trial>(`${trialPath(roomId, expenseId)}/trial/judge`);
}

export const trialQueries = {
	all: () => ["trials"] as const,
	details: () => [...trialQueries.all(), "detail"] as const,
	detail: (roomId: string, expenseId: string) =>
		queryOptions({
			queryKey: [...trialQueries.details(), roomId, expenseId] as const,
			queryFn: ({ signal }) => fetchTrial(roomId, expenseId, signal)
		})
};
