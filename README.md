# geoji-web

떼거지(친구들이 내 지출을 재판하는 소비 절제 커뮤니티) 웹 프론트엔드

백엔드는 [geoji-server](https://github.com/geoji-yaho/geoji-server)에 있고 API 규약은 그 저장소의 `API.md`다. 서비스 정의는 `docs/product/PRD.md`, 동작 규칙은 `docs/product/SPEC.md`, 화면은 `docs/design/DESIGN-SPEC.md`에 있다.

## 기술 스택

| 영역          | 도구                                           |
| ------------- | ---------------------------------------------- |
| 프레임워크    | React 19, TypeScript 6                         |
| 빌드          | Vite 8                                         |
| 라우터        | react-router 8                                 |
| 서버 상태     | TanStack Query 5                               |
| 스타일        | Tailwind CSS 4                                 |
| 클래스 유틸   | clsx, tailwind-merge, class-variance-authority |
| 애니메이션    | motion 13                                      |
| 글꼴          | Pretendard Variable (저장소에 두고 서빙)       |
| 아이콘        | lucide-react                                   |
| 패키지 매니저 | pnpm 11 (Node 24)                              |
| 품질 도구     | ESLint 10, Prettier 3, lefthook 2              |

클라이언트 상태 관리와 테스트 도구는 아직 넣지 않았다. 글꼴은 Pretendard Variable을 저장소에 두고 서빙한다. 폴더 배치와 import 경로, 스타일 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)의 코딩 컨벤션 절에 있다.

## 시작하기

Node 24와 pnpm 11이 필요하다. 버전은 `.nvmrc`와 `package.json`의 `engines`를 따른다.

```bash
pnpm install                 # 의존성 설치. Git 훅(lefthook)과 에이전트 룰 링크도 함께 설치된다
cp .env.example .env.local   # 백엔드 주소. 기본값은 로컬 geoji-server의 http://localhost:8080
pnpm dev                     # 개발 서버. http://localhost:3800
```

백엔드를 부르는 화면은 `VITE_API_BASE_URL`이 필요하다. 로컬 값은 `.env.local`에 두고 커밋하지 않는다. 배포에 넣는 방법과 변수가 없을 때 앱이 어떻게 되는지는 `docs/release/RUNBOOK.md`의 환경 변수 절에 있다.

| 명령                | 하는 일                                                |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | 개발 서버 실행 (포트 3800)                             |
| `pnpm build`        | 타입 검사 후 프로덕션 빌드                             |
| `pnpm preview`      | 빌드 결과물 로컬 확인                                  |
| `pnpm check`        | 게이트 일괄 실행. 타입 검사, 빌드, 린트, 포맷 검사 순  |
| `pnpm lint`         | ESLint 검사                                            |
| `pnpm lint:fix`     | ESLint 자동 수정                                       |
| `pnpm format`       | Prettier 포맷                                          |
| `pnpm format:check` | Prettier 검사                                          |
| `pnpm type:check`   | 타입 검사                                              |
| `pnpm link:agents`  | `.agents/`의 룰과 스킬을 `.claude/`에 링크             |
| `pnpm prepare`      | `pnpm install`이 부른다. lefthook 설치와 `link:agents` |

## 작업 흐름

`main`은 배포, `develop`은 통합, `feature/{name}`은 작업 브랜치다. PR은 `develop`으로 올리고 CI가 `pnpm check`를 돌린다. `develop`을 `main`으로 머지하면 https://geoji-yaho.github.io/geoji-web/ 으로 자동 배포된다. 심사 기간(9/21부터 10/5까지)에 이 주소가 죽으면 심사에서 제외되므로 `main`은 항상 배포 가능해야 한다. 브랜치와 커밋 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md), 배포와 장애 대응은 `docs/release/RUNBOOK.md`에 있다.

## 문서

- [CONTRIBUTING.md](./CONTRIBUTING.md) 개발 환경, 브랜치와 커밋 흐름, 완료 기준
- [AGENTS.md](./AGENTS.md) AI 에이전트 지침
- [docs/](./docs/) 제품, 디자인, 운영 문서. 배치 기준은 `docs/CLAUDE.md`

## 라이선스

사유 소프트웨어다. 별도 라이선스를 부여하지 않으며 무단 사용과 배포를 허용하지 않는다.
