import { useAnimate, useReducedMotionConfig } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { ExecutionCard } from "@/shared/components/ExecutionCard";
import { TierBadge } from "@/shared/components/TierBadge";
import { cn } from "@/shared/lib/cn";
import { playStampSound, primeStampSound } from "@/shared/lib/stamp-sound";
import { InfoTable } from "@/shared/ui/InfoTable";
import { Reveal } from "@/shared/ui/Reveal";
import { StickyCta } from "@/shared/ui/StickyCta";
import { formatAmount } from "@/shared/utils/format";

import { JudgeSentenceCard } from "../components/JudgeSentenceCard";
import { JurorTallyCard } from "../components/JurorTallyCard";
import { PendingStampBlock } from "../components/PendingStampBlock";
import { SoundToggle } from "../components/SoundToggle";
import { VerdictHeadlineBlock } from "../components/VerdictHeadlineBlock";

const SAMPLE_POST_ID = "24";

const SAMPLE_CASE = {
	postType: "spent",
	category: "배달",
	amount: 24000,
	plea: "야근하고 집에 왔는데 밥이 없었어요",
	occurredAt: "9월 2일 19:42",
	defendant: "지민",
	defendantTier: "hardcore",
	intensity: "spicy",
	verdict: "guilty",
	headline: "네 이놈!",
	sentence: "life",
	tally: { oppose: 3, support: 1 },
	ruleNote: "한 달에 배달음식 1번",
	execution: { status: "active", daysLeft: 2, totalDays: 3 }
} as const;

const SAMPLE_PENDING_CAPTION = "배심원 4명의 표가 모였습니다…";
const SAMPLE_STREAMING_SENTENCE = "밥이 없었다는 건 변론이 아니라 자백입니다. 라면 한 봉지 900원이";
const SAMPLE_JUDGE_SENTENCE =
	"밥이 없었다는 건 변론이 아니라 자백입니다. 배심원 만장일치에 가까운 유죄, 무기징역 3일을 선고합니다.";
const SHAKE_X = [0, -5, 5, -3, 0];
const SHAKE_DURATION = 0.24;
const LAND_VIBRATION_MS = 35;

export function VerdictPage() {
	const { postId = SAMPLE_POST_ID } = useParams();
	const navigate = useNavigate();
	const [stamped, setStamped] = useState(false);
	const [soundOn, setSoundOn] = useState(true);
	const [scope, animate] = useAnimate();
	const reducedMotion = useReducedMotionConfig();

	const handleLand = () => {
		if (soundOn) {
			playStampSound();
		}

		navigator.vibrate?.(LAND_VIBRATION_MS);

		if (!reducedMotion) {
			void animate(scope.current, { x: SHAKE_X }, { duration: SHAKE_DURATION, ease: "easeOut" });
		}
	};

	const caseRows = [
		{ label: "지출", value: `${SAMPLE_CASE.category}, ${formatAmount(SAMPLE_CASE.amount)}원`, strong: true },
		{ label: "사유", value: SAMPLE_CASE.plea },
		...(stamped ? [] : [{ label: "일시", value: SAMPLE_CASE.occurredAt }]),
		{
			label: "피고인",
			value: (
				<>
					{SAMPLE_CASE.defendant} <TierBadge tier={SAMPLE_CASE.defendantTier} />
				</>
			),
			strong: true
		}
	];

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="판결" onBack={() => navigate(-1)}>
					<SoundToggle checked={soundOn} onChange={setSoundOn} />
				</BackHeader>
			</div>

			<div ref={scope} className={cn("flex flex-col px-5 pt-1.5 pb-10", stamped ? "gap-3" : "gap-3.5")}>
				{stamped ? (
					<VerdictHeadlineBlock
						verdict={SAMPLE_CASE.verdict}
						headline={SAMPLE_CASE.headline}
						sentence={SAMPLE_CASE.sentence}
						onUnstamp={() => setStamped(false)}
						onLand={handleLand}
					/>
				) : (
					<PendingStampBlock
						verdict={SAMPLE_CASE.verdict}
						caption={SAMPLE_PENDING_CAPTION}
						onStamp={() => {
							if (soundOn) {
								primeStampSound();
							}

							setStamped(true);
						}}
					/>
				)}

				<InfoTable rows={caseRows} />

				<JurorTallyCard postType={SAMPLE_CASE.postType} tally={SAMPLE_CASE.tally} ruleNote={SAMPLE_CASE.ruleNote} />

				<JudgeSentenceCard
					intensity={SAMPLE_CASE.intensity}
					message={stamped ? SAMPLE_JUDGE_SENTENCE : SAMPLE_STREAMING_SENTENCE}
					locked={!stamped}
				/>

				{stamped && (
					<Reveal>
						<ExecutionCard execution={SAMPLE_CASE.execution} />
					</Reveal>
				)}
			</div>

			{stamped && (
				<StickyCta
					label="판결 카드 공유하기"
					onClick={() => navigate(`/posts/${postId}/card`)}
					className="sticky-cta"
				/>
			)}
		</div>
	);
}
