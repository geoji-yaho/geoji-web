import { useState } from "react";
import { useNavigate } from "react-router";

import { SPICE_LEVEL_BY_INTENSITY } from "@/shared/api/rooms";
import { BackHeader } from "@/shared/components/BackHeader";
import {
	type Intensity,
	INTENSITY_LABELS,
	VOTE_DEADLINE_LABELS,
	VOTE_DEADLINE_MINUTES,
	type VoteDeadlineMinutes
} from "@/shared/domain/room";
import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";

import { IntensityQuote } from "../components/IntensityQuote";
import { InviteSheet } from "../components/InviteSheet";
import { RoomRuleEditor } from "../components/RoomRuleEditor";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { buildInviteUrl } from "../utils/buildInviteUrl";

const INTENSITIES = ["mild", "spicy", "hell"] as const satisfies readonly Intensity[];
const DEFAULT_DEADLINE_MINUTES: VoteDeadlineMinutes = 720;
const SHORT_DEADLINE_MINUTES = new Set<VoteDeadlineMinutes>([30, 60]);

export function RoomCreatePage() {
	const navigate = useNavigate();
	const [roomName, setRoomName] = useState("");
	const [intensity, setIntensity] = useState<Intensity>("spicy");
	const [hellPending, setHellPending] = useState(false);
	const [deadlineMinutes, setDeadlineMinutes] = useState<VoteDeadlineMinutes>(DEFAULT_DEADLINE_MINUTES);
	const [rules, setRules] = useState<string[]>([]);

	const createRoom = useCreateRoom();
	const trimmedName = roomName.trim();
	const created = createRoom.data ?? null;

	const selectIntensity = (next: Intensity) => {
		setIntensity(next);
		if (next === "hell") setHellPending(true);
	};

	const cancelHell = () => {
		setIntensity("spicy");
		setHellPending(false);
	};

	const submit = () => {
		if (!trimmedName) return;
		createRoom.mutate({
			name: trimmedName,
			spiceLevel: SPICE_LEVEL_BY_INTENSITY[intensity],
			voteDeadlineMinutes: deadlineMinutes,
			rules
		});
	};

	const goToRoom = () => {
		if (created) void navigate(`/rooms/${created.id}`);
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="거지방 만들기" onBack={() => void navigate(-1)} />
			</div>

			<div className="flex flex-col gap-4.5 px-5 pt-2">
				<TextField label="방 이름" required value={roomName} onChange={setRoomName} maxLength={20} />

				<div className="flex flex-col gap-2">
					<span className="text-label text-mute">
						잔소리 강도<span className="text-red"> *</span>
					</span>
					<TabSegment
						tabs={INTENSITIES}
						value={intensity}
						renderLabel={(key) => INTENSITY_LABELS[key]}
						onChange={selectIntensity}
					/>
					<IntensityQuote />
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-label text-mute">투표 마감</span>
					<TabSegment
						tabs={VOTE_DEADLINE_MINUTES}
						value={deadlineMinutes}
						renderLabel={(minutes) => VOTE_DEADLINE_LABELS[minutes]}
						onChange={setDeadlineMinutes}
					/>
					{SHORT_DEADLINE_MINUTES.has(deadlineMinutes) && (
						<span className="text-caption text-dim">
							짧을수록 판결이 빨리 나오지만, 표가 2개도 안 모이면 각하됩니다.
						</span>
					)}
				</div>

				<RoomRuleEditor rules={rules} onChange={setRules} />

				{createRoom.isError && <Alert>{createRoom.error.message}</Alert>}
			</div>

			<StickyCta
				label={createRoom.isPending ? "만드는 중" : "거지방 만들기"}
				onClick={submit}
				disabled={!trimmedName || createRoom.isPending}
				className="sticky-cta"
			/>

			<InviteSheet
				open={created !== null}
				onClose={goToRoom}
				inviteUrl={created ? buildInviteUrl(created.inviteCode) : ""}
				onLater={goToRoom}
			/>

			<BottomSheet open={hellPending} onClose={cancelHell} title="지옥맛 확인">
				<p className="text-chip text-mute">지옥맛은 수위가 높습니다. 멤버 전원이 감당할 수 있는지 확인해주세요.</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={cancelHell}>
						취소
					</Button>
					<Button onClick={() => setHellPending(false)}>확인</Button>
				</div>
			</BottomSheet>
		</div>
	);
}
