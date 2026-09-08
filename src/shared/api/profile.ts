import { queryOptions } from "@tanstack/react-query";

import { isApiError } from "./api-error";
import { http } from "./http";

export type Profile = {
	id: string;
	nickname: string;
	avatarUrl: string | null;
	monthlyBudget: number;
};

export type ProfileInput = {
	nickname: string;
	monthlyBudget?: number;
};

async function fetchProfile(signal: AbortSignal) {
	try {
		return await http.get<Profile>("/api/me", { signal });
	} catch (error) {
		if (isApiError(error) && error.kind === "conflict") {
			return null;
		}

		throw error;
	}
}

export function createProfile(input: ProfileInput) {
	return http.post<Profile>("/api/me", { body: input });
}

export function updateProfile(input: ProfileInput) {
	return http.put<Profile>("/api/me", { body: input });
}

export const profileQueries = {
	all: () => ["profile"] as const,
	me: () =>
		queryOptions({
			queryKey: [...profileQueries.all(), "me"] as const,
			queryFn: ({ signal }) => fetchProfile(signal)
		})
};
