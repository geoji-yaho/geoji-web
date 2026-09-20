import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/TextField";

const NICKNAME_MAX_LENGTH = 20;
const BLANK_MESSAGE = "공백만으로는 닉네임을 지을 수 없습니다";

type NicknameSheetProps = {
	open: boolean;
	onClose: () => void;
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	isPending: boolean;
	errorMessage?: string;
};

export function NicknameSheet({
	open,
	onClose,
	value,
	onChange,
	onSubmit,
	isPending,
	errorMessage
}: NicknameSheetProps) {
	const isBlank = value.length > 0 && value.trim().length === 0;

	return (
		<BottomSheet open={open} onClose={onClose} title="닉네임">
			<TextField label="닉네임" value={value} onChange={onChange} maxLength={NICKNAME_MAX_LENGTH} />
			{isBlank && (
				<span role="status" className="text-caption text-red">
					{BLANK_MESSAGE}
				</span>
			)}
			{errorMessage && <Alert>{errorMessage}</Alert>}
			<Button onClick={onSubmit} disabled={isPending || value.trim().length === 0}>
				변경하기
			</Button>
		</BottomSheet>
	);
}
