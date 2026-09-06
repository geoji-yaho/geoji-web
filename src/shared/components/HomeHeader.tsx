import { Avatar } from "../ui/Avatar";
import { Logo } from "./Logo";

type HomeHeaderProps = {
	profileName: string;
	onProfile?: () => void;
};

export function HomeHeader({ profileName, onProfile }: HomeHeaderProps) {
	return (
		<header className="flex items-center justify-between py-3">
			<Logo />
			<button type="button" aria-label="마이페이지" onClick={onProfile} className="pressable rounded-full">
				<Avatar name={profileName} />
			</button>
		</header>
	);
}
