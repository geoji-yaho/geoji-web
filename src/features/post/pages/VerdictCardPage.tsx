import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { Button } from "@/shared/ui/Button";

import { ShareCardPreview } from "../components/ShareCardPreview";

const SAMPLE_CARD = {
	caseLine: "배달, 지민, 상거지",
	caseNumber: "CASE 0902-24",
	amount: 24000,
	headline: '"밥이 없었다는 건 변론이 아니라 자백입니다."',
	verdict: "guilty"
} as const;

export function VerdictCardPage() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<BackHeader title="공유 카드" onBack={() => navigate(-1)} />

			<div className="flex flex-1 flex-col justify-center gap-4.5">
				<ShareCardPreview {...SAMPLE_CARD} />
				<p className="text-center text-xs text-dim">프로필 이미지는 들어가지 않습니다</p>
			</div>

			<div className="flex gap-2.5">
				<Button variant="secondary" className="flex-1">
					이미지 저장
				</Button>
				<Button className="flex-1 shadow-cta">공유하기</Button>
			</div>
		</div>
	);
}
