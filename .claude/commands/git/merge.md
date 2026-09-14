---
description: PR을 머지하고 브랜치를 정리해주세요.
---

# Merge

CI가 통과한 feature PR을 `gh pr merge --merge`로 `develop`에 머지하고 브랜치를 지운다. 원격이나 PR이 없으면 `git switch develop` 뒤 `git merge --no-ff feature/{슬러그}`다. 머지 방식과 충돌 처리, `develop`을 `main`으로 올리는 릴리스는 `.agents/skills/geoji-git/SKILL.md` 머지 방식 절과 릴리스 절이다. 릴리스 머지는 사용자가 배포를 요청할 때만 한다. 머지 후 `pnpm check`를 돌리고 `git log --oneline -5`로 결과를 확인한다.
