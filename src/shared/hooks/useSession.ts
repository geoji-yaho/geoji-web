import type { AuthSession } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";

import { getSupabase } from "../lib/supabase";

export type SessionSnapshot = {
	session: AuthSession | null;
	isLoading: boolean;
	hasFailed: boolean;
};

const listeners = new Set<() => void>();

let snapshot: SessionSnapshot = { session: null, isLoading: true, hasFailed: false };
let initialized = false;

function setSnapshot(next: SessionSnapshot) {
	snapshot = next;

	for (const listener of listeners) {
		listener();
	}
}

function ensureInitialized() {
	if (initialized) {
		return;
	}

	initialized = true;
	const supabase = getSupabase();

	void supabase.auth
		.getSession()
		.then(({ data, error }) => {
			setSnapshot({ session: data.session, isLoading: false, hasFailed: error !== null });
		})
		.catch(() => {
			setSnapshot({ session: null, isLoading: false, hasFailed: true });
		});

	supabase.auth.onAuthStateChange((_event, session) => {
		setSnapshot({ session, isLoading: false, hasFailed: false });
	});
}

const sessionStore = {
	subscribe(listener: () => void) {
		ensureInitialized();
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	},

	getSnapshot() {
		return snapshot;
	}
};

export function useSession() {
	return useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot);
}

export function getSessionSnapshot() {
	ensureInitialized();

	return snapshot;
}
