---
description: PR을 머지하고 브랜치를 정리해주세요.
---

# Merge

CI가 통과한 feature PR을 `gh pr merge --merge`로 `main`에 머지하고 브랜치를 지운다. 머지 방식과 충돌 처리, 머지 뒤 배포는 `.agents/skills/geoji-git/SKILL.md` 머지 방식 절과 배포 절이다. `main`에 머지하면 곧 배포되므로 사용자가 요청할 때만 머지한다. 머지 후 `pnpm check`를 돌리고 `git log --oneline -5`로 결과를 확인한다.
