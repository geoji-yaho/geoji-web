import { useMutation, useQueryClient } from "@tanstack/react-query";

import { castVote, type CastVoteInput, judgeTrial, trialQueries, voteCount } from "@/shared/api/trials";

type CastVoteVariables = {
	roomId: string;
	expenseId: string;
	eligibleCount: number;
	input: CastVoteInput;
};

export function useCastVote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, expenseId, input }: CastVoteVariables) => castVote(roomId, expenseId, input),
		onSuccess: async (trial, { roomId, expenseId, eligibleCount }) => {
			const { queryKey } = trialQueries.detail(roomId, expenseId);
			queryClient.setQueryData(queryKey, trial);

			if (voteCount(trial) < eligibleCount) {
				return;
			}

			try {
				queryClient.setQueryData(queryKey, await judgeTrial(roomId, expenseId));
			} catch {
				await queryClient.invalidateQueries({ queryKey });
			}
		}
	});
}
