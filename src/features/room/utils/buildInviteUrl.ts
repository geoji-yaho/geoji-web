import { invitePath } from "@/shared/constants/routes";
import { toAbsoluteUrl } from "@/shared/lib/base-path";

export function buildInviteUrl(inviteCode: string) {
	return toAbsoluteUrl(invitePath(inviteCode));
}
