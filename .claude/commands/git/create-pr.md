---
description: 현재 브랜치의 변경사항으로 Pull Request를 생성해주세요.
---

# Create PR

현재 feature 브랜치를 `git push -u origin HEAD`로 올리고 `gh pr create --base develop`으로 PR을 만든다. 제목은 커밋과 같은 형식이고 본문은 `.github/PULL_REQUEST_TEMPLATE.md`의 절을 채운다. 머지 조건과 릴리스 PR은 `.agents/skills/geoji-git/SKILL.md` PR 머지 조건 절과 릴리스 절이다. 원격이 없으면 PR을 만들 수 없으니 알리고 `/git:merge`의 로컬 머지를 안내한다.
