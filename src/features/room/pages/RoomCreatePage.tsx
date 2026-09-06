import { useState } from "react";
import { useNavigate } from "react-router";

import { BackHeader } from "@/shared/components/BackHeader";
import { type Intensity, INTENSITY_LABELS } from "@/shared/domain/room";
import { Chip } from "@/shared/ui/Chip";
import { StickyCta } from "@/shared/ui/StickyCta";
import { TabSegment } from "@/shared/ui/TabSegment";
import { TextField } from "@/shared/ui/TextField";

import { IntensityQuote } from "../components/IntensityQuote";
import { InviteSheet } from "../components/InviteSheet";
import { RoomRuleEditor } from "../components/RoomRuleEditor";

const ROOM_ID = "1";
const INVITE_URL = "ttegeoji.app/i/K7X2M";
const INITIAL_ROOM_NAME = "야근족 거지방";
const INITIAL_RULES = ["한 달에 배달음식 1번"];

const INTENSITIES = ["mild", "spicy", "hell"] as const satisfies readonly Intensity[];
const DEADLINES = ["30분", "1시간", "3시간", "6시간", "12시간"];

export function RoomCreatePage() {
	const navigate = useNavigate();
	const [roomName, setRoomName] = useState(INITIAL_ROOM_NAME);
	const [intensity, setIntensity] = useState<Intensity>("spicy");
	const [deadline, setDeadline] = useState("12시간");
	const [rules, setRules] = useState(INITIAL_RULES);
	const [inviteOpen, setInviteOpen] = useState(false);

	return (
		<div className="flex flex-1 flex-col">
			<div className="px-5">
				<BackHeader title="거지방 만들기" onBack={() => navigate(-1)} />
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
						onChange={setIntensity}
					/>
					<IntensityQuote />
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<span className="text-label text-mute">투표 마감</span>
						<span className="text-caption text-dim">전원 투표 시 즉시 판결</span>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{DEADLINES.map((option) => (
							<Chip key={option} tone="red" selected={option === deadline} onClick={() => setDeadline(option)}>
								{option}
							</Chip>
						))}
					</div>
				</div>

				<RoomRuleEditor rules={rules} onChange={setRules} />
			</div>

			<StickyCta label="거지방 만들기" onClick={() => setInviteOpen(true)} className="sticky-cta" />

			<InviteSheet
				open={inviteOpen}
				onClose={() => setInviteOpen(false)}
				inviteUrl={INVITE_URL}
				onLater={() => navigate(`/rooms/${ROOM_ID}`)}
			/>
		</div>
	);
}
