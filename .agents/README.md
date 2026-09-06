# .agents

에이전트가 읽는 본문을 둔다. 특정 도구에 매인 형식을 쓰지 않는다.

```
.agents/
  README.md            이 파일
  rules/               룰 본문
  scripts/             본문을 도구 디렉터리에 잇는 스크립트
  skills/              스킬 본문
.claude/
  rules/               .agents/rules/*.md 로 가는 심볼릭 링크
  skills/              .agents/skills/* 로 가는 심볼릭 링크
  agents/              에이전트 정의. 도구마다 형식이 달라 링크하지 않는다
  commands/            슬래시 커맨드. 마찬가지
AGENTS.md              늘 지켜야 하는 것을 직접 적는다
CLAUDE.md              AGENTS.md 로 가는 심볼릭 링크
```

## 링크 방식

Claude Code는 `CLAUDE.md`와 `.claude/rules/**/*.md`를 읽고 `AGENTS.md`는 읽지 않는다. Codex는 `AGENTS.md`를 읽고 다른 파일을 끌어와 펼치지 못한다. 그래서 `CLAUDE.md`를 `AGENTS.md`로 가는 심볼릭 링크로 두고, 어느 도구에서나 지켜야 하는 것은 `AGENTS.md`에 짧게 적고 자세한 내용은 룰 본문에 둔다. 룰을 자동으로 읽지 않는 도구에서는 작업 전에 룰 파일을 직접 연다.

`.agents/scripts/link-agents.sh`가 룰은 파일 단위로 `.claude/rules/`에, 스킬은 디렉터리 단위로 `.claude/skills/`에 링크한다. `pnpm install`과 `pnpm link:agents`가 돌린다. `.agents/`에서 사라진 항목의 링크는 지우고, 링크 자리에 실재 파일이 있으면 멈춘다. Windows에서 관리자 권한 없이 clone하면 링크가 경로 문자열을 담은 파일로 풀리니 그때는 다시 만든다.

## 룰

룰 파일은 YAML 프론트매터로 시작한다. `description`은 필수이고 `paths`(파일 글롭 목록)는 선택이다. `paths`가 없는 룰은 세션 시작 때 늘 로드되고, 있는 룰은 그 경로의 파일을 읽을 때만 로드된다. 응답과 커밋 메시지에도 걸려야 하는 룰은 `paths`를 붙이지 않는다.

| 파일                  | 다루는 것                                                           | `paths`                        |
| --------------------- | ------------------------------------------------------------------- | ------------------------------ |
| `git-workflow.md`     | 브랜치 전략과 커밋 메시지 형식, 금지 패턴                           | 없음. 늘 로드                  |
| `folder-structure.md` | `src` 폴더 구조와 import 방향                                       | `src/**/*`                     |
| `tailwind.md`         | Tailwind 클래스 규칙. 임의값 대괄호 금지, 색은 토큰만, `cn`과 `cva` | `src/**/*.tsx`, `src/**/*.css` |

룰을 추가하려면 `.agents/rules/{이름}.md`를 만들고 `pnpm link:agents`를 돌린다. 늘 적용되는 룰이면 `AGENTS.md`에도 한 줄 적는다.

## 스킬

스킬 본문은 `.agents/skills/{이름}/SKILL.md`에 만들고 `pnpm link:agents`를 돌린다. 스킬은 요청이 스킬 설명과 맞을 때만 붙는다. 여러 단계를 밟는 절차나 작업 하나에서만 쓰는 지식은 룰 대신 스킬로 만든다.
