import { useMutation, useQueryClient } from "@tanstack/react-query";

import { judgeTrial, trialQueries } from "@/shared/api/trials";

type JudgeTrialInput = {
	roomId: string;
	expenseId: string;
};

export function useJudgeTrial() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roomId, expenseId }: JudgeTrialInput) => judgeTrial(roomId, expenseId),
		onSuccess: (trial, { roomId, expenseId }) => {
			queryClient.setQueryData(trialQueries.detail(roomId, expenseId).queryKey, trial);
		}
	});
}
