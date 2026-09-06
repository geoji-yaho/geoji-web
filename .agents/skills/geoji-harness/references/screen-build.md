# 화면을 조립하는 순서

`geoji-architect`와 `geoji-implementer`가 읽는다. 명세와 디자인 값은 여기 옮겨 적지 않는다. 같은 내용이 두 곳에 있으면 한쪽이 낡는다.

## 순서

**1. 명세에서 요소를 뽑는다.** `_workspace/01_spec.md`의 배치 절을 위에서 아래로 목록으로 만든다. 헤더, 본문 블록, 하단 고정 버튼 순서다.

**2. 요소마다 쓸 컴포넌트를 정한다.** `src/shared/components/`에서 찾는다. 파일을 열어 props를 확인한다. 이름만 보고 정하면 없는 prop을 넘긴다.

**3. 없는 것만 새로 만든다.** 이 화면에서만 쓰면 `features/{feature}/components/`에, 두 화면 이상에서 쓰면 `src/shared/components/`에 둔다. 지금 한 곳에서만 쓰는 것을 shared에 미리 두지 않는다.

**4. 상태를 정한다.** 화면 안에서 끝나면 `useState`다. 화면 밖으로 나가야 하면 미결정에 걸린다. 상태 관리 도구는 아직 도입하지 않았다.

**5. 조립한다.** 화면 컴포넌트는 배치만 한다. 계산과 포맷은 `src/shared/utils/format.ts`나 훅으로 뺀다.

## 화면 껍데기

하단 탭바는 없다. 최상위는 홈 하나이고 나머지는 홈에서 들어간다. 헤더는 왼쪽에 뒤로가기가 있고 홈에서만 오른쪽에 마이페이지가 있다. `src/shared/components/Header.tsx`의 `BackHeader`와 `RoomHeader`, `HomeHeader`가 이 셋을 맡는다.

하단에 버튼이 고정되는 화면은 `Fab.tsx`의 `StickyCta`를 쓴다. 위치를 정하는 클래스는 컴포넌트가 아니라 화면이 준다. 화면마다 여백이 다르다.

## 공통 컴포넌트가 맡는 자리

파일은 `src/shared/components/`에 있다. 정확한 props는 파일을 열어 본다.

| 자리             | 파일                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| 헤더             | `Header.tsx`                                                                 |
| 카드 바탕        | `Card.tsx`                                                                   |
| 지출과 무지출 글 | `ExpenseCard.tsx`, `NoSpendCard.tsx`                                         |
| 판결 표시        | `VerdictStamp.tsx`, `VerdictPanel.tsx`                                       |
| 방 목록과 랭킹   | `RoomCard.tsx`, `RankingBoard.tsx`                                           |
| 사람 표시        | `Avatar.tsx`, `AvatarStack.tsx`, `TierBadge.tsx`                             |
| 입력             | `TextField.tsx`, `AmountField.tsx`, `AttachmentField.tsx`                    |
| 고르기           | `Chip.tsx`, `TabSegment.tsx`                                                 |
| 누르기           | `Button.tsx`, `Fab.tsx`                                                      |
| 띄우기           | `BottomSheet.tsx`, `Toast.tsx`, `Alert.tsx`                                  |
| 진행 표시        | `ProgressBar.tsx`                                                            |
| 딱지             | `Tag.tsx`, `CountBadge.tsx`                                                  |
| 비었을 때        | `EmptyState.tsx`                                                             |
| 그 밖            | `ReactionRow.tsx`, `MemeThumbnail.tsx`, `ProfileSummaryCard.tsx`, `Logo.tsx` |

`DESIGN-SPEC.md`의 아직 없는 컴포넌트 절에 후보가 있다. 새로 만들기 전에 거기 있는지 본다.

## 자주 틀리는 것

**Tailwind 기본 팔레트는 비어 있다.** `globals.css`가 `--color-*: initial`로 지웠다. `bg-gray-100`을 쓰면 오류 없이 CSS가 안 나온다. 요소는 있는데 배경이 없는 화면이 된다. 쓸 수 있는 색은 `globals.css`의 `@theme`에 있는 이름뿐이다.

**타이포 토큰을 추가하면 `cn.ts`에도 넣는다.** `src/shared/lib/cn.ts`의 `extendTailwindMerge` 목록에 없는 `text-*` 토큰은 글자색으로 오인된다. `text-title text-ink`를 쓰면 뒤가 앞을 지운다. 오류가 없어 화면을 봐야 안다.

**판결은 5종이다.** 유죄, 무죄, 동의, 기각, 각하. `src/shared/types/verdict.ts`의 `Verdict`가 정본이다. 승인과 칭송은 옛 이름이라 쓰지 않는다.

**색에는 뜻이 있다.** 테라코타(`red`)는 유죄와 기각과 수감, 경고. 그린(`green`)은 무죄와 동의와 무지출. 노랑(`cta`)은 한 화면에 주요 액션 하나.

**`dark:` 변형을 쓰지 않는다.** 다크는 `prefers-color-scheme`으로 같은 토큰의 값만 바뀐다. 토큰으로 쓰면 저절로 따라간다.

**경로 별칭이 없다.** `@/`를 쓰지 않고 상대 경로로 적는다.

**feature 밖에서는 `index.ts`로만 들어간다.** `../features/post/components/Form` 같은 경로를 쓰지 않는다. feature 안에서는 반대로 자기 `index.ts`를 거치지 않고 파일을 직접 가져온다. 자기 배럴을 거치면 순환 import가 생긴다.
