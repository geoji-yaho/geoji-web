import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import type { ApiError } from "@/shared/api/api-error";
import { memberQueries, type RoomMember } from "@/shared/api/members";
import { type PostComment, postQueries, type RoomPostSummary } from "@/shared/api/posts";
import { profileQueries } from "@/shared/api/profile";
import { CommentSheet } from "@/shared/components/CommentSheet";
import { EmptyState } from "@/shared/components/EmptyState";
import { expenseCreatePath, verdictPath, votePath } from "@/shared/constants/routes";
import { useCreatePostComment } from "@/shared/hooks/useCreatePostComment";
import { useRemovePostComment } from "@/shared/hooks/useRemovePostComment";
import { useRouteNotice } from "@/shared/hooks/useRouteNotice";
import { Alert } from "@/shared/ui/Alert";
import { Card } from "@/shared/ui/Card";
import { Fab } from "@/shared/ui/Fab";
import { Reveal } from "@/shared/ui/Reveal";
import { Toast } from "@/shared/ui/Toast";
import { formatRelativeTime } from "@/shared/utils/date";

import { PostFeedCard } from "../components/PostFeedCard";

type SheetState = {
	postId: string;
	open: boolean;
};

type QueryFailure = {
	isError: boolean;
	error: ApiError | null;
};

function firstErrorOf(queries: QueryFailure[]) {
	return queries.find((query) => query.isError)?.error ?? null;
}

function countFailedPosts(posts: RoomPostSummary[], details: Map<string, QueryFailure | undefined>[]) {
	return posts.filter((post) => details.some((detail) => detail.get(post.id)?.isError === true)).length;
}

function toCommentItems(comments: PostComment[], myUserId: string | undefined, membersById: Map<string, RoomMember>) {
	return comments.map((comment) => ({
		id: comment.id,
		authorName: comment.nickname,
		authorImageUrl: membersById.get(comment.userId)?.avatarUrl,
		content: comment.content,
		createdAtLabel: formatRelativeTime(comment.createdAt),
		isMine: myUserId !== undefined && comment.userId === myUserId
	}));
}

export function RoomFeedPage() {
	const { roomId = "" } = useParams();
	const navigate = useNavigate();
	const notice = useRouteNotice();
	const [sheet, setSheet] = useState<SheetState | null>(null);

	const me = useQuery(profileQueries.me());
	const members = useQuery(memberQueries.list(roomId));
	const feed = useQuery(postQueries.feed(roomId));
	const postList = feed.data ?? [];
	const judged = postList.filter((post) => post.juryStatus !== null && post.juryStatus !== "dismissed");
	const verdicts = useQueries({
		queries: judged.map((post) => postQueries.verdict(post.id, roomId))
	});
	const comments = useQueries({
		queries: postList.map((post) => postQueries.comments(post.id, roomId))
	});
	const createComment = useCreatePostComment();
	const removeComment = useRemovePostComment();

	const verdictByPostId = new Map(judged.map((post, index) => [post.id, verdicts[index]] as const));
	const commentsByPostId = new Map(postList.map((post, index) => [post.id, comments[index]] as const));
	const membersById = new Map<string, RoomMember>(members.data?.map((member) => [member.userId, member] as const));
	const eligibleCount = members.data ? Math.max(0, members.data.length - 1) : 0;

	const isPending = me.isPending || members.isPending || feed.isPending;
	const feedError = firstErrorOf([me, members, feed]);
	const failedDetailCount = countFailedPosts(postList, [verdictByPostId, commentsByPostId]);
	const isEmpty = feed.isSuccess && postList.length === 0;
	const sheetComments = sheet ? commentsByPostId.get(sheet.postId) : undefined;

	const openSheet = (postId: string) => {
		createComment.reset();
		removeComment.reset();
		setSheet({ postId, open: true });
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
				{feedError && <Alert>{feedError.message}</Alert>}
				{!feedError && failedDetailCount > 0 && (
					<Alert tone="fill">
						게시물 {failedDetailCount}건의 판결과 댓글을 불러오지 못했습니다. 그 카드의 도장과 댓글 수가 실제와 다를 수
						있습니다.
					</Alert>
				)}
				{isEmpty && <EmptyState title="아직 아무도 돈을 쓰지 않았습니다. 평화롭네요." />}

				{!isPending &&
					postList.map((post, index) => (
						<Reveal key={post.id} index={index}>
							<PostFeedCard
								post={post}
								verdict={verdictByPostId.get(post.id)?.data}
								author={membersById.get(post.authorId)}
								myUserId={me.data?.id}
								eligibleCount={eligibleCount}
								commentCount={commentsByPostId.get(post.id)?.data?.length ?? 0}
								onVote={() => void navigate(votePath(post.id, roomId))}
								onOpenVerdict={() => void navigate(verdictPath(post.id, roomId))}
								onComments={() => openSheet(post.id)}
							/>
						</Reveal>
					))}
			</div>

			<Fab
				label="+ 지출 등록"
				onClick={() => void navigate(expenseCreatePath(roomId))}
				className="sticky bottom-6 z-40 mr-5 self-end"
			/>

			{sheet && (
				<CommentSheet
					key={sheet.postId}
					open={sheet.open}
					onClose={closeSheet}
					comments={toCommentItems(sheetComments?.data ?? [], me.data?.id, membersById)}
					isLoading={sheetComments?.isPending ?? false}
					error={sheetComments?.error?.message ?? null}
					onSubmit={(content) => createComment.mutateAsync({ postId: sheet.postId, roomId, content })}
					isSubmitting={createComment.isPending}
					submitError={createComment.error?.message ?? null}
					onRemove={(commentId) => removeComment.mutateAsync({ postId: sheet.postId, roomId, commentId })}
					removingId={removeComment.isPending ? removeComment.variables.commentId : null}
					removeError={removeComment.error?.message ?? null}
				/>
			)}

			{notice && (
				<div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-5">
					<Toast>{notice}</Toast>
				</div>
			)}
		</>
	);
}
