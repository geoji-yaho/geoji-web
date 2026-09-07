import type { Reaction } from "../domain/post";
import { cn } from "../lib/cn";

type ReactionRowProps = {
	reactions: Reaction[];
	commentCount: number;
	onComments?: () => void;
	className?: string;
};

export function ReactionRow({ reactions, commentCount, onComments, className }: ReactionRowProps) {
	return (
		<div className={cn("flex items-center gap-3 text-xs text-mute", className)}>
			<ul className="flex items-center gap-3">
				{reactions.map((reaction) => (
					<li key={reaction.emoji}>
						{reaction.emoji}&nbsp;{reaction.count}
					</li>
				))}
			</ul>
			<button type="button" onClick={onComments} className="pressable font-bold text-mute">
				댓글 {commentCount}
			</button>
		</div>
	);
}
