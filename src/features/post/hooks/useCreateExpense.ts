import { useMutation } from "@tanstack/react-query";

import { createExpense } from "../api/expenses";

export function useCreateExpense() {
	return useMutation({ mutationFn: createExpense });
}
