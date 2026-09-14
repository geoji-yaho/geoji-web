import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense, expenseQueries } from "@/shared/api/expenses";

export function useCreateExpense() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createExpense,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: expenseQueries.lists() })
	});
}
