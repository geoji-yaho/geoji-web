import { type ReactNode, useState } from "react";

import { Alert } from "../shared/components/Alert";
import { AmountField } from "../shared/components/AmountField";
import { AttachmentField } from "../shared/components/AttachmentField";
import { Avatar } from "../shared/components/Avatar";
import { AvatarStack } from "../shared/components/AvatarStack";
import { BottomSheet } from "../shared/components/BottomSheet";
import { Button } from "../shared/components/Button";
import { Chip } from "../shared/components/Chip";
import { CountBadge } from "../shared/components/CountBadge";
import { EmptyState } from "../shared/components/EmptyState";
import { ExpenseCard } from "../shared/components/ExpenseCard";
import { Fab, StickyCta } from "../shared/components/Fab";
import { BackHeader, HomeHeader, RoomHeader } from "../shared/components/Header";
import { Logo, LogoIcon } from "../shared/components/Logo";
import { MemeThumbnail } from "../shared/components/MemeThumbnail";
import { NoSpendCard } from "../shared/components/NoSpendCard";
import { ProfileSummaryCard } from "../shared/components/ProfileSummaryCard";
import { MeterBar, SplitBar } from "../shared/components/ProgressBar";
import { MyRankRow, RankingPodium, RankingRow } from "../shared/components/RankingBoard";
import { ReactionRow } from "../shared/components/ReactionRow";
import { RoomCard } from "../shared/components/RoomCard";
import { TabSegment } from "../shared/components/TabSegment";
import { IntensityTag, PostTypeTag } from "../shared/components/Tag";
import { TextField } from "../shared/components/TextField";
import { TierBadge } from "../shared/components/TierBadge";
import { Toast } from "../shared/components/Toast";
import { VerdictPanel } from "../shared/components/VerdictPanel";
import { VerdictStamp } from "../shared/components/VerdictStamp";
import { POST_TYPE_LABELS, type PostType, type Reaction } from "../shared/types/post";
import { type Intensity, INTENSITY_LABELS } from "../shared/types/room";
import { type Tier, TIER_LABELS } from "../shared/types/tier";
import { type Verdict, VERDICT_LABELS } from "../shared/types/verdict";

const VERDICTS = Object.keys(VERDICT_LABELS) as Verdict[];
const TIERS = Object.keys(TIER_LABELS) as Tier[];
const INTENSITIES = Object.keys(INTENSITY_LABELS) as Intensity[];
const POST_TYPES = Object.keys(POST_TYPE_LABELS) as PostType[];
const STAMP_SIZES = ["sm", "md", "lg"] as const;
const AVATAR_SIZES = ["xl", "lg", "md", "sm", "xs"] as const;

const FEED_TABS = ["피드", "랭킹", "방 정보"] as const;
const CATEGORY_CHIPS = ["배달", "카페", "쇼핑/패션", "택시"] as const;
const DEADLINE_CHIPS = ["30분", "1시간", "3시간", "6시간", "12시간"] as const;
const MEMBERS = ["지민", "현우", "민재", "소윤", "정우"];

const REACTIONS: Reaction[] = [
	{ emoji: "😭", count: 2 },
	{ emoji: "😂", count: 5 }
];

const CHICKEN = {
	name: "지민",
	tier: "hardcore",
	postType: "spent",
	category: "배달",
	title: "치킨 배달",
	amount: 24000,
	memo: "야근하고 집에 왔는데 밥이 없었어요",
	tally: { oppose: 3, support: 1 }
} as const;

const SAMPLE_FILE = new File([], "IMG_2041.jpg");

const SAMPLE_IMAGE = {
	src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='%23cfa96e'/></svg>",
	alt: "증거 사진"
};

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-3">
			<div>
				<h2 className="text-xs font-black text-ink">{title}</h2>
				<p className="text-caption text-mute">{description}</p>
			</div>
			{children}
		</section>
	);
}

function Row({ children }: { children: ReactNode }) {
	return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

function ChipDemo() {
	const [category, setCategory] = useState<(typeof CATEGORY_CHIPS)[number]>("배달");
	const [deadline, setDeadline] = useState<(typeof DEADLINE_CHIPS)[number]>("12시간");

	return (
		<>
			<Row>
				{CATEGORY_CHIPS.map((chip) => (
					<Chip key={chip} selected={chip === category} onClick={() => setCategory(chip)}>
						{chip}
					</Chip>
				))}
			</Row>
			<Row>
				{DEADLINE_CHIPS.map((chip) => (
					<Chip key={chip} selected={chip === deadline} tone="red" onClick={() => setDeadline(chip)}>
						{chip}
					</Chip>
				))}
			</Row>
		</>
	);
}

function InputDemo() {
	const [amount, setAmount] = useState("24,000");
	const [roomName, setRoomName] = useState("야근족 거지방");
	const [reason, setReason] = useState("");

	return (
		<>
			<AmountField label="얼마 썼어요?" value={amount} onChange={setAmount} />
			<TextField label="방 이름" value={roomName} onChange={setRoomName} maxLength={20} required />
			<TextField
				label="변론"
				hint="선택"
				value={reason}
				onChange={setReason}
				maxLength={200}
				multiline
				placeholder="왜 썼는지 변론하세요"
			/>
			<div className="flex gap-2">
				<AttachmentField label="증거 사진 1장" onSelect={() => {}} className="flex-1" />
				<AttachmentField label="증거 사진 1장" file={SAMPLE_FILE} onSelect={() => {}} className="flex-1" />
			</div>
		</>
	);
}

function TabDemo() {
	const [tab, setTab] = useState<(typeof FEED_TABS)[number]>("피드");

	return <TabSegment tabs={FEED_TABS} value={tab} onChange={setTab} />;
}

function SheetDemo() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				초대 시트 열기
			</Button>
			<BottomSheet open={open} onClose={() => setOpen(false)}>
				<p className="text-title text-ink">배심원을 모으세요</p>
				<p className="text-chip text-mute">링크 7일 유효 · 최대 20명</p>
				<div className="flex items-center gap-2">
					<span className="flex-1 truncate rounded-2xl bg-fill px-3.5 py-3 text-control text-mute">초대 링크</span>
					<button type="button" className="rounded-full bg-card px-4.5 py-3 text-control font-extrabold text-ink">
						복사
					</button>
				</div>
				<Button variant="kakao">카카오톡으로 공유</Button>
			</BottomSheet>
		</>
	);
}

export default function App() {
	return (
		<div className="min-h-dvh bg-screen">
			<main className="mx-auto flex max-w-md flex-col gap-10 px-5 py-10 pb-28">
				<header className="flex flex-col items-start gap-2">
					<Logo size="display" />
					<p className="text-control text-mute">공통 컴포넌트 카탈로그. 파운데이션 원자와 조립형 10종</p>
				</header>

				<Section
					title="01 로고"
					description="아이콘 30, 44, 56, 120. 가로형은 헤더(22)와 디스플레이(38). 테라코타 바탕은 light."
				>
					<Row>
						<LogoIcon className="size-7.5" />
						<LogoIcon />
						<LogoIcon className="size-14" />
						<LogoIcon className="size-30" />
					</Row>
					<Row>
						<Logo />
						<Logo size="display" />
					</Row>
					<div className="rounded-card bg-red p-4">
						<Logo tone="light" />
					</div>
				</Section>

				<Section
					title="02 버튼"
					description="전부 pill. 주요, 보조, 외곽선, 위험 외곽선, 잉크(투표하기), 비활성, 카카오."
				>
					<Button>지출 등록하기</Button>
					<Button variant="secondary">링크 복사</Button>
					<Button variant="outline">방 나가기</Button>
					<Button variant="danger">방 삭제</Button>
					<Button variant="ink">투표하기</Button>
					<Button disabled>이미 변경했어요</Button>
					<Button variant="kakao">카카오로 시작하기</Button>
				</Section>

				<Section title="03 칩" description="비선택은 fill, 선택은 ink. 마감 시간 칩은 red 외곽선 강조.">
					<ChipDemo />
				</Section>

				<Section title="04 태그" description="잔소리 강도 3종과 게시물 타입 2종. 라운드 6, 11px 900.">
					<Row>
						{INTENSITIES.map((intensity) => (
							<IntensityTag key={intensity} intensity={intensity} />
						))}
					</Row>
					<Row>
						{POST_TYPES.map((postType) => (
							<PostTypeTag key={postType} postType={postType} />
						))}
					</Row>
				</Section>

				<Section title="05 티어 뱃지" description="무일푼, 상거지, 꽃거지, 거지왕. 순서는 미결정.">
					<Row>
						{TIERS.map((tier) => (
							<TierBadge key={tier} tier={tier} />
						))}
					</Row>
				</Section>

				<Section title="06 아바타" description="탠 바탕 원형 60, 42, 36, 28, 22. 스택은 22에 screen 링과 +N.">
					<Row>
						{AVATAR_SIZES.map((size) => (
							<Avatar key={size} name="소윤" size={size} />
						))}
						<AvatarStack names={MEMBERS} />
					</Row>
				</Section>

				<Section
					title="07 판결 도장"
					description="유죄와 기각은 red, 무죄와 동의는 green, 각하는 gray. 크기 54, 64, 96."
				>
					{STAMP_SIZES.map((size) => (
						<div key={size} className="flex flex-wrap items-center gap-4">
							{VERDICTS.map((verdict) => (
								<VerdictStamp key={verdict} verdict={verdict} size={size} />
							))}
						</div>
					))}
				</Section>

				<Section title="08 토스트와 경고" description="토스트는 fill pill에 red 점. 경고는 red/10 바탕에 red 테두리.">
					<Row>
						<Toast>오늘 하루 잘 버텼습니다. 6일째 무지출.</Toast>
					</Row>
					<Alert>현재 무기징역 집행 중입니다. 등록하면 재범으로 기록됩니다.</Alert>
				</Section>

				<Section
					title="09 게이지"
					description="예산은 cta 8px에 경과일 기준선. 형 집행은 red 6px. 집계 바는 red와 green."
				>
					<MeterBar value={412000} max={500000} markerValue={100000} />
					<MeterBar value={1} max={3} tone="red" size="sm" />
					<SplitBar leftValue={3} rightValue={1} />
					<SplitBar leftValue={0} rightValue={0} />
				</Section>

				<Section
					title="10 입력"
					description="금액 44/900에 red 2px 언더라인. 텍스트 필드는 카드 라운드 16, 필수 별표, 글자 수. 첨부는 fill 바탕."
				>
					<InputDemo />
				</Section>

				<Section title="11 탭 세그먼트" description="page 바탕 pill. 선택은 ink 바탕에 card 글자.">
					<TabDemo />
				</Section>

				<Section
					title="12 헤더 3종"
					description="뒤로가기 36 원형 fill과 제목 18/900. 방 헤더는 아바타 스택과 더보기. 홈은 로고와 프로필."
				>
					<BackHeader title="지출 등록" secondaryText="보조 텍스트" />
					<RoomHeader roomName="야근족 거지방" memberNames={MEMBERS} />
					<HomeHeader profileName="소윤" />
				</Section>

				<Section
					title="13 카운트 배지와 리액션 줄"
					description="미읽음 수는 ink 바탕 22 높이. 리액션 줄은 이모지 카운트와 댓글 수."
				>
					<Row>
						<CountBadge count={3} />
						<CountBadge count={12} />
					</Row>
					<ReactionRow reactions={REACTIONS} commentCount={4} />
				</Section>

				<Section
					title="14 FAB와 고정 CTA"
					description="FAB 52 pill 우하단. 고정 CTA 좌우 20 여백 높이 44. 비활성 상태 포함."
				>
					<Fab label="+ 지출 등록" className="self-start" />
					<StickyCta label="+ 거지방 만들기" />
					<StickyCta label="투표 제출" disabled />
				</Section>

				<Section title="15 바텀시트" description="screen 바탕, 상단 라운드 24, 핸들 40 x 4, 딤 45%. 초대 시트 예시.">
					<SheetDemo />
				</Section>

				<Section title="16 빈 상태" description="로고 56과 제목 15/900, 설명 2줄. 카드 안 가운데 정렬.">
					<EmptyState
						title="아직 거지방이 없어요"
						description={"친구들과 거지방을 만들어\n서로의 지출을 재판해보세요"}
					/>
				</Section>

				<Section title="17 짤 자리" description="정사각형. 피드 썸네일 56과 판결 결과 전폭.">
					<Row>
						<MemeThumbnail />
						<MemeThumbnail meme={SAMPLE_IMAGE} />
					</Row>
				</Section>

				<Section
					title="18 지출 카드 6종"
					description="투표 중 미투표, 투표 완료, 본인 게시물, 판결 확정(유죄와 형량, 수감 중), 판결 확정(살까 말까 기각), 각하."
				>
					<ExpenseCard
						{...CHICKEN}
						state="voting"
						timeAgo="3시간 전"
						image={SAMPLE_IMAGE}
						deadlineLabel="마감까지 8시간"
						eligibleCount={5}
						voteState="open"
						reactions={REACTIONS}
						commentCount={4}
					/>
					<ExpenseCard
						state="voting"
						name="민재"
						tier="penniless"
						timeAgo="1시간 전"
						postType="considering"
						category="카페"
						title="스탠딩 데스크"
						amount={189000}
						deadlineLabel="마감까지 30분"
						tally={{ oppose: 1, support: 2 }}
						eligibleCount={4}
						voteState="voted"
						reactions={[]}
						commentCount={0}
					/>
					<ExpenseCard
						state="voting"
						name="소윤"
						tier="flower"
						timeAgo="방금"
						postType="spent"
						category="택시"
						title="심야 택시"
						amount={13400}
						memo="막차를 놓쳤어요"
						deadlineLabel="마감까지 12시간"
						tally={{ oppose: 0, support: 0 }}
						eligibleCount={4}
						voteState="own"
						reactions={[]}
						commentCount={0}
					/>
					<ExpenseCard
						{...CHICKEN}
						state="judged"
						timeAgo="어제"
						imprisonedLabel="수감 중 2일"
						verdict="guilty"
						sentence="life"
						headline="밥이 없었다는 건 변론이 아니라 자백입니다."
						meme={SAMPLE_IMAGE}
						reactions={REACTIONS}
						commentCount={4}
					/>
					<ExpenseCard
						state="judged"
						name="현우"
						tier="flower"
						timeAgo="어제"
						postType="considering"
						category="쇼핑/패션"
						title="에어팟 노캔"
						amount={359000}
						memo="통근이 힘들어요"
						verdict="disagree"
						tally={{ oppose: 4, support: 1 }}
						headline="통근 힘들면 이어폰 말고 일찍 자세요."
						reactions={[{ emoji: "😂", count: 3 }]}
						commentCount={2}
					/>
					<ExpenseCard
						state="dismissed"
						name="정우"
						tier="king"
						timeAgo="2일 전"
						postType="spent"
						category="카페"
						title="아이스 아메리카노"
						amount={4500}
						reactions={[]}
						commentCount={1}
					/>
					<NoSpendCard
						name="소윤"
						tier="flower"
						streakDays={6}
						reactions={[{ emoji: "👏", count: 3 }]}
						commentCount={1}
					/>
				</Section>

				<Section
					title="19 판결 블록 3상태"
					description="헤드라인과 형량과 도장, 짤 자리, 배심원 평결(투표자 목록), AI 판사 선고(양형 이유, 캡션), 형 집행. 순서 고정."
				>
					<VerdictPanel
						verdict="guilty"
						postType="spent"
						headline="네 이놈!"
						sentence="life"
						meme={SAMPLE_IMAGE}
						tally={CHICKEN.tally}
						voters={[
							{ name: "현우", verdict: "guilty" },
							{ name: "민재", verdict: "guilty" },
							{ name: "소윤", verdict: "guilty" },
							{ name: "정우", verdict: "notGuilty" }
						]}
						ruleNote="한 달에 배달음식 1번"
						intensity="spicy"
						judgeMessage="밥이 없었다는 건 변론이 아니라 자백입니다. 라면 한 봉지 900원이 냉장고 옆에 있었을 텐데요. 배심원 만장일치에 가까운 유죄, 무기징역 3일을 선고합니다."
						sentencingReason="유죄율 75%에 방 규칙 위반이 겹쳐 무기징역을 선고합니다."
						execution={{ status: "active", daysLeft: 2, totalDays: 3 }}
					/>
					<VerdictPanel
						verdict="notGuilty"
						postType="spent"
						headline="밥은 먹어야죠."
						tally={{ oppose: 1, support: 3 }}
						ruleNote="한 달에 배달음식 1번"
						intensity="mild"
						judgeMessage="밥은 먹어야죠. 다만 곱빼기는"
						streaming
					/>
					<VerdictPanel
						verdict="dismissed"
						postType="considering"
						tally={{ oppose: 1, support: 0 }}
						intensity="spicy"
						judgeMessage=""
					/>
				</Section>

				<Section
					title="20 랭킹"
					description="포디움 3열(1위 가운데, 나는 ink 카드), 리스트 행(상위 3위 red 순위, 나는 fill), 내 순위 바."
				>
					<RankingPodium
						entries={[
							{ place: 2, name: "현우", value: "5일" },
							{ place: 1, name: "소윤", value: "6일", isMe: true },
							{ place: 3, name: "민재", value: "3일" }
						]}
					/>
					<RankingRow rank={4} name="지민" tier="hardcore" value="1일" />
					<RankingRow rank={1} name="지민" tier="hardcore" value="48점" />
					<RankingRow rank={3} name="소윤" tier="flower" value="22점" isMe />
					<MyRankRow name="소윤" noSpendRank={1} nagRank={3} />
				</Section>

				<Section
					title="21 방 카드와 프로필 요약"
					description="방 카드는 이름, 강도 태그, 마감 시간 뱃지, 미읽음 배지, 최근 활동, 멤버 수. 요약 카드는 수감 중일 때만 D-day, 예산 초과는 경고."
				>
					<RoomCard
						roomName="야근족 거지방"
						intensity="spicy"
						deadlineLabel="30분 재판"
						unreadCount={3}
						memberCount={5}
						recentActivity="지민 · 배달 24,000원 — 투표 중"
					/>
					<RoomCard
						roomName="자취방 절약단"
						intensity="mild"
						unreadCount={0}
						memberCount={3}
						recentActivity="현우 · 살까 말까 에어팟 — 기각"
					/>
					<ProfileSummaryCard
						name="소윤"
						tier="flower"
						nextTierLabel="거지왕까지 14점"
						score={71}
						monthLabel="9월 지출"
						spent={412000}
						budget={500000}
						baseline={100000}
						noSpendDays={6}
						imprisonment={{ daysLeft: 2, totalDays: 3 }}
					/>
					<ProfileSummaryCard
						name="지민"
						tier="penniless"
						nextTierLabel="상거지까지 12점"
						score={28}
						monthLabel="9월 지출"
						spent={540000}
						budget={500000}
						baseline={100000}
						noSpendDays={1}
					/>
				</Section>
			</main>
		</div>
	);
}
