---
name: geoji-git
description: 떼거지 저장소의 git 절차. 브랜치 따기, 커밋 메시지 형식과 타입, lefthook 훅이 하는 일과 MM 함정, PR 머지 조건과 머지 방식, 릴리스 PR 전후의 develop 정리. "브랜치 따줘", "커밋해", "PR 올려", "머지해", "배포해" 같은 요청과 /git:branch, /git:commit, /git:create-pr, /git:merge 커맨드에 쓴다. 금지 패턴은 git-workflow.md 룰이 갖는다.
---

# 떼거지 git 절차

규칙과 금지 패턴은 `git-workflow.md` 룰에 있다. 여기는 그 규칙을 지키는 절차와 이유다. 커밋과 푸시, PR, 머지는 사용자가 요청할 때만 한다.

## 브랜치 전략

```
main       배포. 머지되면 GitHub Pages로 자동 배포된다
  위로
develop    통합. 모든 feature PR의 base
  위로
feature/{슬러그}    작업 단위. 설정과 문서 작업도 같다
```

대회 출품작이라 hotfix와 release 브랜치는 두지 않는다. 브랜치 이름은 `feature/room-feed`처럼 영문 케밥 케이스로 짓고 원격의 최신 `develop`에서 딴다. 한 브랜치에는 한 가지 일만 담는다. 미커밋 변경이 있으면 커밋할지 스태시할지 사용자에게 먼저 확인한다.

```bash
git fetch origin develop
git switch -c feature/{슬러그} origin/develop
```

GitHub 기본 브랜치는 `main`이라 화면에서 PR을 열면 base가 `main`으로 잡힌다. `develop`으로 바꾼다. `/git:create-pr`은 `--base develop`을 명시한다.

## 커밋 메시지

```
<타입>: <제목>

본문 (선택). 왜 이 변경이 필요한지 설명

꼬리말 (선택). 관련 이슈: #123
```

예: `chore: lefthook Git 훅 파이프라인 추가`

타입은 `scripts/commit-template.txt`의 여덟이고 메시지를 비워 두고 커밋하면 그 템플릿이 편집기에 뜬다. 제목은 50자 이내의 한국어다. 제목과 본문 사이에 빈 줄을 넣고 본문은 72자마다 줄바꿈한다. 어떻게보다 무엇을 왜 했는지를 쓴다. 성격이 다른 변경(기능과 설정, 포맷)을 한 커밋에 섞지 않고 타입 정의와 구현, 테스트, 문서를 각각 나눈다. 코드를 지우는 커밋은 리뷰를 거친 뒤 만든다.

**괄호 표기(scope)를 쓰지 않는다.** 프론트엔드 둘이 쓰는 저장소라 제목만으로 무엇을 바꿨는지 구분된다.

**이모지와 한자, 가운뎃점과 화살표를 쓰지 않는다.** 길이가 아쉬워도 말로 푼다. 원격에 올라간 커밋 메시지는 고치지 못한다.

## 커밋 전 확인

lefthook이 세 자리에서 훅을 돌린다. 설정은 `lefthook.yaml`에 있다.

| 훅                 | 하는 일                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| prepare-commit-msg | 메시지가 비어 있으면 `scripts/commit-template.txt`를 넣는다                                                                                                                                                                                                  |
| pre-commit         | js와 ts 계열 파일이 스테이징되어 있으면 `pnpm run lint`를, 여기에 json과 yaml, md, css, html까지 더한 종류의 파일이 있으면 `pnpm run format:check`를 돌린다. 하네스 검사 `pnpm run harness:check`는 늘 돈다. 셋은 병렬로 돌고 merge와 rebase 중에는 건너뛴다 |
| pre-push           | `pnpm run type:check`                                                                                                                                                                                                                                        |

pre-commit과 pre-push의 명령은 저장소 전체를 본다. 내가 건드리지 않은 파일에 어긋난 것이 있어도 커밋이 막히니 그 파일을 고치는 커밋을 따로 만든다.

**한 파일에 스테이징된 변경과 스테이징되지 않은 변경이 함께 있으면 훅 처리 중 스테이징되지 않은 변경이 사라질 수 있다.** lefthook이 부분 스테이징 파일의 unstaged 변경을 잠시 숨기기 때문이다. `harness:check`의 생성물 대조도 그래서 스테이징된 원본과 비교한다. `git status --short`로 `MM`이나 `RM`으로 시작하는 줄을 먼저 확인하고 걸리는 파일이 있으면 정리한 뒤에 커밋한다. `.agents/` 원본을 고쳤으면 `pnpm harness:sync`를 돌리고 생성물(`.claude/`, `.codex/`, `AGENTS.md`)을 같은 커밋에 스테이징한다. 커밋한 뒤에도 `git status`를 다시 대조해 의도한 것만 들어갔는지 본다.

### PR 머지 조건

CI(`.github/workflows/ci.yaml`)가 PR마다 게이트 넷과 하네스 검사 `pnpm harness:check`를 돌린다. `develop`과 `main`은 CI 통과 없이 머지하지 않는다. PR 제목은 커밋과 같은 형식이고 본문은 `.github/PULL_REQUEST_TEMPLATE.md`의 절을 채운다. 검증 절에는 `pnpm check` 통과 여부를 적는다. 훅은 로컬에서 건너뛸 수 있지만 CI는 그럴 수 없어 머지 조건은 CI에 둔다.

## 머지 방식

**merge commit만 쓴다.** squash와 rebase merge를 쓰지 않는다. 작업 단위가 머지 커밋으로 묶여 이력에 남고 `develop`과 `main`의 조상 관계가 유지된다. squash로 압축하면 조상 관계가 끊겨 다음 PR마다 충돌이 새로 생기고 커밋 단위 이력도 사라진다.

`gh pr merge`를 쓸 때는 `--merge`를 명시한다. GitHub 화면에서는 Create a merge commit을 고른다. 원격이나 PR이 없으면 `git switch develop` 뒤 `git merge --no-ff feature/{슬러그}`다. 머지 후 `pnpm check`를 돌리고 feature 브랜치는 로컬과 원격에서 지운다. 충돌이 나면 양쪽 의미를 검토해 해소하고 판단이 어려우면 사용자에게 확인한다.

## 릴리스

`develop`에서 `main`으로 PR을 열어 머지한다. 사용자가 배포를 요청할 때만 한다. PR을 열기 전에 `main`을 먼저 흡수한다. 이 단계를 건너뛰면 PR 화면에서 충돌이 뜬다.

```bash
git switch develop
git fetch origin main
git merge origin/main
git push origin develop
```

릴리스 PR을 머지하면 `main`에 머지 커밋이 하나 생겨 `develop`보다 앞선다. 그대로 두면 다음 릴리스 PR에 그 커밋이 다시 끼어든다. 머지 직후 `develop`을 `main`에 맞춘다.

```bash
git switch develop
git fetch origin main
git merge --ff-only origin/main
git push origin develop
```

`main`에 머지되면 `.github/workflows/deploy.yaml`이 게이트를 다시 돌리고 GitHub Pages에 배포한다. 배포 주소와 롤백은 `docs/release/RUNBOOK.md`에 있다.
