import { POST_TYPE_LABELS, type PostType } from "../domain/post";
import { Tag, type TagTone } from "../ui/Tag";

const POST_TYPE_TONES: Record<PostType, TagTone> = {
	spent: "red",
	considering: "inkOutline"
};

type PostTypeTagProps = {
	postType: PostType;
	className?: string;
};

export function PostTypeTag({ postType, className }: PostTypeTagProps) {
	return (
		<Tag tone={POST_TYPE_TONES[postType]} className={className}>
			{POST_TYPE_LABELS[postType]}
		</Tag>
	);
}
