import { http } from "@/shared/api/http";
import type { PostType } from "@/shared/domain/post";

export type ExpenseSource = "quick_tap" | "purchase_check";

export type Expense = {
	id: string;
	userId: string;
	amount: number;
	category: string | null;
	memo: string | null;
	source: ExpenseSource;
	spentAt: string;
};

export type CreateExpenseInput = {
	amount: number;
	category?: string;
	memo?: string;
	source: ExpenseSource;
	spentAt?: string;
};

export const EXPENSE_SOURCE_BY_POST_TYPE: Record<PostType, ExpenseSource> = {
	spent: "quick_tap",
	considering: "purchase_check"
};

export function createExpense(input: CreateExpenseInput) {
	return http.post<Expense>("/api/expenses", { body: input });
}
