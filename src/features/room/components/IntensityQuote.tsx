import type { Intensity } from "@/shared/domain/room";

const INTENSITY_QUOTES: Record<Intensity, string> = {
	mild: "커피 한 잔이 아침을 살리는 건 알아요. 다만 이번 달 열두 잔째라 잔고도 한 번만 챙겨줘요.",
	spicy: "세일은 매주 오는데 월급은 매달 한 번이네. 이 속도면 다음 세일 오기 전에 텅장된다.",
	hell: "커피는 리필되고 잔고는 증발하네. 이제 마통 개설하겠네? ㅋ"
};

type IntensityQuoteProps = {
	intensity: Intensity;
};

export function IntensityQuote({ intensity }: IntensityQuoteProps) {
	return (
		<p className="rounded-r-xl border-l-4 border-red bg-red/10 px-3.5 py-2.5 text-chip text-text">
			&ldquo;{INTENSITY_QUOTES[intensity]}&rdquo;
		</p>
	);
}
