---
description: 새 브랜치를 생성하고 전환해주세요.
---

# Branch

작업 단위에 맞는 feature 브랜치를 만들어 전환한다. 브랜치 전략과 이름 규칙은 `.agents/rules/git-workflow.md`를 따른다.

## 절차

1. `git status`로 워킹트리 상태 확인. 미커밋 변경이 있으면 커밋할지 스태시할지 사용자에게 먼저 확인한다
2. `develop`으로 이동해 최신으로 맞춘다
3. 브랜치 이름 결정. 인자로 받았으면 그대로 쓰고, 없으면 현재 작업 맥락에서 제안하고 확인받는다
4. `git switch -c feature/{name}`으로 생성하고 전환
5. `git branch --show-current`로 결과 확인

## 규칙

- 브랜치 하나에 작업 단위 하나. 성격이 다른 작업을 한 브랜치에 섞지 않는다
- `main`과 `develop`에서는 직접 작업하지 않는다
