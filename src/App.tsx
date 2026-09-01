type Verdict = "승인" | "기각" | "칭송";

type FeedItem = {
	name: string;
	amount: number;
	memo: string;
	verdict: Verdict;
	comment: string;
};

const VERDICT_BADGE_STYLES: Record<Verdict, string> = {
	승인: "bg-gray-100 text-gray-600 ring-gray-300",
	기각: "bg-red-50 text-red-600 ring-red-300",
	칭송: "bg-green-50 text-green-700 ring-green-300"
};

// 와이어프레임 v2의 카피 원문. 실제 판결은 AI 총무(geoji-server)가 내린다.
const FEED_PREVIEW: FeedItem[] = [
	{
		name: "박택시",
		amount: 12000,
		memo: "늦잠 자서 택시 탐",
		verdict: "기각",
		comment: "지하철이 있었잖아요. 알람을 12개 맞추세요."
	},
	{
		name: "이알뜰",
		amount: 0,
		memo: "무지출 인증",
		verdict: "칭송",
		comment: "3일 연속 무지출. 이 방의 유일한 희망입니다."
	},
	{
		name: "김점심",
		amount: 9000,
		memo: "점심 김치찌개",
		verdict: "승인",
		comment: "밥은 먹어야죠. 다만 곱빼기는 사치였습니다."
	}
];

function VerdictCard({ item }: { item: FeedItem }) {
	return (
		<article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
			<div className="flex items-baseline justify-between">
				<span className="font-semibold text-stone-800">{item.name}</span>
				<span className="text-lg font-bold text-stone-900">{item.amount.toLocaleString("ko-KR")}원</span>
			</div>
			<p className="mt-1 text-sm text-stone-500">{item.memo}</p>
			<div className="mt-4 flex items-start gap-2">
				<span
					className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${VERDICT_BADGE_STYLES[item.verdict]}`}
				>
					{item.verdict}
				</span>
				<p className="text-sm leading-relaxed text-stone-700">{item.comment}</p>
			</div>
		</article>
	);
}

export default function App() {
	return (
		<div className="min-h-dvh bg-amber-50 text-stone-900">
			<main className="mx-auto flex max-w-md flex-col gap-8 px-5 py-14">
				<header className="text-center">
					<p className="text-sm font-semibold tracking-wide text-amber-700">무지출 챌린지</p>
					<h1 className="mt-2 text-4xl font-extrabold tracking-tight">거지방 AI 총무</h1>
					<p className="mt-4 leading-relaxed text-stone-600">
						지출을 자진 신고하면 AI 총무가 판결합니다.
						<br />
						무지출은 판결 없이 바로 칭송받습니다.
					</p>
				</header>

				<section aria-label="판결 피드 미리보기" className="flex flex-col gap-3">
					{FEED_PREVIEW.map((item) => (
						<VerdictCard key={item.name} item={item} />
					))}
				</section>

				<footer className="text-center text-xs text-stone-400">
					<p>서비스 준비 중입니다.</p>
					<p className="mt-1">원티드 AI Championship 2026, 팀 거지야호</p>
				</footer>
			</main>
		</div>
	);
}
