import { Alert } from "./Alert";
import { Button } from "./Button";

const RETRY_LABEL = "다시 시도";

type RetryNoticeProps = {
	message: string;
	onRetry: () => void;
};

export function RetryNotice({ message, onRetry }: RetryNoticeProps) {
	return (
		<div className="flex flex-col gap-2.5">
			<Alert>{message}</Alert>
			<Button variant="outline" onClick={onRetry}>
				{RETRY_LABEL}
			</Button>
		</div>
	);
}
