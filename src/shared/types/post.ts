/** 게시물 타입. 지출 뒤에 올리면 돈 썼어요, 지출 전에 물으면 살까 말까 */
export type PostType = "spent" | "considering";

export const POST_TYPE_LABELS: Record<PostType, string> = {
	spent: "돈 썼어요",
	considering: "살까 말까"
};

export type Reaction = {
	emoji: string;
	count: number;
};

/** 화면에 넣는 이미지. 증거 사진과 판결 짤 */
export type ImageSource = {
	src: string;
	alt: string;
};
