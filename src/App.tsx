import { type ReactNode, useState } from "react";

import { AmountField } from "./shared/components/AmountField";
import { AttachmentField } from "./shared/components/AttachmentField";
import { BottomSheet } from "./shared/components/BottomSheet";
import { EmptyState } from "./shared/components/EmptyState";
import { ExpenseCard } from "./shared/components/ExpenseCard";
import { Fab, StickyCta } from "./shared/components/Fab";
import { BackHeader, HomeHeader, RoomHeader } from "./shared/components/Header";
import { NoSpendBanner } from "./shared/components/NoSpendBanner";
import { ProfileSummaryCard } from "./shared/components/ProfileSummaryCard";
import { MyRankRow, RankingPodium, RankingRow } from "./shared/components/RankingBoard";
import { RoomCard } from "./shared/components/RoomCard";
import { TabSegment } from "./shared/components/TabSegment";
import { TextField } from "./shared/components/TextField";
import { VerdictTag } from "./shared/components/VerdictBadge";
import { VerdictPanel } from "./shared/components/VerdictPanel";
import type { Verdict } from "./shared/types";

const VERDICTS: Verdict[] = ["승인", "기각", "칭송"];

const FEED_TABS = ["피드", "랭킹", "방 정보"] as const;

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-3">
			<div>
				<h2 className="text-sm font-black text-ink">{title}</h2>
				<p className="text-xs leading-relaxed text-muted">{description}</p>
			</div>
			{children}
		</section>
	);
}

export default function App() {
	const [tab, setTab] = useState<(typeof FEED_TABS)[number]>("피드");
	const [amount, setAmount] = useState("24,000");
	const [roomName, setRoomName] = useState("야근족 거지방");
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<div className="min-h-dvh bg-surface">
			<main className="mx-auto flex max-w-md flex-col gap-10 px-5 py-10 pb-28">
				<header className="text-center">
					<p className="text-sm font-bold text-terracotta">무지출 챌린지 · 공통 컴포넌트</p>
					<h1 className="mt-2 text-3xl font-black text-ink">거지방 AI 총무</h1>
				</header>

				<Section title="01 헤더 3종" description="뒤로가기 + 제목 / 방 헤더(아바타 스택 + 더보기) / 홈(로고 + 프로필)">
					<div className="flex flex-col gap-3">
						<BackHeader title="지출 등록" secondaryText="보조 텍스트" />
						<RoomHeader roomName="야근족 거지방" memberLabels={["지", "현", "민", "소", "정"]} />
						<HomeHeader wordmark="떼거지" profileLabel="소" />
					</div>
				</Section>

				<Section title="02 탭 세그먼트" description="카드 위 pill. 선택은 잉크 배경 + 카드색 글자.">
					<TabSegment tabs={FEED_TABS} value={tab} onChange={setTab} />
				</Section>

				<Section title="03 입력" description="금액은 44/900 + 테라코타 언더라인. 텍스트 필드는 카드 16px 라운드.">
					<div className="flex flex-col gap-4">
						<AmountField label="얼마 썼어요?" value={amount} onChange={setAmount} />
						<TextField label="방 이름" value={roomName} onChange={setRoomName} maxLength={20} required />
						<AttachmentField label="사진 추가" onSelect={() => {}} />
					</div>
				</Section>

				<Section title="04 지출 카드 3상태" description="투표 중 · 판결 확정 · 무지출 신고.">
					<div className="flex gap-2">
						{VERDICTS.map((verdict) => (
							<VerdictTag key={verdict} verdict={verdict} />
						))}
					</div>
					<div className="flex flex-col gap-3">
						<ExpenseCard
							state="voting"
							name="지민"
							tier="상거지"
							timeAgo="3시간 전"
							statusLabel="돈 썼어요"
							category="배달"
							amount={24000}
							memo="야근하고 집에 왔는데 밥이 없었어요"
							deadlineLabel="마감까지 8시간"
							voteProgressLabel="4/5 투표"
							guiltyCount={3}
							notGuiltyCount={1}
							reactions={[
								{ emoji: "😭", count: 2 },
								{ emoji: "😂", count: 5 }
							]}
							commentCount={4}
						/>
						<ExpenseCard
							state="judged"
							name="현우"
							tier="꽃거지"
							timeAgo="어제"
							statusLabel="살까 말까"
							category="쇼핑/패션"
							amount={359000}
							memo="에어팟 노캔, 통근이 힘들어요"
							verdictLabel="기각"
							agreeCount={1}
							disagreeCount={4}
							judgeQuote="통근 힘들면 이어폰 말고 일찍 자세요."
						/>
						<NoSpendBanner name="소윤" amount={0} clapCount={3} />
					</div>
				</Section>

				<Section title="05 판결 블록" description="헤드라인 + 도장 → 배심원 평결 → AI 판사 선고 → 형 집행 게이지.">
					<VerdictPanel
						headline="네 이놈!"
						sentenceLabel="형량"
						sentenceValue="무기징역 3일 무지출"
						stampLabel="유죄"
						juryGuilty={3}
						juryNotGuilty={1}
						juryNote="참고 규칙 · 한 달에 배달음식 1번"
						intensityLabel="매운맛"
						judgeMessage="밥이 없었다는 건 변론이 아니라 자백입니다. 배심원 만장일치에 가까운 유죄, 무기징역 3일을 선고합니다."
						executionStatusLabel="형 집행 중 · D-2"
						executionRemainingLabel="남은 무지출 2일"
						executionValue={1}
						executionMax={3}
					/>
				</Section>

				<Section title="06 랭킹" description="포디움 3열(1위 가운데, 나는 잉크 카드) + 리스트 + 내 순위 고정 바.">
					<div className="flex flex-col gap-3">
						<RankingPodium
							entries={[
								{ place: 2, name: "현우", value: "5일" },
								{ place: 1, name: "소윤", value: "6일", isMe: true },
								{ place: 3, name: "민재", value: "3일" }
							]}
						/>
						<RankingRow rank={4} name="지민" tier="상거지" value="1일" />
						<RankingRow rank={1} name="지민" tier="상거지" value="48점" highlightRank />
						<MyRankRow name="소윤" valueLabel="무지출 1위 · 잔소리 3위" />
					</div>
				</Section>

				<Section title="07 방 카드 · 프로필 요약" description="방 카드는 이름 + 강도 태그 + 미읽음 배지 + 최근 활동.">
					<div className="flex flex-col gap-3">
						<RoomCard
							roomName="야근족 거지방"
							intensityLabel="매운맛"
							unreadCount={3}
							memberCount={5}
							recentActivity="지민 · 배달 24,000원 — 투표 중"
						/>
						<ProfileSummaryCard
							name="소윤"
							tier="꽃거지"
							scoreLabel="거지력"
							scoreValue={71}
							nextTierLabel="거지왕까지 14점"
							monthLabel="9월 지출"
							spent={412000}
							budget={500000}
							noSpendDaysLabel="6일"
							sentenceStatusLabel="수감 중"
							sentenceValue={1}
							sentenceMax={3}
						/>
					</div>
				</Section>

				<Section title="08 바텀시트" description="화면 배경색 시트, 24px 상단 라운드, 핸들 40×4.">
					<button
						type="button"
						onClick={() => setSheetOpen(true)}
						className="rounded-2xl border border-line py-3 text-sm font-bold text-ink"
					>
						배심원 모집 시트 열기
					</button>
					<BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
						<p className="text-lg font-black text-ink">배심원을 모으세요</p>
						<p className="mt-1 text-sm text-muted">링크 7일 유효 · 최대 20명</p>
						<div className="mt-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-3">
							<span className="flex-1 truncate text-sm text-muted">ttegeoji.app/i/K7X2M</span>
							<button type="button" className="text-sm font-bold text-ink">
								복사
							</button>
						</div>
						<button type="button" className="mt-3 w-full rounded-full bg-gold py-3 text-sm font-bold text-ink">
							카카오톡으로 공유
						</button>
					</BottomSheet>
				</Section>

				<Section title="09 FAB · 고정 CTA" description="FAB는 52px pill 우하단, 고정 CTA는 좌우 20px 여백 하단 44px.">
					<div className="flex gap-3">
						<Fab label="+ 지출 등록" fixed={false} />
						<StickyCta label="+ 거지방 만들기" fixed={false} />
					</div>
				</Section>

				<Section title="10 빈 상태" description="로고 56 + 제목 15/900 + 설명 2줄, 카드 안 가운데 정렬.">
					<EmptyState
						title="아직 거지방이 없어요"
						description={"친구들과 거지방을 만들어\n서로의 지출을 재판해보세요"}
					/>
				</Section>
			</main>
		</div>
	);
}
