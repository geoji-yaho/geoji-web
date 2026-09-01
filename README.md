# geoji-web

거지방 AI 총무의 웹 프론트엔드. 원티드 AI Championship 2026에 팀 거지야호로 출품하는 무지출 챌린지 서비스다.

지출을 자진 신고하면 AI 총무가 판결을 내리고 친구들의 반응이 피드에 쌓인다. 판결은 승인과 기각, 칭송 세 가지다. 무지출 인증은 판결 없이 바로 칭송받는다. 주간 랭킹은 무지출 랭킹과 거지왕 랭킹 두 축으로 집계한다.

백엔드는 [geoji-server](https://github.com/geoji-yaho/geoji-server)에 있다.

## 기술 스택

| 영역          | 도구                              |
| ------------- | --------------------------------- |
| 프레임워크    | React 19, TypeScript 6            |
| 빌드          | Vite 8                            |
| 스타일        | Tailwind CSS 4                    |
| 패키지 매니저 | pnpm 11 (Node 24)                 |
| 품질 도구     | ESLint 10, Prettier 3, lefthook 2 |

## 시작하기

Node 24와 pnpm 11이 필요하다. 버전은 `.nvmrc`와 `package.json`의 `engines`를 따른다.

```bash
pnpm install   # 의존성 설치. Git 훅(lefthook)도 함께 설치된다
pnpm dev       # 개발 서버. http://localhost:3800
```

## 스크립트

| 명령              | 하는 일                                        |
| ----------------- | ---------------------------------------------- |
| `pnpm dev`        | 개발 서버 실행 (포트 3800)                     |
| `pnpm build`      | 타입 검사 후 프로덕션 빌드                     |
| `pnpm preview`    | 빌드 결과물 로컬 확인                          |
| `pnpm check`      | 게이트 일괄 실행 (타입 검사, 빌드, 린트, 포맷) |
| `pnpm lint`       | ESLint 검사 (`lint:fix`는 자동 수정)           |
| `pnpm format`     | Prettier 포맷 (`format:check`는 검사만)        |
| `pnpm type:check` | TypeScript 타입 검사                           |

Git 훅이 커밋 전에 린트와 포맷 검사를, 푸시 전에 타입 검사를 돌린다.

## 배포

`main`에 머지되면 GitHub Actions가 GitHub Pages로 배포한다.

- 주소: https://geoji-yaho.github.io/geoji-web/
- 워크플로: `.github/workflows/deploy.yaml` (배포 전 게이트 전체 재실행)

심사 기간(2026-09-21부터 10-05까지) 중 링크가 접속 불가면 심사에서 제외된다. `main`은 항상 배포 가능한 상태를 유지한다.

## 문서

- 기여 방법과 브랜치 전략: [CONTRIBUTING.md](./CONTRIBUTING.md)
- AI 에이전트 지침: [AGENTS.md](./AGENTS.md)

## 라이선스

사유 소프트웨어다. 별도 라이선스를 부여하지 않으며 무단 사용과 배포를 허용하지 않는다.
