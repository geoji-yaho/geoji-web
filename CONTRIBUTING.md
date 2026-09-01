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

`pnpm install`이 lefthook Git 훅과 에이전트 룰 링크(`pnpm link:agents`)를 함께 설치한다.

## 브랜치 전략

`.agents/rules/git-workflow.md`가 정본이다. 요약하면 이렇다.

- `main`은 항상 빌드가 되어야 한다. 머지되면 GitHub Pages로 자동 배포된다
- 기능 작업은 `feature/{name}` 브랜치에서 한다 (영문 케밥 케이스)
- 머지는 머지 커밋을 유지한다 (`--no-ff`, PR은 merge commit). squash는 쓰지 않는다
- 머지 후 feature 브랜치는 삭제한다

## 커밋

커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓴다. 타입은 feat, fix, docs, style, refactor, perf, test, chore. 본문에는 왜 바꿨는지를 쓴다. 자세한 규칙과 예시는 커밋 시 템플릿(`scripts/commit-template.txt`)으로 뜬다.

Git 훅이 자동으로 돈다.

| 시점       | 검사            |
| ---------- | --------------- |
| pre-commit | 린트, 포맷 검사 |
| pre-push   | 타입 검사       |

## 완료 기준

PR을 올리기 전에 게이트를 전부 통과해야 한다.

```bash
pnpm check   # 타입 검사, 빌드, 린트, 포맷 검사 일괄 실행
```

실패한 게이트를 통과시키려고 테스트를 건너뛰거나 린트 규칙을 끄지 않는다. UI를 바꿨으면 개발 서버에서 모바일 폭과 PC 폭을 확인한다.
