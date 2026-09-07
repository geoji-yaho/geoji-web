const INTENSITY_QUOTE = '"배달 24,000원? 밥이 없으면 라면을 드셨어야죠."';

export function IntensityQuote() {
	return (
		<p className="rounded-r-xl border-l-4 border-red bg-red/10 px-3.5 py-2.5 text-chip text-text">{INTENSITY_QUOTE}</p>
	);
}
