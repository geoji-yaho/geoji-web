---
description: 변경사항을 분석하여 커밋 컨벤션에 맞게 커밋을 생성해주세요.
---

# Commit

`git status`와 `git diff`로 변경을 읽고 논리 단위로 나눠 파일을 명시해 커밋한다. 메시지 형식과 타입, lefthook이 하는 일과 MM 함정은 `.agents/skills/geoji-git/SKILL.md` 커밋 메시지 절과 커밋 전 확인 절이다. `.agents/` 원본을 고쳤으면 `pnpm harness:sync` 뒤 생성물을 같은 커밋에 넣는다. 커밋 뒤 `git status`로 의도한 것만 들어갔는지 본다.
