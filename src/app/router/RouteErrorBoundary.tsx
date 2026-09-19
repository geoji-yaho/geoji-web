import { RouteErrorPage } from "./RouteErrorPage";

export function RouteErrorBoundary() {
	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-phone flex-col bg-screen">
			<RouteErrorPage />
		</div>
	);
}
