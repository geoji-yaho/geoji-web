# geoji-web

떼거지의 웹 프론트엔드. 원티드 AI Championship 2026에 팀 거지야호로 출품하는 소비 절제 커뮤니티 서비스다. 백엔드는 [geoji-server](https://github.com/geoji-yaho/geoji-server)에 있다.

친구들이 내 지출을 재판한다. 사용자는 피고이고 같은 거지방 친구들은 배심원이며 AI가 판사다. 지출을 돈 썼어요(지출 후) 또는 살까 말까(지출 전)로 올리면 참여 중인 모든 거지방에 공유되고, 배심원 투표가 마감되면 AI 판사가 그 평결 위에서 형량과 판결문, 짤을 정한다. 서비스 규칙은 `docs/product/SPEC.md`, 화면은 `docs/design/DESIGN-SPEC.md`에 있다.

## 기술 스택

| 영역          | 도구                              |
| ------------- | --------------------------------- |
| 프레임워크    | React 19, TypeScript 6            |
| 빌드          | Vite 8                            |
| 스타일        | Tailwind CSS 4                    |
| 패키지 매니저 | pnpm 11 (Node 24)                 |
| 품질 도구     | ESLint 10, Prettier 3, lefthook 2 |

라우터와 상태 관리, 테스트 도구는 아직 넣지 않았다. `src/`는 app, pages, features, shared 4층이고 규칙은 `.agents/rules/folder-structure.md`에 있다.

## 시작하기

Node 24와 pnpm 11이 필요하다. 버전은 `.nvmrc`와 `package.json`의 `engines`를 따른다.

```bash
pnpm install   # 의존성 설치. Git 훅(lefthook)과 에이전트 룰 링크도 함께 설치된다
pnpm dev       # 개발 서버. http://localhost:3800
```

| 명령            | 하는 일                                                |
| --------------- | ------------------------------------------------------ |
| `pnpm dev`      | 개발 서버 실행 (포트 3800)                             |
| `pnpm build`    | 타입 검사 후 프로덕션 빌드                             |
| `pnpm preview`  | 빌드 결과물 로컬 확인                                  |
| `pnpm check`    | 게이트 일괄 실행 (타입 검사, 빌드, 린트, 포맷 검사 순) |
| `pnpm lint:fix` | ESLint 자동 수정                                       |
| `pnpm format`   | Prettier 포맷                                          |

## 작업 흐름

`main`은 배포, `develop`은 통합, `feature/{name}`은 작업 브랜치다. PR은 `develop`으로 올리고 CI가 `pnpm check`를 돌린다. `develop`을 `main`으로 머지하면 GitHub Pages로 자동 배포된다. 자세한 규칙과 커밋 형식은 [CONTRIBUTING.md](./CONTRIBUTING.md)에 있다.

- 배포 주소: https://geoji-yaho.github.io/geoji-web/
- 운영 절차: `docs/release/RUNBOOK.md`

과제 제출 마감은 2026-09-20이고 심사 기간(9/21부터 10/5까지)에 링크가 접속 불가면 심사에서 제외된다.

## 문서

- [CONTRIBUTING.md](./CONTRIBUTING.md) 개발 환경, 브랜치와 커밋, 완료 기준
- [AGENTS.md](./AGENTS.md) AI 에이전트 지침
- [docs/](./docs/) 제품, 디자인, 운영 문서. 배치 기준은 `docs/CLAUDE.md`

## 라이선스

사유 소프트웨어다. 별도 라이선스를 부여하지 않으며 무단 사용과 배포를 허용하지 않는다.
