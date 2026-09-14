import { Alert } from "@/shared/ui/Alert";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/TextField";

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
	return (
		<BottomSheet open={open} onClose={onClose} title="닉네임">
			<TextField label="닉네임" value={value} onChange={onChange} />
			{errorMessage && <Alert>{errorMessage}</Alert>}
			<Button onClick={onSubmit} disabled={isPending || value.trim().length === 0}>
				변경하기
			</Button>
		</BottomSheet>
	);
}
