import { queryOptions } from "@tanstack/react-query";

import type { PostType } from "../domain/post";
import { recentRange } from "../utils/date";
import { http } from "./http";

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

export type ExpenseRange = {
	from: string;
	to: string;
};

export const EXPENSE_SOURCE_BY_POST_TYPE: Record<PostType, ExpenseSource> = {
	spent: "quick_tap",
	considering: "purchase_check"
};

export const POST_TYPE_BY_EXPENSE_SOURCE: Record<ExpenseSource, PostType> = {
	quick_tap: "spent",
	purchase_check: "considering"
};

const DETAIL_LOOKBACK_DAYS = 90;

export function createExpense(input: CreateExpenseInput) {
	return http.post<Expense>("/api/expenses", { body: input });
}

export function fetchRoomExpenses(roomId: string, range: ExpenseRange, signal?: AbortSignal) {
	return http.get<Expense[]>(`/api/rooms/${encodeURIComponent(roomId)}/expenses`, {
		query: { from: range.from, to: range.to },
		signal
	});
}

export async function fetchRoomExpense(roomId: string, expenseId: string, signal?: AbortSignal) {
	const expenses = await fetchRoomExpenses(roomId, recentRange(DETAIL_LOOKBACK_DAYS), signal);

	return expenses.find((expense) => expense.id === expenseId) ?? null;
}

export const expenseQueries = {
	all: () => ["expenses"] as const,
	lists: () => [...expenseQueries.all(), "list"] as const,
	listByRoom: (roomId: string, { from, to }: ExpenseRange) =>
		queryOptions({
			queryKey: [...expenseQueries.lists(), roomId, from, to] as const,
			queryFn: ({ signal }) => fetchRoomExpenses(roomId, { from, to }, signal)
		}),
	details: () => [...expenseQueries.all(), "detail"] as const,
	detailInRoom: (roomId: string, expenseId: string) =>
		queryOptions({
			queryKey: [...expenseQueries.details(), roomId, expenseId] as const,
			queryFn: ({ signal }) => fetchRoomExpense(roomId, expenseId, signal)
		})
};
