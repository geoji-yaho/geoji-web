import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { LogoIcon } from "@/shared/components/LogoIcon";
import { useSession } from "@/shared/hooks/useSession";
import { takePathAfterLogin } from "@/shared/lib/path-after-login";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";
import { Reveal } from "@/shared/ui/Reveal";
import { Toast } from "@/shared/ui/Toast";

import { useKakaoLogin } from "../hooks/useKakaoLogin";
import { oauthError } from "../utils/oauthError";

const LOGIN_POINTS = ["피고 = 나", "배심원 = 친구", "판사 = AI"];
const PRIVACY_LABEL = "개인정보처리방침";
const PRIVACY_HREF = "https://github.com/geoji-yaho/geoji-web/blob/main/docs/release/PRIVACY.md";
const CANCELLED_MESSAGE = "로그인이 취소되었습니다";
const FAILED_MESSAGE = "로그인에 실패했습니다";

function formatFailureMessage(description: string | null) {
	return description === null ? FAILED_MESSAGE : `${FAILED_MESSAGE}. ${description}`;
}

function readNotice(state: unknown) {
	if (typeof state !== "object" || state === null || !("notice" in state)) {
		return null;
	}

	const { notice } = state;
	return typeof notice === "string" && notice !== "" ? notice : null;
}

export function LoginPage() {
	const navigate = useNavigate();
	const { pathname, state } = useLocation();
	const { session, isLoading } = useSession();
	const [notice] = useState(() => readNotice(state));
	const login = useKakaoLogin();
	const [callbackError] = useState(() => oauthError);
	const hasNavigatedRef = useRef(false);
	const sawSignedOutRef = useRef(notice === null);

	useEffect(() => {
		if (notice === null) {
			return;
		}

		void navigate(pathname, { replace: true, state: null });
	}, [notice, pathname, navigate]);

	useEffect(() => {
		if (session === null) {
			if (!isLoading) {
				sawSignedOutRef.current = true;
			}

			return;
		}

		if (hasNavigatedRef.current || !sawSignedOutRef.current) {
			return;
		}

		hasNavigatedRef.current = true;

		void navigate(takePathAfterLogin() ?? "/", { replace: true });
	}, [session, isLoading, navigate]);

	const isCancelled = callbackError?.isCancelled === true;
	let failed: string | null = null;

	if (callbackError !== null && !callbackError.isCancelled) {
		failed = formatFailureMessage(callbackError.description);
	} else if (login.isError) {
		failed = formatFailureMessage(login.error.message);
	}

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<div className="flex flex-1 flex-col items-center justify-center gap-5">
				<Reveal>
					<LogoIcon className="size-30" />
				</Reveal>
				<Reveal index={1} className="flex flex-col items-center gap-1.5">
					<h1 className="text-display text-ink">떼거지</h1>
					<p className="text-sm font-bold text-mute">친구들이 내 지출을 재판합니다</p>
				</Reveal>
				<Reveal index={2} className="flex gap-2">
					{LOGIN_POINTS.map((point) => (
						<span
							key={point}
							className="rounded-full bg-card px-2.75 py-1.25 text-tag font-bold whitespace-nowrap text-mute"
						>
							{point}
						</span>
					))}
				</Reveal>
			</div>

			{notice !== null && (
				<Reveal index={5} className="mb-8.5">
					<Alert tone="fill">{notice}</Alert>
				</Reveal>
			)}

			{isCancelled && (
				<Reveal index={5} className="mb-8.5">
					<Toast>{CANCELLED_MESSAGE}</Toast>
				</Reveal>
			)}

			{failed !== null && (
				<Reveal index={5} className="mb-8.5">
					<Alert>{failed}</Alert>
				</Reveal>
			)}

			<Reveal index={6} className="flex flex-col gap-3.5">
				<Button variant="kakao" className="gap-2" disabled={login.isPending} onClick={() => login.mutate()}>
					<MessageCircle className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
					카카오로 시작하기
				</Button>
				<p className="text-center text-caption text-dim">
					<a
						href={PRIVACY_HREF}
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-11 pressable items-center px-3 underline"
					>
						{PRIVACY_LABEL}
					</a>
				</p>
			</Reveal>
		</div>
	);
}
