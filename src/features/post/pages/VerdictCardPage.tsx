import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router";

import { expenseQueries } from "@/shared/api/expenses";
import { memberQueries } from "@/shared/api/members";
import { sentenceFromDays, trialQueries } from "@/shared/api/trials";
import { BackHeader } from "@/shared/components/BackHeader";
import { VERDICT_LABELS } from "@/shared/domain/verdict";
import { downloadDataUrl, shareContent } from "@/shared/lib/platform";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Reveal } from "@/shared/ui/Reveal";
import { Toast } from "@/shared/ui/Toast";

import { RoomMissingNotice } from "../components/RoomMissingNotice";
import { ShareCardPreview } from "../components/ShareCardPreview";
import { findMember, memberName, memberTier } from "../utils/members";
import { verdictPath } from "../utils/paths";
import { headlineFromVerdictText, TRIAL_MESSAGES, verdictFromTrial } from "../utils/trial";

const IMAGE_FILENAME = "geoji-verdict.png";
const IMAGE_PIXEL_RATIO = 2;
const TOAST_MS = 2500;
const SHARE_TITLE = "떼거지";
const SAVE_FAILED_MESSAGE = "이미지를 만들지 못했습니다";
const COPIED_MESSAGE = "링크를 복사했습니다";
const COPY_FAILED_MESSAGE = "링크를 복사하지 못했습니다";

export function VerdictCardPage() {
	const { postId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("room") ?? "";
	const navigate = useNavigate();
	const enabled = roomId !== "" && postId !== "";

	const trial = useQuery({ ...trialQueries.detail(roomId, postId), enabled });
	const expense = useQuery({ ...expenseQueries.detailInRoom(roomId, postId), enabled });
	const members = useQuery({ ...memberQueries.list(roomId), enabled });

	const cardRef = useRef<HTMLDivElement>(null);
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

	if (!enabled) {
		return <RoomMissingNotice title="공유 카드" />;
	}

	const siteUrl = new URL(import.meta.env.BASE_URL, globalThis.location.origin);
	const siteLabel = `${siteUrl.host}${siteUrl.pathname}`.replace(/\/$/, "");
	const verdictUrl = `${siteUrl.href.replace(/\/$/, "")}${verdictPath(postId, roomId)}`;

	const pending = trial.isPending || expense.isPending || members.isPending;
	const loadError = trial.error ?? expense.error ?? members.error;

	let content: ReactNode = null;
	let actions: ReactNode = null;

	if (pending) {
		content = (
			<Card role="status" className="p-4 text-chip text-mute">
				{TRIAL_MESSAGES.loading}
			</Card>
		);
	} else if (loadError) {
		content = <Alert>{loadError.message}</Alert>;
	} else if (trial.isSuccess && expense.isSuccess && members.isSuccess) {
		const trialData = trial.data;
		const expenseData = expense.data;

		if (!trialData) {
			content = <Alert>{TRIAL_MESSAGES.noTrial}</Alert>;
		} else if (!expenseData) {
			content = <Alert>{TRIAL_MESSAGES.noExpense}</Alert>;
		} else {
			const verdict = verdictFromTrial(trialData);

			if (verdict === null) {
				return <Navigate to={verdictPath(postId, roomId)} replace />;
			}

			const defendant = findMember(members.data, expenseData.userId);
			const headline = headlineFromVerdictText(trialData.verdictText);
			const sentence = verdict === "guilty" ? sentenceFromDays(trialData.sentenceDays) : undefined;

			const saveImage = async () => {
				if (!cardRef.current) {
					return;
				}

				setSaving(true);
				setSaveError(null);

				try {
					const dataUrl = await toPng(cardRef.current, { pixelRatio: IMAGE_PIXEL_RATIO });
					downloadDataUrl(dataUrl, IMAGE_FILENAME);
				} catch {
					setSaveError(SAVE_FAILED_MESSAGE);
				} finally {
					setSaving(false);
				}
			};

			const share = async () => {
				const outcome = await shareContent({
					title: SHARE_TITLE,
					text: headline ?? VERDICT_LABELS[verdict],
					url: verdictUrl
				});

				if (outcome === "copied") {
					setToast(COPIED_MESSAGE);
				} else if (outcome === "failed") {
					setToast(COPY_FAILED_MESSAGE);
				}
			};

			content = (
				<>
					<Reveal>
						<ShareCardPreview
							ref={cardRef}
							verdict={verdict}
							amount={expenseData.amount}
							category={expenseData.category}
							headline={headline}
							sentence={sentence}
							defendantName={memberName(defendant)}
							defendantTier={memberTier(defendant)}
							siteLabel={siteLabel}
						/>
					</Reveal>
					<p className="text-center text-xs text-dim">프로필 이미지는 들어가지 않습니다</p>
				</>
			);

			actions = (
				<div className="flex flex-col gap-3">
					{saveError && <Alert>{saveError}</Alert>}
					<div className="flex gap-2.5">
						<Button variant="secondary" className="flex-1" onClick={() => void saveImage()} disabled={saving}>
							이미지 저장
						</Button>
						<Button className="flex-1 shadow-cta" onClick={() => void share()}>
							공유하기
						</Button>
					</div>
				</div>
			);
		}
	}

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title="공유 카드" onBack={() => void navigate(-1)} />

			<div className="flex flex-1 flex-col justify-center gap-4.5">{content}</div>

			{actions}

			{toast && (
				<div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-5">
					<Toast>{toast}</Toast>
				</div>
			)}
		</div>
	);
}
