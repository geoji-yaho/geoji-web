import { useMutation } from "@tanstack/react-query";

import { createExpense } from "@/shared/api/expenses";

export function useCreateExpense() {
	return useMutation({ mutationFn: createExpense });
}
