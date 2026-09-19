import { LogoIcon } from "@/shared/components/LogoIcon";
import { buttonVariants } from "@/shared/ui/button-variants";

const HOME_HREF = import.meta.env.BASE_URL;
const ERROR_TITLE = "화면을 열지 못했습니다";
const ERROR_DESCRIPTION = "주소가 잘못되었거나 화면을 그리는 중에 문제가 생겼습니다.";
const HOME_LABEL = "홈으로 가기";

export function RouteErrorPage() {
	return (
		<div className="flex flex-1 flex-col px-5 pb-8.5">
			<div className="flex flex-1 flex-col items-center justify-center gap-2.5 text-center">
				<LogoIcon className="size-20" />
				<h1 className="text-title text-ink">{ERROR_TITLE}</h1>
				<p className="text-chip text-mute">{ERROR_DESCRIPTION}</p>
			</div>
			<a href={HOME_HREF} className={buttonVariants()}>
				{HOME_LABEL}
			</a>
		</div>
	);
}
