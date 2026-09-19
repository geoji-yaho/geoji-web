import { useState } from "react";

import { Alert } from "../ui/Alert";
import { Avatar } from "../ui/Avatar";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { TextField } from "../ui/TextField";

const COMMENT_MAX_LENGTH = 200;

export type CommentItem = {
	id: string;
	authorName: string;
	content: string;
	createdAtLabel: string;
	isMine?: boolean;
};

type CommentSheetProps = {
	open: boolean;
	onClose: () => void;
	comments: CommentItem[];
	isLoading: boolean;
	error: string | null;
	onSubmit: (content: string) => Promise<unknown>;
	isSubmitting: boolean;
	submitError: string | null;
	onRemove?: (commentId: string) => Promise<unknown>;
	removingId?: string | null;
	removeError?: string | null;
};

export function CommentSheet({
	open,
	onClose,
	comments,
	isLoading,
	error,
	onSubmit,
	isSubmitting,
	submitError,
	onRemove,
	removingId = null,
	removeError = null
}: CommentSheetProps) {
	const [draft, setDraft] = useState("");
	const trimmed = draft.trim();
	const canSubmit = trimmed.length > 0 && !isSubmitting;

	const submit = async () => {
		if (!canSubmit) {
			return;
		}

		try {
			await onSubmit(trimmed);
			setDraft("");
		} catch {
			return;
		}
	};

	const remove = async (commentId: string) => {
		if (!onRemove || removingId !== null) {
			return;
		}

		try {
			await onRemove(commentId);
		} catch {
			return;
		}
	};

	return (
		<BottomSheet open={open} onClose={onClose} title="댓글">
			{isLoading && (
				<Card role="status" className="p-4 text-chip text-mute">
					댓글을 불러오는 중
				</Card>
			)}
			{error && <Alert>{error}</Alert>}
			{!isLoading && !error && comments.length === 0 && <p className="text-chip text-mute">첫 댓글을 남겨보세요</p>}

			{comments.length > 0 && (
				<ul className="flex max-h-72 flex-col gap-3 overflow-y-auto">
					{comments.map((comment) => (
						<li key={comment.id} className="flex items-start gap-2.5">
							<Avatar name={comment.authorName} size="sm" />
							<div className="flex min-w-0 flex-1 flex-col gap-0.5">
								<div className="flex items-baseline gap-2">
									<span className="text-chip font-extrabold text-ink">{comment.authorName}</span>
									<span className="text-caption text-dim">{comment.createdAtLabel}</span>
								</div>
								<p className="text-chip whitespace-pre-line text-text">{comment.content}</p>
							</div>
							{comment.isMine && onRemove && (
								<button
									type="button"
									aria-label="댓글 삭제"
									onClick={() => void remove(comment.id)}
									disabled={removingId === comment.id}
									className="shrink-0 pressable text-caption text-mute disabled:text-dim"
								>
									{removingId === comment.id ? "삭제 중" : "삭제"}
								</button>
							)}
						</li>
					))}
				</ul>
			)}

			<div className="flex flex-col gap-2">
				<TextField
					label="댓글"
					value={draft}
					onChange={setDraft}
					maxLength={COMMENT_MAX_LENGTH}
					placeholder="한 마디 남기세요"
					multiline
				/>
				{(submitError ?? removeError) && <Alert>{submitError ?? removeError}</Alert>}
				<Button onClick={() => void submit()} disabled={!canSubmit}>
					{isSubmitting ? "등록 중" : "등록"}
				</Button>
			</div>
		</BottomSheet>
	);
}
