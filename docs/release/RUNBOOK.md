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

지금은 쓰는 환경 변수가 없다. 백엔드 API 주소와 웹 푸시 VAPID 공개키, 카카오 로그인 앱 키가 후보이고 백엔드 배포 방식과 함께 정한다. 도입할 때는 이렇게 한다.

- `VITE_` 접두사로 빌드 시점에 주입한다. GitHub Pages는 정적 호스팅이라 값이 번들에 박힌다
- 배포용 값은 저장소의 Actions variables에 두고 워크플로에서 주입한다
- 비밀값은 프론트엔드에 두지 않는다. VAPID 개인키와 카카오 시크릿은 백엔드에만 둔다
- `.env*` 파일은 커밋하지 않는다. `.gitignore`에는 `*.local` 규칙만 있어 `.env`가 걸리지 않으니 그때 `.env`를 추가하고 예외는 `.env.example` 하나만 둔다

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
3. 백엔드 상태. API 응답이 오는지 (연동 뒤)
4. base 경로. 자산 404가 나면 `vite.config.ts`의 `base`와 배포 경로가 맞는지 본다
5. Service Worker 캐시 (도입 뒤). 배포는 성공했는데 옛 화면이 보이면 브라우저 개발자 도구의 Application 탭에서 등록된 Service Worker와 캐시를 본다. 갱신 절차는 Service Worker를 도입할 때 여기에 적는다
