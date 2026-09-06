export type PostType = "spent" | "considering";

export const POST_TYPE_LABELS: Record<PostType, string> = {
	spent: "돈 썼어요",
	considering: "살까 말까"
};

export type Reaction = {
	emoji: string;
	count: number;
};

export type ImageSource = {
	src: string;
	alt: string;
};
