# AGENTS.md

떼거지(친구들이 내 지출을 재판하는 소비 절제 커뮤니티)의 웹 프론트엔드. 원티드 AI Championship 2026 출품작이고 제출 마감은 2026-09-20이다. 심사 기간(9/21부터 10/5까지) 중 배포 링크가 죽으면 심사에서 제외되므로 `main`은 항상 배포 가능해야 한다.

## 규칙

- 문서와 주석, 커밋 메시지, 응답은 한국어. 코드 식별자는 영어
- Git: `.agents/rules/git-workflow.md`. main은 배포, develop은 통합, feature/{name}은 작업. PR은 develop으로, merge commit
- `src/` 배치와 import 방향: `.agents/rules/folder-structure.md`. app, features, shared 3층이고 위에서 아래로만 가져온다. import 경로는 같은 층 안이면 상대 경로, 층을 넘으면 `@/`
- Tailwind와 CSS: `.agents/rules/tailwind.md`. 대괄호 임의값 금지, 색은 `src/app/styles/theme/colors.css` 토큰만, CSS에 주석을 쓰지 않는다
- 구현 후 `pnpm check`(타입 검사, 빌드, 린트, 포맷 검사) 전부 통과해야 완료. 위키에 없는 기능은 만들지 않고 미결정 값(`docs/product/ROADMAP.md` 미결정 절)을 코드에 박아야 하면 먼저 묻는다

## 하네스

둘이다. 개발은 `.agents/skills/geoji-dev`, QA는 `.agents/skills/geoji-qa`다. 화면이나 기능을 만들거나 API를 붙이기 전에 dev를 읽는다. qa는 `docs/release/TC.md`의 테스트 케이스를 화면별로 돌린다. `review-protocol`은 리뷰어에 미리 실리는 공통 규약이라 사용자가 꺼내지 않는다. 스킬은 이 셋이고 어떤 스킬이 있는지는 이 절이 정본이다.

에이전트 열둘이 `.claude/agents/` 아래 세 폴더에 있다. `build/`에 `plan-architect`와 `data-builder`, `ui-builder`, `review/`에 룰을 하나씩 소유하는 리뷰어 여섯(`structure`, `typescript`, `tailwind`, `screen`, `data`, `router`), `qa/`에 `qa-verifier`와 `tc-author`, `browser-runner`다. **전부 부르지 않는다.** 바뀐 파일이 리뷰어를 정하고 한두 파일 고치는 일에는 아무도 부르지 않는다. 리뷰어는 만들기 전에 자문으로도 부른다.

```bash
bash .agents/scripts/check-conventions.sh
```

룰에 적힌 grep 검사를 한 번에 돌린다. 막는 검사에 걸리면 Stop 훅이 응답을 끝내지 못하게 한다. 훅 설정은 `.claude/settings.json`이다.

## 기준 문서

기능과 화면의 정본은 팀 위키다. 저장소의 `docs/`는 그 요약이고 배치 기준은 `docs/README.md`에 있다. 동작 규칙은 `docs/product/SPEC.md`, 화면은 `docs/design/DESIGN-SPEC.md`, 디자인 토큰은 `docs/design/DESIGN.md`를 본다. 위키 문서끼리 어긋나면 화면 구성 명세, MVP 스펙, 서비스 설계, AI 에이전트 구조, 결정 로그 순서로 앞 문서가 이긴다.

## 자주 틀리는 것

- 서비스명은 떼거지다. 거지방은 방 단위 명칭, 거지야호는 팀명
- 판결 결과는 유죄, 무죄, 동의, 기각, 각하 5종이고 도장으로 표현한다. `src/shared/types/verdict.ts`의 `Verdict`가 이 5종이다. 공통 컴포넌트(`src/shared/components/`)와 위키가 어긋나는 것은 `docs/product/SPEC.md`의 확인 필요 절
- 하단 탭바는 없다. 홈에서 들어가는 2단계 구조이고 모든 화면이 고유 URL을 가진다
- 개발 서버는 `pnpm dev`, 포트 3800
