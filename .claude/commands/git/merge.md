---
description: PR을 머지하고 브랜치를 정리해주세요.
---

# Merge

완료된 feature 브랜치를 `develop`으로 머지하고 정리한다. `develop`을 `main`으로 머지하는 배포 머지는 사용자가 배포를 요청할 때만 한다. 브랜치 전략과 금지 패턴은 `.agents/rules/git-workflow.md`를 따른다.

## 절차

1. 완료 기준 확인. CI(`pnpm check`)가 통과했는지 본다. 미충족이면 머지하지 않고 보고한다
2. 머지 경로 결정
   - PR이 있으면 `gh pr merge --merge` (머지 커밋 유지)
   - 원격이나 PR이 없으면 `git switch develop` 후 `git merge --no-ff feature/{name}`
3. 머지 커밋 메시지는 기본 형식 유지 (`Merge branch 'feature/{name}'`)
4. 머지 후 `pnpm check` 통과 확인. 실패하면 즉시 보고한다
5. 브랜치 정리. `git branch -d feature/{name}` (원격 브랜치가 있으면 원격도 삭제)
6. `git log --oneline -5`로 결과 확인

충돌이 나면 양쪽 의미를 검토해 해소하되 판단이 어려우면 사용자에게 확인한다.
