# 기여 가이드

## 개발 환경

Node 24(`.nvmrc`)와 pnpm 11(`corepack enable`)이 필요하다. `pnpm install`이 의존성과 함께 lefthook Git 훅과 에이전트 룰 링크를 설치한다. 개발 서버는 `pnpm dev`로 띄우고 http://localhost:3800 에 뜬다. 나머지 명령은 [README.md](./README.md)에 있다.

## 브랜치와 커밋 흐름

`develop`에서 `feature/{name}`을 따서 작업한다. 커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓰고 본문에는 왜 바꿨는지를 적는다. 커밋할 때 lefthook이 메시지 템플릿을 띄우고 린트와 포맷 검사를 돌리며 푸시 전에 타입 검사를 돌린다. PR은 `develop`으로 올리고 CI가 통과하면 merge commit으로 머지한 뒤 feature 브랜치를 지운다. 배포는 `develop`을 `main`으로 머지할 때 일어난다. 브랜치 이름과 커밋 타입, 금지 패턴은 `.agents/rules/git-workflow.md`에 있다.

## 코딩 컨벤션

정본은 `.agents/rules/`이고 `src/`를 만질 때 에이전트에 자동으로 로드된다. 아래는 그 요약이다.

### 폴더와 층

`src/`는 app, features, shared 3층이다. 위에서 아래로만 가져온다. app은 features와 shared를, features는 shared만 가져온다. features끼리는 import하지 않는다.

| 층                        | 담는 것                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `src/app/`                | 앱 조립. `layouts`, `router`, `styles`, `App.tsx`. 라우트 레이아웃도 여기 |
| `src/features/{feature}/` | 기능 단위. `pages`, `components`, `index.ts` 가운데 필요한 것만           |
| `src/shared/`             | `ui`, `components`, `domain`, `constants`, `hooks`, `lib`, `utils`        |

`shared`는 넷으로 갈린다. 떼거지를 모르는 UI는 `ui`, 판결과 티어처럼 서비스 개념을 아는 것은 `components`, 도메인 타입과 그 타입 없이는 뜻이 없는 값은 `domain`, 타입에 매이지 않은 값은 `constants`다. `components`는 `ui`를 가져다 쓰고 반대는 안 된다.

### import 경로

**같은 층 안이면 상대 경로, 층을 넘으면 `@/`.** `@/`는 `src/`를 가리킨다.

```ts
// src/app/router/routes.tsx
import { AppLayout } from "../layouts/AppLayout";
import { HomePage } from "@/features/home";

// src/shared/components/RoomCard.tsx
import { cn } from "../lib/cn";
import { CountBadge } from "../ui/CountBadge";
import { StatusTag } from "./StatusTag";

// src/features/room/pages/RoomFeedPage.tsx
import { ExpenseCard } from "@/shared/components/ExpenseCard";
import { RoomRuleList } from "../components/RoomRuleList";
```

`src/app` 전체가 한 층, `src/features/{feature}` 하나하나가 한 층, `src/shared` 전체가 한 층이다. 상대 경로를 계산해 `../`가 한 번까지면 같은 층이니 상대 경로이고 두 번 이상 올라가야 하면 `@/`다. `src/app/App.tsx`에서 `src/shared`로 가는 것만 예외로, `../`가 한 번이지만 층을 넘으므로 `@/`를 쓴다.

### 공개 API

`index.ts`는 `features/{feature}/index.ts`에만 둔다. 그 파일이 feature의 공개 API다.

- feature 밖에서는 `@/features/room`처럼 `index.ts`로만 들어간다. 깊이 들어가지 않는다. 밖에서 필요한 것이 생기면 `index.ts`에 한 줄 더한다
- feature 안에서는 자기 `index.ts`를 거치지 않고 파일을 직접 가져온다
- `export *`를 쓰지 않고 이름을 적어 내보낸다. 타입은 `export type`
- `shared`는 배럴이 없으니 `@/shared/ui/Button`처럼 파일 경로까지 적는다

### 파일 이름

컴포넌트는 PascalCase(`RoomCard.tsx`), 폴더는 kebab-case다. 컴포넌트가 아닌 파일은 주 export가 하나이고 파일 이름이 그 심볼과 같아지면 심볼 표기를 그대로 쓰고(`useTheme.ts`, `cn.ts`), 상수와 타입 모음처럼 여럿을 내보내면 kebab-case로 쓴다(`expense-categories.ts`, `theme-store.ts`). 한 `.tsx`에는 컴포넌트 하나만 둔다.

### props 타입

`children`을 받으면 `PropsWithChildren`으로 감싼다. `children?: ReactNode`를 직접 적지 않는다. cva를 쓰면 변형 타입을 `VariantProps`에서 뽑는다.

```ts
type TagProps = PropsWithChildren<{
	tone?: TagTone;
	className?: string;
}>;
```

### 스타일

색과 타이포, 모서리, 그림자는 `src/app/styles/theme/`의 토큰 이름으로만 쓴다. Tailwind 기본 팔레트는 비워 두었으니 `bg-gray-100`은 CSS가 나오지 않는다. 대괄호 임의값(`text-[44px]`)을 쓰지 않고 정식 클래스나 토큰으로 푼다. 글자 크기만 예외로, 토큰에 없는 단계는 기본 클래스(`text-xs`, `text-base`)를 쓴다. 조건부 클래스는 `cn`으로 합치고 변형이 둘 이상이면 `cva`로 선언한다. 다크는 같은 토큰의 값만 바뀌므로 `dark:` 변형을 쓰지 않는다.

### 주석을 쓰지 않는다

코드에 주석을 달지 않는다. CSS와 HTML은 한 줄도 쓰지 않는다. 설명이 필요하면 그 내용이 갈 문서를 찾는다. 디자인 토큰의 용도와 값 근거는 `docs/design/DESIGN.md`, 동작 규칙은 `docs/product/SPEC.md`, 컨벤션은 이 문서다.

아래는 주석으로 남기지 않고 이 문서에 모아 둔 것이다.

- cva의 boolean 변형은 `VariantProps`에서 `boolean | null | undefined`가 된다. 그 값을 `aria-pressed`처럼 `null`을 받지 않는 자리에 넘기려면 `& { selected?: boolean }`로 좁혀야 한다. `Chip`이 그 경우다
- `light-dark()`로 선언한 색은 `getPropertyValue`로 읽으면 함수 문자열이 나온다. `theme-color` meta는 색을 JS로 읽지 않고 `index.html`의 meta 두 개 가운데 어느 것을 살릴지만 `media` 속성으로 정한다
- `index.html`의 테마 초기화 스크립트는 스타일 적용 전에 `data-theme`을 정해야 하므로 인라인이다. 저장 키는 `src/shared/lib/theme-store.ts`의 `STORAGE_KEY`와 같아야 한다
- `AppLayout`이 `useOutlet()`을 쓰는 이유는 `Outlet`을 직접 쓰면 나가는 화면도 새 화면을 그려 전환 중 두 화면이 같아지기 때문이다
- `stamp-sound.ts`의 `primeStampSound`는 사용자 제스처 핸들러 안에서 먼저 불러야 한다. `playStampSound`는 애니메이션 프레임에서 불려 제스처가 아니고, 그때 AudioContext를 처음 만들면 무음이 된다
- `pressable` 유틸리티가 색 전환까지 맡는다. `transition-colors`를 같이 쓰면 그쪽이 뒤에 나와 transform 전환을 덮는다

## 완료 기준

PR을 올리기 전에 게이트를 전부 통과해야 한다.

```bash
pnpm check   # 타입 검사, 빌드, 린트, 포맷 검사
```

게이트를 통과시키려고 린트 규칙을 끄거나 검사를 건너뛰지 않는다. UI를 바꿨으면 개발 서버에서 모바일 폭으로 확인한다.
