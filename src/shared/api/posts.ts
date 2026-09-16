import { queryOptions } from "@tanstack/react-query";

import type { EXPENSE_CATEGORIES } from "../constants/expense-categories";
import type { PostType } from "../domain/post";
import type { Intensity } from "../domain/room";
import type { Sentence, Verdict } from "../domain/verdict";
import { http } from "./http";

export type Category = (typeof EXPENSE_CATEGORIES)[number];

export type IntakeStatus = "PASS" | "NEEDS_CLARIFICATION" | "BLOCKED";

export type IntakeResult = {
	schemaVersion: number;
	mode: "INITIAL" | "FINAL_CHECK";
	status: IntakeStatus;
	itemReview: { status: string; suggestedItem: string | null } | null;
	message: string | null;
	categoryReview: { status: string; suggestedCategory: Category | null; confidence: number } | null;
	injectionDetected: boolean;
	intakeSource: "AI" | "FALLBACK";
};

export type SubmissionStatus = "COMPLETED" | "NEEDS_INPUT" | "BLOCKED";

export type Submission = {
	submissionId: string;
	status: SubmissionStatus;
	revision: string;
	intakeResult: IntakeResult | null;
	postId: string | null;
};

export type PostDraft = {
	postType: PostType;
	amountKrw: number;
	category: Category;
	item: string;
	reason: string | null;
	roomIds: string[];
};

export type CompleteAction = "REVISE" | "PROCEED";

export type CompleteSubmissionInput = PostDraft & {
	submissionId: string;
	action: CompleteAction;
	revision: string;
};

export type SentenceStatus = "PENDING" | "FINAL";

export type TextStatus = "PENDING" | "GENERATING" | "TEMPLATE_READY" | "AI_READY";

export type TextSource = "AI" | "TEMPLATE";

export type Meme = {
	tag: string;
	imageId: string;
	imageUrl: string;
};

export type VerdictView = {
	intensity: Intensity;
	headline: string;
	statement: string[];
	sentence: Sentence | null;
	sentenceLabel: string | null;
	sentencingReason: string | null;
	source: TextSource;
	meme: Meme | null;
};

export type PostVerdict = {
	schemaVersion: number;
	postId: string;
	juryStatus: Verdict | null;
	sentenceStatus: SentenceStatus;
	textStatus: TextStatus;
	textVersion: number;
	view: VerdictView | null;
	pollAfterMs: number;
};

export type ShareCard = {
	postId: string;
	postType: PostType;
	juryStatus: Verdict;
	intensity: Intensity;
	headline: string;
	statement: string[];
	sentence: Sentence | null;
	sentenceLabel: string | null;
	meme: Meme | null;
};

export type RoomBrief = {
	id: string;
	name: string;
	spiceLevel: Intensity;
};

export type Tally = {
	oppose: number;
	support: number;
};

export type PostVoteBrief = {
	id: string;
	voterId: string;
	voterNickname: string;
	verdict: Verdict;
	reason: string | null;
	createdAt: string;
};

export type PostDetail = {
	id: string;
	postType: PostType;
	amountKrw: number;
	category: Category;
	item: string;
	reason: string | null;
	authorId: string;
	authorNickname: string;
	voteDeadlineAt: string;
	createdAt: string;
	rooms: RoomBrief[];
	juryStatus: Verdict | null;
	tally: Tally;
	votes: PostVoteBrief[];
	myVote: PostVoteBrief | null;
	canVote: boolean;
	eligibleVoterCount: number;
};

export type RoomPostSummary = {
	id: string;
	postType: PostType;
	amountKrw: number;
	category: Category;
	item: string;
	authorId: string;
	authorNickname: string;
	voteDeadlineAt: string;
	createdAt: string;
	juryStatus: Verdict | null;
	tally: Tally;
	voted: boolean;
};

export type CastPostVoteInput = {
	postId: string;
	verdict: Verdict;
	reason: string;
	roomId: string;
};

export type PostVote = {
	id: string;
	postId: string;
	roomId: string;
	verdict: Verdict;
	reason: string;
	createdAt: string;
};

export type PostComment = {
	id: string;
	postId: string;
	roomId: string;
	userId: string;
	nickname: string;
	content: string;
	createdAt: string;
};

export type CreatePostCommentInput = {
	postId: string;
	roomId: string;
	content: string;
};

export function createPostComment({ postId, ...body }: CreatePostCommentInput) {
	return http.post<PostComment>(`/api/posts/${encodeURIComponent(postId)}/comments`, { body });
}

export function submitPost(draft: PostDraft) {
	return http.post<Submission>("/api/post-submissions", { body: draft });
}

export function completeSubmission({ submissionId, ...body }: CompleteSubmissionInput) {
	return http.post<Submission>(`/api/post-submissions/${encodeURIComponent(submissionId)}/complete`, { body });
}

export function castPostVote({ postId, ...body }: CastPostVoteInput) {
	return http.post<PostVote>(`/api/posts/${encodeURIComponent(postId)}/votes`, { body });
}

export function removePost(postId: string) {
	return http.delete<void>(`/api/posts/${encodeURIComponent(postId)}`);
}

function verdictSearch(roomId: string | null) {
	return roomId === null || roomId === "" ? "" : `?room_id=${encodeURIComponent(roomId)}`;
}

export const postQueries = {
	all: () => ["posts"] as const,
	details: () => [...postQueries.all(), "detail"] as const,
	detail: (postId: string) =>
		queryOptions({
			queryKey: [...postQueries.details(), postId] as const,
			queryFn: ({ signal }) => http.get<PostDetail>(`/api/posts/${encodeURIComponent(postId)}`, { signal })
		}),
	feeds: () => [...postQueries.all(), "feed"] as const,
	feed: (roomId: string) =>
		queryOptions({
			queryKey: [...postQueries.feeds(), roomId] as const,
			queryFn: ({ signal }) => http.get<RoomPostSummary[]>(`/api/rooms/${encodeURIComponent(roomId)}/posts`, { signal })
		}),
	commentLists: () => [...postQueries.all(), "comments"] as const,
	comments: (postId: string) =>
		queryOptions({
			queryKey: [...postQueries.commentLists(), postId] as const,
			queryFn: ({ signal }) => http.get<PostComment[]>(`/api/posts/${encodeURIComponent(postId)}/comments`, { signal })
		}),
	verdicts: () => [...postQueries.all(), "verdict"] as const,
	verdict: (postId: string, roomId: string | null = null) =>
		queryOptions({
			queryKey: [...postQueries.verdicts(), postId, roomId] as const,
			queryFn: ({ signal }) =>
				http.get<PostVerdict>(`/api/posts/${encodeURIComponent(postId)}/verdict${verdictSearch(roomId)}`, {
					signal
				})
		}),
	shareCards: () => [...postQueries.all(), "share-card"] as const,
	shareCard: (postId: string) =>
		queryOptions({
			queryKey: [...postQueries.shareCards(), postId] as const,
			queryFn: ({ signal }) => http.get<ShareCard>(`/api/posts/${encodeURIComponent(postId)}/share-card`, { signal })
		})
};
