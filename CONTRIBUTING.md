# 기여 가이드

## 개발 환경

Node 24(`.nvmrc`)와 pnpm 11(`corepack enable`)이 필요하다. `pnpm install`이 의존성과 함께 lefthook Git 훅과 에이전트 룰 링크를 설치한다. 개발 서버는 `pnpm dev`로 띄우고 http://localhost:3800 에 뜬다. 나머지 명령은 [README.md](./README.md)에 있다.

## 브랜치와 커밋 흐름

`develop`에서 `feature/{name}`을 따서 작업한다. 커밋 메시지는 `<타입>: <제목>` 형식의 한국어로 쓰고 본문에는 왜 바꿨는지를 적는다. 커밋할 때 lefthook이 메시지 템플릿을 띄우고 린트와 포맷 검사를 돌리며 푸시 전에 타입 검사를 돌린다. PR은 `develop`으로 올리고 CI가 통과하면 merge commit으로 머지한 뒤 feature 브랜치를 지운다. 배포는 `develop`을 `main`으로 머지할 때 일어난다. 브랜치 이름과 커밋 타입, 금지 패턴은 `.agents/rules/git-workflow.md`에 있다.

## 완료 기준

PR을 올리기 전에 게이트를 전부 통과해야 한다.

```bash
pnpm check   # 타입 검사, 빌드, 린트, 포맷 검사
```

게이트를 통과시키려고 린트 규칙을 끄거나 검사를 건너뛰지 않는다. `src/` 배치는 `.agents/rules/folder-structure.md`, Tailwind 클래스는 `.agents/rules/tailwind.md`를 따르고 둘 다 `src/`를 만질 때 자동으로 로드된다. UI를 바꿨으면 개발 서버에서 모바일 폭으로 확인한다.
