# 게이트와 실물 확인

`geoji-qa-verifier`가 읽는다.

## 게이트

```bash
pnpm check
```

네 단계를 순서대로 돈다. 앞이 실패하면 뒤는 돌지 않는다. 출력의 마지막 실패를 전부라고 보고하지 않는다.

| 단계      | 명령                   | 실패하면                                                                 |
| --------- | ---------------------- | ------------------------------------------------------------------------ |
| 타입 검사 | `tsc -b --noEmit`      | 고치지 않는다. 무엇이 왜 실패했는지 적어 넘긴다                          |
| 빌드      | `tsc -b && vite build` | 고치지 않는다. 타입이 통과했는데 빌드가 깨지면 import 경로나 자산 경로다 |
| 린트      | `eslint .`             | `pnpm lint:fix`로 고쳐지는 것만 고친다. 규칙을 끄지 않는다               |
| 포맷 검사 | `prettier --check .`   | `pnpm format`으로 고친다                                                 |

한 단계만 다시 보고 싶으면 따로 돌린다.

```bash
pnpm type:check
pnpm lint
pnpm format:check
```

**게이트를 치우지 않는다.** 린트 규칙을 끄거나 타입을 `any`로 넓혀 통과시키는 것은 통과가 아니다. 게이트를 치운 것이다.

같은 단계가 세 번 반복 실패하면 멈춘다. 원인이 설계에 있다는 뜻이다. 네 번째도 같은 방법으로 실패한다.

## 개발 서버

포트는 3800이다.

```bash
# 이미 떠 있는지 본다
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3800/ 2>/dev/null || echo "없음"
```

떠 있으면 그대로 쓰고 끝나도 내리지 않는다. 사용자가 띄운 것일 수 있다.

없으면 백그라운드로 띄우고 응답할 때까지 기다린다. `sleep`을 그냥 부르지 말고 조건을 걸어 기다린다.

```bash
until curl -s -o /dev/null http://localhost:3800/; do sleep 1; done
```

자기가 띄운 서버는 확인이 끝나면 내린다.

Vite 개발 서버는 타입 오류가 있어도 뜬다. 게이트의 타입 검사가 실패해도 화면은 볼 수 있다. 빌드가 깨져 서버가 안 뜨는 경우만 브라우저 확인을 건너뛴다.

## 브라우저

필요한 도구를 한 번의 호출로 모두 부른다.

```
ToolSearch: select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__read_console_messages,mcp__claude-in-chrome__resize_window,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp
```

`tabs_context_mcp`를 먼저 부른다. 사용자가 쓰던 탭을 재사용하지 않고 새 탭을 만든다. 끝나면 자기가 만든 탭을 닫는다.

### 확인 순서

**1. 화면을 연다.** 명세의 배치 항목이 실제로 보이는지 본다. DOM에 있는 것과 눈에 보이는 것은 다르다. 색 토큰이 빠지면 요소는 있는데 배경과 글자가 같은 색이 된다. `read_page`로 구조를 보고 `computer`로 실제 화면을 본다.

**2. 콘솔을 읽는다.**

```
read_console_messages(pattern: "Warning|Error|Failed")
```

React 경고를 그냥 두지 않는다. `key` 누락, 제어와 비제어 전환, 없는 prop 전달이 자주 나온다.

**3. 폭을 바꾼다.** 360과 393에서 가로 스크롤이 생기는지 본다. 화면 폭은 아직 미결정이라 둘 다 봐야 한다.

```
resize_window(width: 360, height: 780)
resize_window(width: 393, height: 852)
```

**4. 상태를 본다.** 명세에 상태가 여럿이면 각각 확인한다. 빈 목록, 로딩, 오류, 투표 중과 판결 완료, 비활성. 라우터가 없어 화면에 직접 못 가면 `src/app/App.tsx`의 컴포넌트 카탈로그에서 본다.

### 다이얼로그를 부르지 않는다

`alert`와 `confirm`, `prompt`는 브라우저를 멈추게 하고 확장이 다음 명령을 못 받는다. 그런 것을 부를 수 있는 버튼을 누르지 않는다. 실수로 띄웠으면 사용자가 직접 닫아야 한다고 알린다.

### 막히면

브라우저 도구가 두세 번 실패하거나 응답이 없으면 더 시도하지 않는다. 무엇을 시도했고 어디서 막혔는지 적어 넘긴다. 확인하지 못한 것을 통과로 적지 않는다.
