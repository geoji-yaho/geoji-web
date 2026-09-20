import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { findMember, memberQueries, memberTier } from "@/shared/api/members";
import { postQueries } from "@/shared/api/posts";
import { BackHeader } from "@/shared/components/BackHeader";
import { verdictPath } from "@/shared/constants/routes";
import { VERDICT_LABELS } from "@/shared/domain/verdict";
import { getBasename, toAbsoluteUrl } from "@/shared/lib/base-path";
import { buildFontEmbedCss } from "@/shared/lib/buildFontEmbedCss";
import { saveFile, shareContent, toPngFile } from "@/shared/lib/platform";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { Toast } from "@/shared/ui/Toast";

import { RoomMissingNotice } from "../components/RoomMissingNotice";
import { ShareCardPreview } from "../components/ShareCardPreview";

const IMAGE_FILENAME = "geoji-verdict.png";
const IMAGE_PIXEL_RATIO = 2;
const PRELOAD_DELAY_MS = 700;
const TRANSPARENT_PIXEL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const TOAST_MS = 2500;
const SHARE_TITLE = "떼거지";
const LOADING_MESSAGE = "판결 카드를 불러오는 중";
const SAVE_FAILED_MESSAGE = "이미지를 만들지 못했습니다";
const COPIED_MESSAGE = "링크를 복사했습니다";
const COPY_FAILED_MESSAGE = "링크를 복사하지 못했습니다";
const SAVED_MESSAGE = "이미지를 저장했습니다";
const LINK_ONLY_MESSAGE = "카드 이미지를 준비하지 못해 링크만 보냈습니다";
export function VerdictCardPage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room") ?? "";
	const navigate = useNavigate();
	const enabled = roomId !== "" && postId !== "";

	const card = useQuery({ ...postQueries.shareCard(postId, roomId), enabled });
	const post = useQuery({ ...postQueries.detail(postId, roomId), enabled });
	const members = useQuery({ ...memberQueries.list(roomId), enabled });

	const pending = card.isPending || post.isPending || members.isPending;
	const cardReady = !pending && card.data !== undefined && post.data !== undefined;

	const cardRef = useRef<HTMLDivElement>(null);
	const cardFileRef = useRef<File | null>(null);
	const cardDataUrlRef = useRef<string | null>(null);
	const fontEmbedCssRef = useRef<Promise<string> | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		if (toast === null) {
			return;
		}

		const timer = setTimeout(() => setToast(null), TOAST_MS);
		return () => clearTimeout(timer);
	}, [toast]);

	const renderCardPng = useCallback(async () => {
		const node = cardRef.current;

		if (node === null) {
			return null;
		}

		fontEmbedCssRef.current ??= buildFontEmbedCss(node);
		const dataUrl = await toPng(node, {
			pixelRatio: IMAGE_PIXEL_RATIO,
			cacheBust: true,
			imagePlaceholder: TRANSPARENT_PIXEL,
			fontEmbedCSS: await fontEmbedCssRef.current
		});
		cardDataUrlRef.current = dataUrl;

		return dataUrl;
	}, []);

	const renderCardFile = useCallback(async () => {
		const dataUrl = cardDataUrlRef.current ?? (await renderCardPng());

		if (dataUrl === null) {
			return null;
		}

		const file = await toPngFile(dataUrl, IMAGE_FILENAME);
		cardFileRef.current = file;

		return file;
	}, [renderCardPng]);

	useEffect(() => {
		cardFileRef.current = null;
		cardDataUrlRef.current = null;
	}, [postId, roomId]);

	useEffect(() => {
		if (!cardReady || cardFileRef.current !== null) {
			return;
		}

		const timer = setTimeout(() => {
			void renderCardFile().catch(() => undefined);
		}, PRELOAD_DELAY_MS);

		return () => clearTimeout(timer);
	}, [cardReady, postId, renderCardFile]);

	if (!enabled) {
		return <RoomMissingNotice title="공유 카드" />;
	}

	const siteLabel = `${globalThis.location.host}${getBasename()}`;
	const verdictUrl = toAbsoluteUrl(verdictPath(postId, roomId));

	const loadError = card.error ?? post.error ?? members.error;

	let content: ReactNode = null;
	let actions: ReactNode = null;

	if (pending) {
		content = (
			<Card role="status" className="p-4 text-chip text-mute">
				{LOADING_MESSAGE}
			</Card>
		);
	} else if (card.data && post.data) {
		const shareCard = card.data;
		const detail = post.data;
		const defendant = findMember(members.data, detail.authorId);

		const saveImage = async () => {
			if (!cardRef.current) {
				return;
			}

			setSaving(true);
			setSaveError(null);

			try {
				const file = cardFileRef.current ?? (await renderCardFile());

				if (file === null) {
					setSaveError(SAVE_FAILED_MESSAGE);
				} else if ((await saveFile(file)) === "saved") {
					setToast(SAVED_MESSAGE);
				}
			} catch {
				setSaveError(SAVE_FAILED_MESSAGE);
			} finally {
				setSaving(false);
			}
		};

		const share = async () => {
			const cardFile = cardFileRef.current ?? (await renderCardFile().catch(() => null));
			const outcome = await shareContent({
				title: SHARE_TITLE,
				text: shareCard.headline || VERDICT_LABELS[shareCard.juryStatus],
				url: verdictUrl,
				files: cardFile === null ? undefined : [cardFile]
			});

			if (outcome === "copied") {
				setToast(COPIED_MESSAGE);
			} else if (outcome === "failed") {
				setToast(COPY_FAILED_MESSAGE);
			} else if (outcome === "shared" && cardFile === null) {
				setToast(LINK_ONLY_MESSAGE);
			}
		};

		content = (
			<>
				<Reveal>
					<ShareCardPreview
						ref={cardRef}
						verdict={shareCard.juryStatus}
						amount={detail.amountKrw}
						category={detail.category}
						headline={shareCard.headline}
						statement={shareCard.statement}
						sentence={shareCard.sentence ?? undefined}
						sentenceLabel={shareCard.sentenceLabel}
						defendantName={detail.authorNickname}
						defendantTier={memberTier(defendant)}
						siteLabel={siteLabel}
						meme={shareCard.meme}
					/>
				</Reveal>
				<p className="text-center text-xs text-dim">프로필 이미지는 들어가지 않습니다</p>
			</>
		);

		actions = (
			<div className="flex flex-col gap-3">
				{saveError && <Alert>{saveError}</Alert>}
				<div className="flex gap-2.5">
					<Button
						variant="secondary"
						className="flex-1"
						onClick={() => void saveImage()}
						disabled={saving}
						aria-busy={saving}
					>
						{saving ? "저장 중" : "이미지 저장"}
					</Button>
					<Button className="flex-1 shadow-cta" onClick={() => void share()}>
						공유하기
					</Button>
				</div>
			</div>
		);
	} else if (loadError) {
		const isSentencePending = card.isError && card.error.kind === "notFound";

		content = isSentencePending ? (
			<Button variant="outline" onClick={() => void navigate(verdictPath(postId, roomId), { replace: true })}>
				판결로 돌아가기
			</Button>
		) : (
			<Button variant="outline" onClick={() => void navigate("/", { replace: true })}>
				홈으로 가기
			</Button>
		);
	}

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title="공유 카드" onBack={() => void navigate(-1)} />

			<div className="flex flex-1 flex-col justify-center gap-4.5">
				{!pending && loadError && <Alert>{loadError.message}</Alert>}
				{content}
			</div>

			{actions}

			{toast && (
				<div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-5">
					<Toast>{toast}</Toast>
				</div>
			)}
		</div>
	);
}
