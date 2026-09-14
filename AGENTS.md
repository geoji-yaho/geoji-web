# AGENTS.md

떼거지(친구들이 내 지출을 재판하는 소비 절제 커뮤니티)의 웹 프론트엔드. 원티드 AI Championship 2026 출품작이고 제출 마감은 2026-09-20이다. 심사 기간(9/21부터 10/5까지) 중 배포 링크가 죽으면 심사에서 제외되므로 `main`은 항상 배포 가능해야 한다.

## 규칙

- 문서와 주석, 커밋 메시지, 응답은 한국어. 코드 식별자는 영어
- 구현 후 `pnpm check`(타입 검사, 빌드, 린트, 포맷 검사) 전부 통과해야 완료. lefthook 훅이 커밋과 푸시 때 같은 검사를 저장소 전체에 돌린다. 커밋 때는 하네스 검사 `pnpm harness:check`도 함께 돈다. 이 넷과 `pnpm harness:check`를 CI가 PR마다 돌린다
- 위키에 없는 기능은 만들지 않고 미결정 값(`docs/product/ROADMAP.md` 미결정 절)을 코드에 박아야 하면 먼저 묻는다

## 룰

`.agents/rules/`가 본문이다. `paths`가 있는 룰은 그 패턴의 파일을 읽을 때 실리고 없는 룰은 세션 시작 때 실린다. 룰을 자동으로 읽지 않는 도구는 작업 전에 해당 파일을 직접 연다. 아래 목록은 각 룰의 `description`에서 생성된다.

<!-- agents-sync:rules:begin -->

<!-- 이 표식 사이는 .agents/scripts/agents-sync.mjs 가 .agents/rules/ 의 description 에서 만든다. 손으로 고치지 않는다 -->

- `api.md`. 데이터 층 규칙. 요청은 shared/api/http만 쓰고 엔티티 모듈은 쓰는 feature 수로 자리를 가른다. 쿼리 키는 엔티티로 시작하는 계층, 변이는 feature hooks의 useMutation 훅, 401 밖은 error.kind로 분기하고 아직 없는 리소스는 queryFn에서 null로 바꾼다
- `folder-structure.md`. src는 app, features, shared 3층이고 위에서 아래로만 가져온다. 같은 층 안은 상대 경로, 층을 넘으면 @/. index.ts는 feature 공개 API에만 두고 export *를 쓰지 않는다. 컴포넌트 파일은 PascalCase, 그 밖은 주 export를 따른다
- `git-workflow.md`. main과 develop, feature 세 브랜치. 커밋 메시지는 <타입>: <한국어 제목>. 금지 패턴 여섯. 브랜치와 커밋, PR, 머지, 릴리스 절차는 geoji-git 스킬에 있다
- `tailwind.md`. 대괄호 임의값을 쓰지 않는다. 색은 src/app/styles/theme/colors.css 토큰만 쓰고 dark: 변형이 없다. 클래스는 cn과 cva로 합치고 CSS에 주석을 쓰지 않는다
- `typescript.md`. 이 저장소의 TypeScript와 주석 규칙. 추론되는 반환 타입을 적지 않는 것과 예외 둘, TypeScript와 React 생태계가 쓰는 동사와 접두사, 접미사로 짓는 이름, 코드에 주석을 적지 않고 지시문만 남기는 것, as 단언과 이름 없는 숫자. 전역 룰과 어긋나면 여기가 이긴다

<!-- agents-sync:rules:end -->

## 하네스

둘이다. 개발은 `.agents/skills/geoji-dev`, QA는 `.agents/skills/geoji-qa`다. 화면이나 기능을 만들거나 API를 붙이기 전에 dev를 읽는다. qa는 `docs/release/TC.md`의 테스트 케이스를 화면별로 돌린다. git 절차는 `.agents/skills/geoji-git`, `review-protocol`은 리뷰어에 미리 실리는 공통 규약이라 사용자가 꺼내지 않는다. 스킬은 이 넷이고 어떤 스킬이 있는지는 이 절이 정본이다.

<!-- agents-sync:agents:begin -->

<!-- 이 표식 사이는 .agents/scripts/agents-sync.mjs 가 .agents/agents/ 에서 만든다. 손으로 고치지 않는다 -->

에이전트 12개의 원본이 `.agents/agents/` 아래 폴더 3개에 있다. `build/`에 `data-builder`, `plan-architect`, `ui-builder`, `qa/`에 `browser-runner`, `qa-verifier`, `tc-author`, `review/`에 `review-data`, `review-router`, `review-screen`, `review-structure`, `review-tailwind`, `review-typescript`다.

<!-- agents-sync:agents:end -->

`build/`는 계획과 구현, `review/`는 룰을 하나씩 소유하는 리뷰어, `qa/`는 검증과 TC 작성, 브라우저 실행이다. **전부 부르지 않는다.** 바뀐 파일이 리뷰어를 정하고 한두 파일 고치는 일에는 아무도 부르지 않는다. 리뷰어는 만들기 전에 자문으로도 부른다.

```bash
bash .agents/scripts/check-conventions.sh
```

룰에 적힌 grep 검사를 한 번에 돌린다. `pnpm harness:check`가 이것과 생성물 대조, 회귀 테스트를 함께 돌리고 걸리면 커밋과 CI가 막는다. 원본과 생성물의 관계는 `.agents/README.md`에 있다.

## 기준 문서

기능과 화면의 정본은 팀 위키다. 저장소의 `docs/`는 그 요약이고 배치 기준은 `docs/README.md`에 있다. 동작 규칙은 `docs/product/SPEC.md`, 화면은 `docs/design/DESIGN-SPEC.md`, 디자인 토큰은 `docs/design/DESIGN.md`를 본다. 위키 문서끼리 어긋나면 화면 구성 명세, MVP 스펙, 서비스 설계, AI 에이전트 구조, 결정 로그 순서로 앞 문서가 이긴다.

## 자주 틀리는 것

- 서비스명은 떼거지다. 거지방은 방 단위 명칭, 거지야호는 팀명
- 판결 결과는 유죄, 무죄, 동의, 기각, 각하 5종이고 도장으로 표현한다. `src/shared/domain/verdict.ts`의 `Verdict`가 이 5종이다. 위키와 코드가 어긋나는 것은 `docs/product/SPEC.md`의 확인 필요 절
- 하단 탭바는 없다. 홈에서 들어가는 2단계 구조이고 모든 화면이 고유 URL을 가진다
- 개발 서버는 `pnpm dev`, 포트 3800
