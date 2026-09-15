interface KakaoShareLink {
	mobileWebUrl: string;
	webUrl: string;
}

interface KakaoTextTemplate {
	objectType: "text";
	text: string;
	link: KakaoShareLink;
	buttonTitle?: string;
}

interface KakaoSdk {
	init: (appKey: string) => void;
	isInitialized: () => boolean;
	Share: {
		sendDefault: (template: KakaoTextTemplate) => void;
	};
}

interface Window {
	Kakao?: KakaoSdk;
}
