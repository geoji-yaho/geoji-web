import { queryOptions } from "@tanstack/react-query";

import type { Verdict } from "../domain/verdict";
import { isPast } from "../utils/date";
import { isApiError } from "./api-error";
import { http } from "./http";

export type TrialVerdict = "GUILTY" | "NOT_GUILTY";

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

export const VERDICT_BY_TRIAL_VERDICT: Record<TrialVerdict, Verdict> = {
	GUILTY: "guilty",
	NOT_GUILTY: "notGuilty"
};

export const TRIAL_VERDICT_BY_VERDICT: Partial<Record<Verdict, TrialVerdict>> = {
	guilty: "GUILTY",
	notGuilty: "NOT_GUILTY"
};

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
	return trial.guiltyVotes + trial.notGuiltyVotes;
}

export function verdictFromTrial(trial: Trial, now = new Date()) {
	if (trial.verdict !== null) {
		return VERDICT_BY_TRIAL_VERDICT[trial.verdict];
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
