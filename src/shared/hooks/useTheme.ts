import { useCallback, useSyncExternalStore } from "react";

import type { ThemePreference } from "@/shared/domain/theme";
import { themeStore } from "@/shared/lib/theme-store";

export function useTheme() {
	const { preference, resolved } = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot);

	const setPreference = useCallback((next: ThemePreference) => {
		themeStore.setPreference(next);
	}, []);

	return {
		preference,
		resolved,
		setPreference
	};
}
