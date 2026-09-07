---
description: 현재 브랜치의 변경사항으로 Pull Request를 생성해주세요.
---

# Create PR

현재 feature 브랜치의 변경사항으로 `develop`을 향한 Pull Request를 만든다.

## 절차

1. `git status`와 `git log develop..HEAD --oneline`으로 브랜치의 변경과 커밋 목록 확인. 무관한 변경이 섞여 있으면 PR 전에 분리한다
2. 원격 저장소 확인 (`git remote -v`). 원격이 없으면 PR을 만들 수 없으니 사용자에게 알리고 로컬 머지(`/git:merge`)를 안내한 뒤 종료
3. 현재 브랜치를 push (`git push -u origin HEAD`)
4. `gh pr create --base develop`으로 PR 생성

## 작성 규칙

- 제목은 커밋과 같은 형식 (`<타입>: <제목>`, 한국어)
- 본문은 `.github/PULL_REQUEST_TEMPLATE.md`의 절을 채운다. 검증 절에는 `pnpm check` 통과 여부를 적는다
- 이모지를 쓰지 않는다
