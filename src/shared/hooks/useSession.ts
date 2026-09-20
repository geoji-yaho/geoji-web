import type { AuthSession } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";

import { getSupabase } from "../lib/supabase";

export type SessionSnapshot = {
	session: AuthSession | null;
	isLoading: boolean;
};

const listeners = new Set<() => void>();

let snapshot: SessionSnapshot = { session: null, isLoading: true };
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

	void supabase.auth.getSession().then(({ data }) => {
		setSnapshot({ session: data.session, isLoading: false });
	});

	supabase.auth.onAuthStateChange((_event, session) => {
		setSnapshot({ session, isLoading: false });
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
