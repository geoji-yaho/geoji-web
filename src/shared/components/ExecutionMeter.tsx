import type { Imprisonment } from "../domain/verdict";
import { MeterBar } from "../ui/MeterBar";

type ExecutionMeterProps = Imprisonment & {
	className?: string;
};

export function ExecutionMeter({ daysLeft, totalDays, className }: ExecutionMeterProps) {
	return <MeterBar value={totalDays - daysLeft} max={totalDays} tone="red" size="sm" className={className} />;
}
