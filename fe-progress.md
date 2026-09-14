# FE 백엔드 연동 진행상황

geoji-server([geoji-yaho/geoji-server](https://github.com/geoji-yaho/geoji-server)) API에 핵심 플로우를 연동한 상태다. 서버 기준 커밋은 `b38b5a1`(2026-09-12)이다.

데이터 층(`http`, `ApiError`, 토큰 공급자, `profileQueries`와 `roomQueries`, 변이 훅)은 PR #7(`feature/shared-api-layer`)이 만들었고, 이 작업은 그 위에 화면을 붙였다. 데이터 층 규칙은 `CONTRIBUTING.md`의 데이터 층 절, 환경 변수는 `docs/release/RUNBOOK.md`의 환경 변수 절이 정본이다.

## 로컬에서 돌려보기

1. `cp .env.example .env.local`로 만들고 값을 채운다. `.env.local`은 git에 잡히지 않는다

   ```
   VITE_API_BASE_URL=http://geoji-server-env.eba-wpbw3dvr.ap-northeast-2.elasticbeanstalk.com
   VITE_DEV_ACCESS_TOKEN=
   VITE_DEV_NICKNAME=
   ```

   서버를 로컬에서 띄웠다면 `VITE_API_BASE_URL`은 `http://localhost:8080`이다.

2. `VITE_DEV_ACCESS_TOKEN`에는 Supabase Auth의 access token(JWT)을 넣는다. 로그인 화면이 아직 없으니 이메일과 비밀번호로 가입된 Supabase 계정으로 직접 받는다

   ```bash
   curl -s 'https://wfovlprcxmsanfuzbfvd.supabase.co/auth/v1/token?grant_type=password' \
     -H 'apikey: <SUPABASE_ANON_KEY>' \
     -H 'Content-Type: application/json' \
     -d '{"email":"...","password":"..."}'
   ```

   응답의 `access_token`을 넣는다. anon key는 access token이 아니다. `VITE_DEV_NICKNAME`은 온보딩 때 보낼 닉네임이다. 이메일 가입 계정은 소셜 메타데이터가 없어 이 값이 없으면 서버가 400을 준다

3. `.env.local`을 바꾸면 `pnpm dev`를 다시 띄운다. Vite는 시작할 때만 env를 읽는다

토큰이 없거나 만료되면 401이 오고 앱이 `/login`으로 보낸다.

## 연동된 것

| 화면                    | 엔드포인트                          | 파일                                                                                                                    |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| S-02 온보딩 예산        | `POST /api/me`                      | `features/auth/pages/BudgetOnboardingPage.tsx`, `features/auth/hooks/useCreateProfile.ts`                               |
| S-03 홈(프로필/방 목록) | `GET /api/me`, `GET /api/rooms`     | `features/home/pages/HomePage.tsx`, `shared/api/profile.ts`, `shared/api/rooms.ts`                                      |
| S-04 방 만들기          | `POST /api/rooms`                   | `features/room/pages/RoomCreatePage.tsx`, `features/room/hooks/useCreateRoom.ts`                                        |
| S-05 방 참가            | `POST /api/rooms/join/{inviteCode}` | `features/room/pages/RoomJoinPage.tsx`, `features/room/hooks/useJoinRoom.ts`                                            |
| S-09 지출 등록          | `POST /api/expenses`                | `features/post/pages/ExpenseCreatePage.tsx`, `features/post/api/expenses.ts`, `features/post/hooks/useCreateExpense.ts` |

서버 값과 화면 모델의 대응표는 `shared/api/rooms.ts`(강도 `MILD`/`SPICY`/`HELL`와 `mild`/`spicy`/`hell`)와 `features/post/api/expenses.ts`(`quick_tap`/`purchase_check`와 돈 썼어요/살까 말까)에 있다.

## 아직 안 된 것

- **로그인**: 카카오 OAuth(Supabase Auth `signInWithOAuth`)를 아직 안 붙였다. 붙일 때는 `src/app/App.tsx`의 `setAccessTokenProvider` 등록을 Supabase 세션으로 바꾸고, 온보딩에서 `env.devNickname`을 보내는 부분을 뺀다(서버가 소셜 메타데이터로 채운다)

## 연동되지 않은 API

`API.md`(`b38b5a1`) 전체 엔드포인트에서 위 표의 6개를 뺀 나머지다.

| API.md 장              | 엔드포인트                                                                                                       | 관련 화면                                          | 왜 아직 안 붙였나                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1. 프로필              | `PUT /api/me`                                                                                                    | S-13 예산 변경                                     | 이번 범위 밖. 변이 훅 `features/me/hooks/useUpdateProfile.ts`는 PR #7에 있다             |
| 2. 거지방              | `GET /api/rooms/{roomId}`                                                                                        | S-06 방 상세, S-08 방 정보                         | 이번 범위 밖. `roomQueries.detail()`은 PR #7에 있고 화면이 아직 안 쓴다                  |
| 3. 지출 기록           | `GET /api/rooms/{roomId}/expenses?from&to`                                                                       | S-06 방 피드                                       | 응답에 재판 상태와 표 집계가 없어 `ExpenseCard`를 못 채운다. 10장 재판 API와 같이 붙인다 |
| 4. 격자 칸 댓글        | `GET/POST /api/rooms/{roomId}/expenses/{expenseId}/comments`                                                     | S-06 방 피드                                       | 방 피드가 미연동이라 같이 밀린다                                                         |
| 5. 주간 거지왕 시상식  | `GET/POST /api/rooms/{roomId}/awards`, `POST .../awards/generate`                                                | 시상식                                             | 이번 범위 밖                                                                             |
| 6. 개인 맞춤 도전 과제 | `GET .../challenges/me`, `POST .../challenges`, `POST .../challenges/{id}/accept`                                | 도전 과제                                          | 이번 범위 밖                                                                             |
| 7. 개인화 순찰 알림    | `GET .../patrol-notifications/me`, `POST .../patrol-notifications`, `POST .../patrol-notifications/{id}/respond` | 순찰 알림                                          | 이번 범위 밖                                                                             |
| 8. 하루로그            | `GET/POST /api/rooms/{roomId}/daily-logs`                                                                        | 하루로그                                           | 이번 범위 밖                                                                             |
| 9. 방 멤버(랭킹)       | `GET /api/rooms/{roomId}/members`                                                                                | S-03 방 카드 멤버 수, S-05 참가 전 정보, S-08 랭킹 | 이번 범위 밖. 붙이면 방 카드의 멤버 수도 채울 수 있다                                    |
| 10. 지출 재판          | `GET .../trial`, `POST .../votes`, `POST .../trial/judge`                                                        | S-06 방 피드 투표, S-14 재판                       | 서버가 `b38b5a1`에서 추가했다. 위키의 배심원 투표와 AI 판결에 대응한다. 다음 작업 1순위  |

## 알려진 제약

- **배포(GitHub Pages, https)에서는 서버를 못 부른다.** 배포 서버가 HTTPS가 아니라 브라우저가 mixed content로 막는다. `env.apiBaseUrl`이 요청 전에 이 상황을 잡아 이유를 담은 오류를 낸다. 백엔드가 HTTPS를 붙여야 배포에서 동작한다
- S-05 방 참가 화면의 방 정보(이름, 방장, 멤버 수, 마감, 규칙)는 샘플이다. 초대 코드로 참가 전에 방을 조회하는 API가 없다. 참여 버튼만 실제로 동작한다
- S-03 방 카드의 멤버 수와 미확인 수, 최근 활동은 응답에 없어 그리지 않는다. 요약 카드의 티어와 거지력, 이번 달 지출액, 무지출 일수는 샘플이다
- 지출 등록의 사유와 사진은 서버 필드가 없어 보내지 않는다
