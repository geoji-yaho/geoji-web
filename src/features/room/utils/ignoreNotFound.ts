import { isApiError } from "@/shared/api/api-error";

export async function ignoreNotFound(request: Promise<void>) {
	try {
		await request;
	} catch (error) {
		if (isApiError(error) && error.kind === "notFound") {
			return;
		}

		throw error;
	}
}
