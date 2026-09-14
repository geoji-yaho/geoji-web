---
description: main과 develop, feature 세 브랜치. 커밋 메시지는 <타입>: <한국어 제목>. 금지 패턴 여섯. 브랜치와 커밋, PR, 머지, 릴리스 절차는 geoji-git 스킬에 있다
---

# Git 워크플로우

- `main`은 배포, `develop`은 통합이다. 둘에 직접 커밋하지 않고 `feature/{슬러그}`에서 `develop`으로 PR을 올린다. 머지는 merge commit이고 squash를 쓰지 않는다
- 커밋 메시지는 `<타입>: <제목>`이다. 제목은 50자 이내 한국어이고 타입은 `scripts/commit-template.txt`의 여덟이다. 이모지와 한자, 가운뎃점과 화살표를 쓰지 않는다
- 사용자가 "커밋해"나 `/git:commit`으로 요청할 때만 커밋하고 푸시한다

## 금지 패턴

1. `main`과 `develop` 직접 커밋, `main` 직접 푸시. 릴리스는 `develop`에서 `main`으로 PR이다
2. `git add -A`와 `git add .` 광범위 스테이징. 파일 단위로 명시한다
3. `.env`와 비밀값 파일 커밋. `.env.example`에 자리만 남긴다
4. 병합 충돌 `--ours` 일방 해소. 양쪽 의미를 검토한 뒤 해소한다
5. 강제 푸시와 `--no-verify`. 리베이스가 필요하면 `--force-with-lease`만 쓰고 `main`과 `develop`에는 쓰지 않는다
6. "WIP" 커밋을 그대로 병합. rebase로 정리한 뒤 병합한다

광범위 스테이징과 `.env` 스테이징, 훅 건너뛰기, 강제 푸시, `main` 푸시, `main`과 `develop`에서의 커밋은 PreToolUse 훅 `.agents/hooks/guard-git.sh`가 막는다. 절차와 이유, lefthook이 하는 일, 릴리스 뒤 정리는 `.agents/skills/geoji-git/SKILL.md`에 있다.
