import { cn } from "../lib/cn";
import type { Reaction } from "../types/post";

type ReactionRowProps = {
	reactions: Reaction[];
	commentCount: number;
	onComments?: () => void;
	className?: string;
};

export function ReactionRow({ reactions, commentCount, onComments, className }: ReactionRowProps) {
	return (
		<div className={cn("flex items-center gap-1.5 text-xs text-mute", className)}>
			{reactions.map((reaction) => (
				<span key={reaction.emoji}>
					{reaction.emoji} {reaction.count}
				</span>
			))}
			{reactions.length > 0 && <span aria-hidden="true">·</span>}
			<button type="button" onClick={onComments} className="font-bold text-mute">
				댓글 {commentCount}
			</button>
		</div>
	);
}
