import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const NOTICE_MS = 2500;

function readNotice(state: unknown) {
	if (typeof state !== "object" || state === null || !("notice" in state)) {
		return null;
	}

	const { notice } = state;
	return typeof notice === "string" && notice !== "" ? notice : null;
}

export function useRouteNotice() {
	const { pathname, search, state } = useLocation();
	const navigate = useNavigate();
	const incoming = readNotice(state);
	const [notice, setNotice] = useState(incoming);

	useEffect(() => {
		if (incoming === null) {
			return;
		}

		void navigate(pathname + search, { replace: true, state: null });
	}, [incoming, navigate, pathname, search]);

	useEffect(() => {
		if (notice === null) {
			return;
		}

		const timer = setTimeout(() => setNotice(null), NOTICE_MS);
		return () => clearTimeout(timer);
	}, [notice]);

	return notice;
}
