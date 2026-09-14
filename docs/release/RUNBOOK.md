# 운영 안내서

떼거지 프론트엔드의 배포와 장애 대응, 운영 절차를 적는다.

> [!warning] 심사 기간 무중단
> 심사 기간(9/21부터 10/5까지) 중 배포 링크가 접속 불가면 심사에서 제외된다. 2026-09-20 제출과 함께 배포를 동결한다. 이 기간에는 `main` 머지를 보수적으로 하고 머지 뒤 배포 결과와 실제 접속을 반드시 확인한다.

## 배포

GitHub Pages에 배포한다. `main`이 프로덕션이고 `develop`을 `main`으로 머지하면 자동으로 배포된다.

| 항목         | 값                                                                  |
| ------------ | ------------------------------------------------------------------- |
| 프로덕션 URL | https://geoji-yaho.github.io/geoji-web/                             |
| 워크플로     | `.github/workflows/deploy.yaml` (Actions 탭의 Deploy)               |
| 트리거       | `main` 푸시, 또는 Actions 탭에서 수동 실행(workflow_dispatch)       |
| 빌드         | `pnpm build` (Vite, base 경로 `/geoji-web/`)                        |
| 게이트       | 타입 검사, 빌드, 린트, 포맷 검사. 하나라도 실패하면 배포하지 않는다 |

Deploy 워크플로는 빌드 잡에서 게이트를 돌리고 산출물을 올린 뒤 배포 잡이 GitHub Pages에 올린다. PR은 `develop`으로 올리고 CI(`.github/workflows/ci.yaml`) 통과 뒤에만 머지한다. CI는 `develop`과 `main`으로 가는 PR과 푸시에서 같은 게이트를 돈다. GitHub Pages는 정적 호스팅이라 슬립이 없고, 프론트엔드가 저절로 죽을 요인은 저장소 삭제와 워크플로 실패 정도다.

배포 뒤에는 프로덕션 URL에 접속해 화면이 뜨는지 보고, Actions 탭의 Deploy 실행이 성공했는지와 배포된 커밋이 의도한 커밋인지 본다.

BrowserRouter를 쓰므로 `/rooms/1` 같은 경로를 서버가 모른다. GitHub Pages는 없는 경로에 `404.html`을 돌려주니 워크플로가 `dist/index.html`을 `dist/404.html`로 복사한다. 그래야 새로고침과 딥링크가 앱으로 들어온다. `public/manifest.webmanifest`의 경로는 `./`로 적어 base가 바뀌어도 따라가게 했다.

글꼴은 `src/app/styles/fonts/`의 Pretendard 조각 92개를 빌드에 실어 보낸다. CDN을 거치지 않으니 외부 서비스가 죽어도 글꼴이 함께 죽지 않는다.

## 롤백

두 가지 방법이 있다. 어느 쪽이든 배포 뒤 실제 접속을 확인한다.

1. 문제 커밋을 `git revert`로 되돌려 `develop`을 거쳐 `main`에 머지한다. 배포가 자동으로 다시 돈다
2. Actions 탭에서 마지막으로 성공한 Deploy 실행을 열어 Re-run all jobs를 누른다. 그 시점의 커밋으로 다시 배포된다

## 환경 변수

| 변수                    | 쓰는 곳                                                                            | 값                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`     | `src/shared/lib/env.ts`가 읽어 `http` 요청의 기준 주소로 쓴다                      | 로컬 서버는 `http://localhost:8080`(`.env.example`), 배포된 서버는 `http://geoji-server-env.eba-wpbw3dvr.ap-northeast-2.elasticbeanstalk.com`. 배포 서버가 HTTPS가 아니라 GitHub Pages(https)에서는 부를 수 없다 |
| `VITE_DEV_ACCESS_TOKEN` | `env.devAccessToken`. `App.tsx`가 토큰 공급자로 등록해 Authorization 헤더에 붙인다 | 로컬 전용. 로그인이 붙기 전까지 Supabase access token을 직접 넣는다. 개발 서버에서만 읽으니 배포에 넣지 않는다                                                                                                   |
| `VITE_DEV_NICKNAME`     | `env.devNickname`. 온보딩 `POST /api/me`의 닉네임으로 보낸다                       | 로컬 전용. 소셜 로그인 메타데이터가 없는 이메일 계정이면 없을 때 서버가 400을 준다                                                                                                                               |

`VITE_` 접두사 변수는 빌드 시점에 번들에 박힌다. GitHub Pages는 정적 호스팅이라 배포 뒤에 바꿀 수 없고 값을 바꾸면 다시 빌드해 배포한다. Deploy 워크플로(`.github/workflows/deploy.yaml`)에는 아직 이 변수가 없다. 없어도 타입 검사와 빌드는 통과하고 앱은 뜬다. `env.apiBaseUrl`을 읽는 순간에만 던지므로 API를 부르는 화면에서만 오류가 나고 API를 안 쓰는 화면은 그대로 열린다.

프로덕션 주소가 정해지면 이렇게 한다.

1. 저장소 Settings의 Actions variables에 `VITE_API_BASE_URL`을 넣는다
2. `deploy.yaml`의 빌드 단계에 `env`로 `VITE_API_BASE_URL: ${{ vars.VITE_API_BASE_URL }}`를 붙인다. CI(`ci.yaml`)는 값이 없어도 통과하므로 붙이지 않아도 된다
3. 배포 뒤 프로덕션 URL에서 API를 부르는 화면이 실제 응답을 받는지 확인한다

- 비밀값은 프론트엔드에 두지 않는다. VAPID 개인키와 카카오 시크릿은 백엔드에만 둔다
- 로컬 값은 `.env.local`에 둔다. `.gitignore`의 `*.local` 규칙이 걸러 주고 `.env`는 걸리지 않으니 `.env`를 만들지 않는다. 커밋하는 예시는 `.env.example` 하나다
- 웹 푸시 VAPID 공개키와 카카오 로그인 앱 키는 후보이고 도입할 때 위 표에 더한다

백엔드는 슬립 없는 구성이 요건이다. 무료 플랜은 유휴 시 슬립되어 심사 기간 첫 접속이 실패할 수 있다.

## 도메인 전환

도메인은 미정이다(`../product/ROADMAP.md` 미결정 절). 커스텀 도메인을 붙이면 `/geoji-web/` 접두를 새 주소로 바꿀 곳이다.

- `vite.config.ts`의 `base`를 `/`로
- `public/manifest.webmanifest`의 `id`, `start_url`, `scope`와 아이콘 `src` 3개
- `index.html`의 `og:image` 절대 주소
- 카카오 로그인의 리다이렉트 도메인

DNS 설정과 GitHub Pages 커스텀 도메인 연결 절차는 정해지면 여기에 적는다.

## 장애가 났을 때 확인 순서

1. 프로덕션 URL 접속. 화면이 뜨는지, 흰 화면이면 브라우저 콘솔에 무엇이 찍히는지
2. Actions 탭의 Deploy 로그. 어느 게이트에서 실패했는지, 어느 커밋이 마지막으로 배포됐는지
3. 백엔드 상태. API를 부르는 화면만 오류면 브라우저 콘솔에서 `VITE_API_BASE_URL` 환경 변수가 없다는 Error인지 백엔드 응답 실패인지 가른다. 백엔드 헬스체크는 API 주소의 `/actuator/health`이고 토큰 없이 열린다
4. base 경로. 자산 404가 나면 `vite.config.ts`의 `base`와 배포 경로가 맞는지 본다
5. Service Worker 캐시 (도입 뒤). 배포는 성공했는데 옛 화면이 보이면 브라우저 개발자 도구의 Application 탭에서 등록된 Service Worker와 캐시를 본다. 갱신 절차는 Service Worker를 도입할 때 여기에 적는다
