import { type Intensity, INTENSITY_LABELS } from "../domain/room";
import { Tag, type TagTone } from "../ui/Tag";

const INTENSITY_TONES: Record<Intensity, TagTone> = {
	mild: "outline",
	spicy: "red",
	hell: "ink"
};

type IntensityTagProps = {
	intensity: Intensity;
	className?: string;
};

export function IntensityTag({ intensity, className }: IntensityTagProps) {
	return (
		<Tag tone={INTENSITY_TONES[intensity]} className={className}>
			{INTENSITY_LABELS[intensity]}
		</Tag>
	);
}
