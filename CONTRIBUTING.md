# 기여 가이드

## 개발 환경

| 도구 | 버전                              |
| ---- | --------------------------------- |
| Node | 24.x (`.nvmrc` 참고, `nvm use`)   |
| pnpm | 11.x (`corepack enable`이면 충분) |

```bash
pnpm install
pnpm dev
```

`pnpm install`이 lefthook Git 훅과 에이전트 룰 링크(`pnpm link:agents`)를 함께 설치한다. 개발 서버는 http://localhost:3800 에 뜬다.

## 브랜치 전략

`.agents/rules/git-workflow.md`가 정본이다. 세 층으로 흐른다.

| 브랜치           | 역할                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `main`           | 배포. 머지되면 GitHub Pages로 자동 배포된다. 항상 빌드가 되어야 한다                 |
| `develop`        | 통합. 모든 작업이 여기로 모인다                                                      |
| `feature/{name}` | 작업 단위. `develop`에서 분기한다. 이름은 영문 케밥 케이스 (예: `feature/room-feed`) |

PR은 `develop`으로 올리고 CI 게이트가 통과한 뒤 merge commit으로 머지한다. squash는 쓰지 않는다. 배포는 `develop`을 `main`으로 머지할 때 일어나고 머지 후 feature 브랜치는 삭제한다.

## 폴더 구조

`src/`는 app(라우터), pages(화면 14개), features(두 화면 이상에서 쓰는 기능), shared(공용) 4층이다. import는 위에서 아래로만 하고 pages끼리, features끼리는 가져오지 않는다. 화면별 폴더 이름과 폴더 안 구성은 `.agents/rules/folder-structure.md`에 있고 `src/`를 만질 때 자동으로 로드된다.

## 커밋

커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓴다. 타입은 feat, fix, docs, style, refactor, perf, test, chore. 본문에는 왜 바꿨는지를 쓴다. 자세한 규칙과 예시는 커밋 시 템플릿(`scripts/commit-template.txt`)으로 뜬다.

Git 훅이 자동으로 돈다.

| 시점               | 검사               |
| ------------------ | ------------------ |
| prepare-commit-msg | 커밋 메시지 템플릿 |
| pre-commit         | 린트, 포맷 검사    |
| pre-push           | 타입 검사          |

## 완료 기준

PR을 올리기 전에 게이트를 전부 통과해야 한다.

```bash
pnpm check   # 타입 검사, 빌드, 린트, 포맷 검사 일괄 실행
```

게이트를 통과시키려고 린트 규칙을 끄거나 검사를 건너뛰지 않는다. UI를 바꿨으면 개발 서버에서 모바일 폭으로 확인한다. 기준 폭은 360과 393 중 미결정이다.
