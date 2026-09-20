export async function toDataUrl(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`${url} 응답이 ${response.status}입니다`);
	}

	const blob = await response.blob();

	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(String(reader.result)));
		reader.addEventListener("error", () => reject(reader.error));
		reader.readAsDataURL(blob);
	});
}
