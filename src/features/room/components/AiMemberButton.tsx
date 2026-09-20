import { Bot } from "lucide-react";

import type { ApiError } from "@/shared/api/api-error";
import { isAiMemberUnavailable } from "@/shared/api/rooms";
import { cn } from "@/shared/lib/cn";
import { Alert } from "@/shared/ui/Alert";
import { Button } from "@/shared/ui/Button";

import { useAddAiMember } from "../hooks/useAddAiMember";

const ADD_LABEL = "데모용 AI 유저 추가";
const PENDING_LABEL = "추가하는 중";
const ADDED_LABEL = "떼거지봇 추가됨";
const ADDED_MESSAGE = "떼거지봇이 들어왔어요. 글을 올리면 곧 투표합니다.";
const UNAVAILABLE_MESSAGE = "지금은 추가할 수 없어요";

type AiMemberButtonProps = {
	roomId: string;
	isAdded?: boolean;
	className?: string;
};

function toErrorMessage(error: ApiError) {
	return isAiMemberUnavailable(error) ? UNAVAILABLE_MESSAGE : error.message;
}

export function AiMemberButton({ roomId, isAdded = false, className }: AiMemberButtonProps) {
	const addAiMember = useAddAiMember(roomId);
	const added = isAdded || addAiMember.isSuccess;
	const label = addAiMember.isPending ? PENDING_LABEL : added ? ADDED_LABEL : ADD_LABEL;

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Button
				variant="outline"
				className="gap-2"
				onClick={() => addAiMember.mutate()}
				disabled={added || addAiMember.isPending}
			>
				<Bot className="size-4" aria-hidden="true" />
				{label}
			</Button>
			{addAiMember.isSuccess && <p className="text-center text-caption text-dim">{ADDED_MESSAGE}</p>}
			{addAiMember.isError && <Alert>{toErrorMessage(addAiMember.error)}</Alert>}
		</div>
	);
}
