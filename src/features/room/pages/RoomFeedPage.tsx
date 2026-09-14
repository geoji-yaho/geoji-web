import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import type { ApiError } from "@/shared/api/api-error";
import { type Comment, commentQueries } from "@/shared/api/comments";
import { expenseQueries } from "@/shared/api/expenses";
import { memberQueries, type RoomMember } from "@/shared/api/members";
import { profileQueries } from "@/shared/api/profile";
import { trialQueries } from "@/shared/api/trials";
import { CommentSheet } from "@/shared/components/CommentSheet";
import { EmptyState } from "@/shared/components/EmptyState";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Fab } from "@/shared/ui/Fab";
import { Reveal } from "@/shared/ui/Reveal";
import { formatRelativeTime, recentRange } from "@/shared/utils/date";

import { TrialExpenseCard } from "../components/TrialExpenseCard";
import { useCreateComment } from "../hooks/useCreateComment";

const RECENT_DAYS = 30;

type SheetState = {
	expenseId: string;
	open: boolean;
};

type QueryFailure = {
	isError: boolean;
	error: ApiError | null;
};

function firstErrorOf(queries: QueryFailure[]) {
	return queries.find((query) => query.isError)?.error ?? null;
}

function toCommentItems(comments: Comment[], membersById: Map<string, RoomMember>) {
	return comments.map((comment) => ({
		id: comment.id,
		authorName: membersById.get(comment.userId)?.nickname ?? "",
		content: comment.content,
		createdAtLabel: formatRelativeTime(comment.createdAt)
	}));
}

export function RoomFeedPage() {
	const { roomId = "" } = useParams();
	const navigate = useNavigate();
	const [range] = useState(() => recentRange(RECENT_DAYS));
	const [sheet, setSheet] = useState<SheetState | null>(null);

	const me = useQuery(profileQueries.me());
	const members = useQuery(memberQueries.list(roomId));
	const expenses = useQuery(expenseQueries.listByRoom(roomId, range));
	const expenseList = expenses.data ?? [];
	const quickTaps = expenseList.filter((expense) => expense.source === "quick_tap");
	const trials = useQueries({
		queries: quickTaps.map((expense) => trialQueries.detail(roomId, expense.id))
	});
	const comments = useQueries({
		queries: expenseList.map((expense) => commentQueries.list(roomId, expense.id))
	});
	const createComment = useCreateComment();

	const trialByExpenseId = new Map(quickTaps.map((expense, index) => [expense.id, trials[index]] as const));
	const commentsByExpenseId = new Map(expenseList.map((expense, index) => [expense.id, comments[index]] as const));
	const membersById = new Map(members.data?.map((member) => [member.userId, member] as const));
	const eligibleCount = members.data ? Math.max(0, members.data.length - 1) : 0;
	const roomQuery = `room=${encodeURIComponent(roomId)}`;

	const isPending =
		me.isPending ||
		members.isPending ||
		expenses.isPending ||
		trials.some((trial) => trial.isPending) ||
		comments.some((comment) => comment.isPending);
	const firstError = firstErrorOf([me, members, expenses]) ?? firstErrorOf(trials) ?? firstErrorOf(comments);
	const isEmpty = expenses.isSuccess && expenseList.length === 0;
	const sheetComments = sheet ? commentsByExpenseId.get(sheet.expenseId) : undefined;

	const openSheet = (expenseId: string) => {
		createComment.reset();
		setSheet({ expenseId, open: true });
	};

	const closeSheet = () => {
		setSheet((current) => (current ? { ...current, open: false } : current));
	};

	return (
		<>
			<div className="flex flex-1 flex-col gap-3 px-5 py-3">
				{isPending && (
					<Card role="status" className="p-4.5 text-chip text-mute">
						피드를 불러오는 중
					</Card>
				)}
				{firstError && <Alert>{firstError.message}</Alert>}
				{isEmpty && <EmptyState title="아직 아무도 돈을 쓰지 않았습니다. 평화롭네요." />}

				{!isPending &&
					expenseList.map((expense, index) => (
						<Reveal key={expense.id} index={index}>
							<TrialExpenseCard
								expense={expense}
								trial={trialByExpenseId.get(expense.id)?.data}
								author={membersById.get(expense.userId)}
								myUserId={me.data?.id}
								eligibleCount={eligibleCount}
								commentCount={commentsByExpenseId.get(expense.id)?.data?.length ?? 0}
								onVote={() => void navigate(`/posts/${expense.id}/vote?${roomQuery}`)}
								onOpenVerdict={() => void navigate(`/posts/${expense.id}?${roomQuery}`)}
								onComments={() => openSheet(expense.id)}
							/>
						</Reveal>
					))}
			</div>

			<Fab
				label="+ 지출 등록"
				onClick={() => void navigate("/posts/new")}
				className="sticky bottom-6 z-40 mr-5 self-end"
			/>

			{sheet && (
				<CommentSheet
					key={sheet.expenseId}
					open={sheet.open}
					onClose={closeSheet}
					comments={toCommentItems(sheetComments?.data ?? [], membersById)}
					isLoading={sheetComments?.isPending ?? false}
					error={sheetComments?.error?.message ?? null}
					onSubmit={(content) => createComment.mutateAsync({ roomId, expenseId: sheet.expenseId, input: { content } })}
					isSubmitting={createComment.isPending}
					submitError={createComment.error?.message ?? null}
				/>
			)}
		</>
	);
}
