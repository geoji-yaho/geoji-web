# 기여 가이드

## 개발 환경

Node 24(`.nvmrc`)와 pnpm 11(`corepack enable`)이 필요하다. `pnpm install`이 의존성과 함께 lefthook Git 훅과 에이전트 룰 링크를 설치한다. 개발 서버는 `pnpm dev`로 띄우고 http://localhost:3800 에 뜬다. 나머지 명령은 [README.md](./README.md)에 있다.

## 브랜치와 커밋 흐름

`develop`에서 `feature/{name}`을 따서 작업한다. 커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓰고 본문에는 왜 바꿨는지를 적는다. 커밋할 때 lefthook이 메시지 템플릿을 띄우고 린트와 포맷 검사를 돌리며 푸시 전에 타입 검사를 돌린다. PR은 `develop`으로 올리고 CI가 통과하면 merge commit으로 머지한 뒤 feature 브랜치를 지운다. 배포는 `develop`을 `main`으로 머지할 때 일어난다. 브랜치 이름과 커밋 타입, 금지 패턴은 `.agents/rules/git-workflow.md`에 있다.

## 코딩 컨벤션

정본은 `.agents/rules/`이고 `src/`를 만질 때 에이전트에 자동으로 로드된다. 아래는 그 요약이다.

### 폴더와 층

`src/`는 app, features, shared 3층이다. 위에서 아래로만 가져온다. app은 features와 shared를, features는 shared만 가져온다. features끼리는 import하지 않는다.

| 층                        | 담는 것                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `src/app/`                | 앱 조립. `layouts`, `router`, `styles`, `App.tsx`. 라우트 레이아웃도 여기           |
| `src/features/{feature}/` | 기능 단위. `pages`, `components`, `api`, `hooks`, `index.ts` 가운데 필요한 것만     |
| `src/shared/`             | `ui`, `components`, `domain`, `constants`, `api`, `hooks`, `lib`, `utils`, `@types` |

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

### 데이터 층

서버 상태는 TanStack Query 5가 맡고 요청은 `src/shared/api/http.ts`의 `http`가 브라우저 `fetch`로 보낸다. 백엔드 규약은 geoji-server 저장소의 `API.md`다. 기준 주소는 `VITE_API_BASE_URL` 환경 변수에서 오고 로컬 설정은 [README.md](./README.md)의 시작하기 절에 있다.

| 파일                                    | 하는 일                                                                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/shared/api/http.ts`                | `http.get`, `post`, `put`, `delete`. 쿼리 스트링과 JSON 바디, Authorization 헤더, 10초 타임아웃을 붙이고 실패는 `ApiError`로 던진다                                         |
| `src/shared/api/api-error.ts`           | `ApiError`와 `isApiError`. `kind`는 badRequest, unauthorized, forbidden, notFound, conflict, server, network, timeout 8종                                                   |
| `src/shared/api/auth-token.ts`          | `setAccessTokenProvider`와 `getAccessToken`. 등록한 공급자가 없으면 Authorization 헤더 없이 요청한다. 지금은 `App.tsx`가 개발용 토큰(`env.devAccessToken`)을 등록한다       |
| `src/shared/api/profile.ts`, `rooms.ts` | 엔티티 모듈. 응답 타입과 요청 함수, `queryOptions` 팩토리(`profileQueries`, `roomQueries`)                                                                                  |
| `src/shared/lib/env.ts`                 | `env.apiBaseUrl`. 읽는 순간 `VITE_API_BASE_URL`을 확인하고 없거나 https 페이지에서 http 주소면 던진다. `env.devAccessToken`과 `env.devNickname`은 개발 서버에서만 값이 있다 |
| `src/shared/lib/query-client.ts`        | `createQueryClient`. 쿼리 기본 옵션과 재시도 규칙, 401이면 `onUnauthorized`                                                                                                 |
| `src/app/providers/QueryProvider.tsx`   | `QueryClientProvider`와 devtools. 401이면 `/login`으로 보낸다                                                                                                               |

feature에서 API를 부를 때는 이렇게 한다.

- 요청은 `http`만 쓴다. 화면이나 훅에서 `fetch`를 직접 부르지 않는다
- 엔티티 모듈(응답 타입, 요청 함수, `queryOptions` 팩토리)은 두 feature 이상이 쓰면 `src/shared/api/{entity}.ts`, 한 feature만 쓰면 그 feature의 `api/`에 둔다. 프로필(auth, home, me)과 방(home, room)은 shared다
- 키는 엔티티로 시작하는 계층이다. `["rooms"]`, `["rooms", "list"]`, `["rooms", "detail", id]`처럼 팩토리 함수로 만들고 `queryOptions`로 정의해 `useQuery`, `useSuspenseQuery`, `queryClient.prefetchQuery`가 같은 정의를 쓴다
- 변이는 쓰는 화면의 feature `hooks/`에 `useMutation` 훅으로 둔다. 성공하면 `setQueryData`로 상세를 채우고 `invalidateQueries`로 목록을 다시 받는다. `onSuccess`가 그 Promise를 돌려주면 목록이 올 때까지 `isPending`이 유지된다
- 401은 전역에서 로그인 화면으로 보내므로 화면이 다루지 않는다. 그 밖은 `error.kind`로 분기한다. `Register.defaultError`를 `ApiError`로 등록해 두어 `error`가 `ApiError`로 잡힌다
- 아직 없는 리소스는 queryFn 안에서 잡아 `null`로 바꾼다. 404로 오는 엔드포인트(이번 주 도전 과제)는 `notFound`를, 온보딩 전 프로필은 `GET /api/me`가 409로 오므로 `conflict`를 잡는다. `data === null`이 아직 없다는 뜻이다
- 재시도는 network와 timeout, server만 2회까지다. 4xx와 변이는 다시 시도하지 않는다
- 응답 타입은 `API.md`의 필드와 값을 그대로 옮긴다. 화면 모델과 값이 다른 것은 엔티티 모듈에 대응표를 두고 화면이 그 표로 바꾼다. 방 강도는 `rooms.ts`의 `SPICE_LEVEL_BY_INTENSITY`와 `INTENSITY_BY_SPICE_LEVEL`, 게시물 타입은 `features/post/api/expenses.ts`의 `EXPENSE_SOURCE_BY_POST_TYPE`이다

실제 예시는 엔티티 모듈 `src/shared/api/profile.ts`와 `src/shared/api/rooms.ts`, 변이 훅 `src/features/auth/hooks/useCreateProfile.ts`와 `src/features/me/hooks/useUpdateProfile.ts`, `src/features/room/hooks/useCreateRoom.ts`, `src/features/room/hooks/useJoinRoom.ts`다. 화면에서는 이렇게 쓴다.

```tsx
const { data: profile, isPending } = useQuery(profileQueries.me());
const needsOnboarding = profile === null;

const rooms = useQuery(roomQueries.list());
const createRoom = useCreateRoom();
```

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
- `src/shared/lib/env.ts`의 `env`가 getter인 이유는 모듈을 가져오는 시점에 `VITE_API_BASE_URL`을 검사하면 API를 안 쓰는 화면까지 죽기 때문이다. 배포된 사이트에는 아직 이 변수가 없다. `env.apiBaseUrl`을 읽는 순간에만 던진다
- `http`는 호출자의 `signal`이 aborted면 오류를 `ApiError`로 감싸지 않고 그대로 다시 던진다. TanStack Query의 쿼리 취소가 그 오류를 보고 동작한다
- `QueryProvider`가 `ReactQueryDevtools`를 조건 없이 그리는 이유는 프로덕션 빌드에서 패키지가 빈 컴포넌트를 내보내기 때문이다. `import.meta.env.DEV` 분기를 두지 않는다

## 완료 기준

PR을 올리기 전에 게이트를 전부 통과해야 한다.

```bash
pnpm check   # 타입 검사, 빌드, 린트, 포맷 검사
```

게이트를 통과시키려고 린트 규칙을 끄거나 검사를 건너뛰지 않는다. UI를 바꿨으면 개발 서버에서 모바일 폭으로 확인한다.
