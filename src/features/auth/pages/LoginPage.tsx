import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

import { LogoIcon } from "@/shared/components/LogoIcon";
import { Button } from "@/shared/ui/Button";
import { Reveal } from "@/shared/ui/Reveal";
import { Toast } from "@/shared/ui/Toast";

const LOGIN_POINTS = ["피고 = 나", "배심원 = 친구", "판사 = AI"];

export function LoginPage() {
	const navigate = useNavigate();

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

			<Reveal index={5} className="mb-8.5">
				<Toast>로그인이 취소되었습니다</Toast>
			</Reveal>

			<Reveal index={6} className="flex flex-col gap-3.5">
				<Button variant="kakao" className="gap-2" onClick={() => navigate("/onboarding/budget")}>
					<MessageCircle className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
					카카오로 시작하기
				</Button>
				<p className="text-center text-caption text-dim">
					<button type="button" className="underline">
						이용약관
					</button>
					&nbsp;
					<button type="button" className="underline">
						개인정보처리방침
					</button>
				</p>
			</Reveal>
		</div>
	);
}
