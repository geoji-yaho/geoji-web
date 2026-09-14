# 기여 가이드

## 개발 환경

Node 24(`.nvmrc`)와 pnpm 11(`corepack enable`)이 필요하다. `pnpm install`이 의존성과 함께 lefthook Git 훅을 설치하고 하네스 생성물(`.claude/`, `.codex/`, `AGENTS.md` 목록)을 갱신한다. 개발 서버는 `pnpm dev`로 띄우고 http://localhost:3800 에 뜬다. 나머지 명령은 [README.md](./README.md)에 있다.

## 브랜치와 커밋 흐름

`develop`에서 `feature/{name}`을 따서 작업한다. 커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓰고 본문에는 왜 바꿨는지를 적는다. 커밋할 때 lefthook이 메시지 템플릿을 띄우고 린트와 포맷 검사, 하네스 검사를 돌리며 푸시 전에 타입 검사를 돌린다. PR은 `develop`으로 올리고 CI가 통과하면 merge commit으로 머지한 뒤 feature 브랜치를 지운다. 배포는 `develop`을 `main`으로 머지할 때 일어난다. 금지 패턴은 `.agents/rules/git-workflow.md`, 브랜치와 커밋, PR, 머지, 릴리스 절차는 `.agents/skills/geoji-git/SKILL.md`에 있다.

## 코딩 컨벤션

정본은 `.agents/rules/`다. 폴더 구조와 import 경로, Tailwind, 데이터 층, TypeScript와 주석 룰이 있고 어느 룰이 무엇을 다루는지는 `AGENTS.md`의 룰 목록에 있다. `src/`를 만질 때 에이전트에 자동으로 실린다. 아래는 룰이 담지 않는 둘이다. 데이터 층 파일이 하는 일과 코드에 주석 대신 남겨 둔 근거다.

### 데이터 층 파일

서버 상태는 TanStack Query 5가 맡고 요청은 `src/shared/api/http.ts`의 `http`가 브라우저 `fetch`로 보낸다. 백엔드 규약은 geoji-server 저장소의 `API.md`다. 기준 주소는 `VITE_API_BASE_URL` 환경 변수에서 오고 로컬 설정은 [README.md](./README.md)의 시작하기 절에 있다. 규칙은 `.agents/rules/api.md`에 있다.

| 파일                                     | 하는 일                                                                                                                                                                                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/shared/api/http.ts`                 | `http.get`, `post`, `put`, `delete`. 쿼리 스트링과 JSON 바디, Authorization 헤더, 10초 타임아웃을 붙이고 실패는 `ApiError`로 낸다                                                                                                                     |
| `src/shared/api/api-error.ts`            | `ApiError`와 `isApiError`. `kind`는 badRequest, unauthorized, forbidden, notFound, conflict, server, network, timeout 8종                                                                                                                             |
| `src/shared/api/auth-token.ts`           | `setAccessTokenProvider`와 `getAccessToken`. 등록한 공급자가 없으면 Authorization 헤더 없이 요청한다. `App.tsx`가 등록한 공급자는 Supabase 세션의 `access_token`을 먼저 보고 없을 때 개발용 토큰(`env.devAccessToken`)으로 떨어진다                   |
| `src/shared/api/profile.ts`, `rooms.ts`  | 엔티티 모듈. 응답 타입과 요청 함수, `queryOptions` 팩토리(`profileQueries`, `roomQueries`)                                                                                                                                                            |
| `src/shared/api/expenses.ts`             | 지출 엔티티. `createExpense`, 방 기간 조회 `fetchRoomExpenses`, 단건 조회 `fetchRoomExpense`(단건 API가 없어 최근 90일 목록에서 id로 찾는다), `expenseQueries`, 게시물 타입 대응표                                                                    |
| `src/shared/api/trials.ts`               | 재판 엔티티. `fetchTrial`(살까 말까 지출은 400이라 `null`), `castVote`, `judgeTrial`, `trialQueries`, 판결과 형량 대응표. `Trial`에서 나오는 파생 계산 `voteCount`와 `verdictFromTrial`, `headlineFromVerdictText`, 정족수 `TRIAL_QUORUM`도 여기 있다 |
| `src/shared/api/members.ts`              | 방 멤버 엔티티. `fetchRoomMembers`, `memberQueries`, 멤버 도우미 `findMember`와 `memberName`, `memberTier`                                                                                                                                            |
| `src/shared/api/comments.ts`             | 댓글 엔티티. `fetchComments`, `createComment`, `commentQueries`                                                                                                                                                                                       |
| `src/shared/domain/score.ts`             | 거지력 산식. `calculateDebtScore`와 경과일 기준선 `baselineSpend`. 지금 계산하는 것은 예산 준수와 판결 둘뿐이다(`docs/product/SPEC.md` 확인 필요 절)                                                                                                  |
| `src/shared/utils/date.ts`               | KST 기준 기간과 시간 문구. `kstCalendar`, `monthRange`, `recentRange`, `formatRelativeTime`, `formatRemaining`, `isPast`                                                                                                                              |
| `src/shared/lib/supabase.ts`             | `getSupabase()`. 처음 부를 때 클라이언트를 만들어 재사용한다                                                                                                                                                                                          |
| `src/shared/hooks/useSession.ts`         | 모듈 스코프 세션 저장소를 `useSyncExternalStore`로 감싼 `useSession()`. `{ session, isLoading }`을 준다                                                                                                                                               |
| `src/shared/hooks/useSignOut.ts`         | 로그아웃 변이. 세션을 지우고 `queryClient.clear()` 뒤 `/login`으로 보낸다. auth feature가 아니라 shared에 있어 me feature도 쓴다                                                                                                                      |
| `src/shared/constants/routes.ts`         | 판결 화면 경로 조립. `verdictPath`, `verdictCardPath`, `votePath`. 라우트 정의는 `app/router/routes.tsx`이고 이 파일은 그 주소를 만들기만 한다                                                                                                        |
| `src/shared/hooks/useCreateComment.ts`   | 댓글 작성 변이. 성공하면 그 지출의 댓글 목록을 무효화한다. 방 피드와 판결 결과가 같이 쓴다                                                                                                                                                            |
| `src/shared/hooks/useMyMonthStats.ts`    | 프로필과 방 목록, 방별 이번 달 지출, 내 지출의 재판을 합쳐 이번 달 지출액과 거지력, 티어, 판결 이력을 계산한다. 홈과 마이페이지가 같이 쓴다                                                                                                           |
| `src/shared/lib/platform.ts`             | `shareContent`, `downloadDataUrl`, `copyText`. `navigator.share`가 없거나 거부되면 링크를 클립보드에 복사하고 결과만 돌려준다                                                                                                                         |
| `src/shared/components/CommentSheet.tsx` | 댓글 바텀시트. 목록과 입력을 그리고 방 피드와 판결 결과가 같이 쓴다                                                                                                                                                                                   |
| `src/shared/lib/env.ts`                  | `env.apiBaseUrl`. 읽는 순간 `VITE_API_BASE_URL`을 확인하고 없거나 https 페이지에서 http 주소면 오류를 낸다. `env.supabaseUrl`과 `env.supabaseAnonKey`도 같은 모양이다. `env.devAccessToken`과 `env.devNickname`은 개발 서버에서만 값이 있다           |
| `src/shared/lib/query-client.ts`         | `createQueryClient`. 쿼리 기본 옵션과 재시도 규칙, 401이면 `onUnauthorized`                                                                                                                                                                           |
| `src/app/providers/QueryProvider.tsx`    | `QueryClientProvider`와 devtools. 401이면 `/login`으로 보낸다                                                                                                                                                                                         |

화면에서는 이렇게 쓴다.

```tsx
const { data: profile, isPending } = useQuery(profileQueries.me());
const needsOnboarding = profile === null;

const rooms = useQuery(roomQueries.list());
const createRoom = useCreateRoom();
```

### 주석 대신 남겨 둔 근거

코드에 주석을 적지 않는다. 디자인 토큰의 용도와 값 근거는 `docs/design/DESIGN.md`, 동작 규칙은 `docs/product/SPEC.md`에 있고 그 밖의 근거는 여기 모은다.

- cva의 boolean 변형은 `VariantProps`에서 `boolean | null | undefined`가 된다. 그 값을 `aria-pressed`처럼 `null`을 받지 않는 자리에 넘기려면 `& { selected?: boolean }`로 좁혀야 한다. `Chip`이 그 경우다
- `light-dark()`로 선언한 색은 `getPropertyValue`로 읽으면 함수 문자열이 나온다. `theme-color` meta는 색을 JS로 읽지 않고 `index.html`의 meta 두 개 가운데 어느 것을 살릴지만 `media` 속성으로 정한다
- `index.html`의 테마 초기화 스크립트는 스타일 적용 전에 `data-theme`을 정해야 하므로 인라인이다. 저장 키는 `src/shared/lib/theme-store.ts`의 `STORAGE_KEY`와 같아야 한다
- `AppLayout`이 `useOutlet()`을 쓰는 이유는 `Outlet`을 직접 쓰면 나가는 화면도 새 화면을 그려 전환 중 두 화면이 같아지기 때문이다
- `stamp-sound.ts`의 `primeStampSound`는 사용자 제스처 핸들러 안에서 먼저 불러야 한다. `playStampSound`는 애니메이션 프레임에서 불려 제스처가 아니고, 그때 AudioContext를 처음 만들면 무음이 된다
- `pressable` 유틸리티가 색 전환까지 맡는다. `transition-colors`를 같이 쓰면 그쪽이 뒤에 나와 transform 전환을 덮는다
- `src/shared/lib/env.ts`의 `env`가 getter인 이유는 모듈을 가져오는 시점에 `VITE_API_BASE_URL`을 검사하면 API를 안 쓰는 화면까지 죽기 때문이다. `env.apiBaseUrl`을 읽는 순간에만 오류를 낸다
- `http`는 호출자의 `signal`이 aborted면 오류를 `ApiError`로 감싸지 않고 그대로 다시 낸다. TanStack Query의 쿼리 취소가 그 오류를 보고 동작한다
- `QueryProvider`가 `ReactQueryDevtools`를 조건 없이 그리는 이유는 프로덕션 빌드에서 패키지가 빈 컴포넌트를 내보내기 때문이다. `import.meta.env.DEV` 분기를 두지 않는다
- `getSupabase`가 클라이언트를 모듈 로드 시점이 아니라 처음 부를 때 만드는 이유는 `env.supabaseUrl`이 getter라 읽는 순간 오류를 내기 때문이다. 로그인을 쓰지 않는 화면은 Supabase 변수가 없어도 열린다
- `useSession`이 `useSyncExternalStore`를 쓰는 이유는 세션이 React 밖에서 바뀌기 때문이다. `onAuthStateChange`가 모듈 스코프 저장소를 갱신하고 구독 중인 화면이 함께 다시 그려진다. `theme-store.ts`와 같은 모양이다
- `fetchTrial`이 400을 `null`로 바꾸는 이유는 살까 말까 지출이 재판 대상이 아니어서 서버가 400을 주기 때문이다. 아직 없는 리소스를 `null`로 바꾸는 것과 같게 다뤄 화면이 재판 없는 카드를 그린다. 그 밖의 400은 그대로 낸다
- `expenseQueries.listByRoom`이 기간을 `{ from, to }`로 풀어 받는 이유는 `@tanstack/query/exhaustive-deps`가 queryFn 안의 객체를 키에서 찾지 못하기 때문이다. 키는 `from`과 `to` 문자열로 둔다
- `monthRange`의 끝이 다음 달 1일 00:00이 아니라 `23:59:59.999`인 이유는 서버 조회가 양끝을 포함하는 `between`이기 때문이다. 00:00을 그대로 넘기면 그 순간의 지출이 두 달에 걸린다
- `useCastVote`가 이어 부르는 판결 요청의 실패를 오류로 올리지 않는 이유는 투표가 이미 성공했기 때문이다. 재판 캐시만 무효화하고 화면은 방으로 돌아간다
- `VerdictCardPage`가 카드를 감싼 `div`를 캡처하는 이유는 `Card`가 `ref`를 받지 않기 때문이다. 그림자는 캡처 범위 밖이라 PNG에 들어가지 않는다

## 완료 기준

PR을 올리기 전에 `pnpm check`(타입 검사, 빌드, 린트, 포맷 검사)를 전부 통과해야 한다. 게이트를 통과시키려고 린트 규칙을 끄거나 검사를 건너뛰지 않는다. UI를 바꿨으면 개발 서버에서 모바일 폭으로 확인한다.
