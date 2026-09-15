import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";

import { invitePath } from "@/shared/constants/routes";
import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/TextField";

import { parseInviteCode } from "../utils/parseInviteCode";

const INVALID_MESSAGE = "초대 링크나 코드가 올바르지 않습니다";

type RoomJoinSheetProps = {
	open: boolean;
	onClose: () => void;
};

export function RoomJoinSheet({ open, onClose }: RoomJoinSheetProps) {
	const navigate = useNavigate();
	const [value, setValue] = useState("");
	const [isInvalid, setIsInvalid] = useState(false);

	const handleClose = () => {
		setValue("");
		setIsInvalid(false);
		onClose();
	};

	const handleChange = (next: string) => {
		setValue(next);
		setIsInvalid(false);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const code = parseInviteCode(value);
		if (code === null) {
			setIsInvalid(true);
			return;
		}

		void navigate(invitePath(code));
	};

	return (
		<BottomSheet open={open} onClose={handleClose} title="거지방 참여">
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<TextField
					label="초대 링크나 코드"
					value={value}
					onChange={handleChange}
					placeholder="친구에게 받은 링크를 붙여 넣으세요"
					autoCapitalize="none"
					autoComplete="off"
				/>
				{isInvalid && <Alert>{INVALID_MESSAGE}</Alert>}
				<Button type="submit" disabled={value.trim() === ""}>
					초대장 열기
				</Button>
			</form>
		</BottomSheet>
	);
}
