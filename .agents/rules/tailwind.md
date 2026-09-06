---
description: Tailwind 클래스와 CSS 파일 규칙. 임의값 대괄호 금지, 색은 토큰만, cn과 cva, CSS 주석 금지
paths: ["src/**/*.tsx", "src/**/*.css"]
---

# Tailwind 규칙

## 임의값 대괄호를 쓰지 않는다

`rotate-[-6deg]`, `text-[44px]`, `h-[52px]`처럼 대괄호로 값을 박지 않는다. Tailwind IntelliSense가 `suggestCanonicalClasses` 경고를 내고, 디자인 값이 컴포넌트마다 흩어져 시안이 바뀌면 전부 찾아 고쳐야 한다. 에디터의 Tailwind CSS IntelliSense 경고를 그대로 두지 않는다.

| 쓰지 않는 표기            | 대신 쓰는 표기      | 이유                                                       |
| ------------------------- | ------------------- | ---------------------------------------------------------- |
| `rotate-[-6deg]`          | `-rotate-6`         | 정식 클래스가 있다. 각도는 아무 정수나 된다(`-rotate-7`)   |
| `h-[52px]`, `size-[54px]` | `h-13`, `size-13.5` | 간격은 4px 배수에 .5와 .25가 전부 된다                     |
| `text-[44px]`             | `text-amount`       | 타이포 단계는 `theme/typography.css`의 `--text-*` 토큰이다 |
| `rounded-[22px]`          | `rounded-card`      | 모서리 토큰. 16은 `rounded-2xl`, 24는 `rounded-3xl`        |
| `bg-[#c4553f]`            | `bg-red`            | 색은 `theme/colors.css`의 토큰 이름만 쓴다                 |
| `bg-[rgba(196,85,63,.1)]` | `bg-red/10`         | 투명도는 슬래시로 붙인다                                   |
| `shadow-[0_6px_24px_...]` | `shadow-card`       | 그림자 토큰. 다크에서 색이 바뀌므로 값을 박으면 안 된다    |

정식 클래스로도 토큰으로도 안 나오는 값이면 클래스에 박지 말고 `src/app/styles/theme/`의 맞는 파일에 토큰을 추가한다. 토큰 이름은 시안의 이름을 따르고 용도는 `docs/design/DESIGN.md`에 적는다.

글자 크기는 예외다. 토큰에 없는 단계는 Tailwind 기본 클래스를 쓴다. `docs/design/DESIGN.md`의 타이포그래피 절이 주요 버튼 글자 `text-base`(16)와 마감 시간 칩, 보조 문구 `text-xs`(12)를 그 예로 든다. 색과 달리 `--text-*`는 `initial`로 비워 두지 않았으니 기본 클래스가 그대로 CSS로 나온다. 대괄호로 값을 박는 것(`text-[44px]`)만 금지이고 `text-sm`과 `text-base`, `text-xl`은 걸리지 않는다. 시안에 새 단계가 생기면 그때 `--text-*` 토큰을 만든다.

## 색은 토큰만 쓴다

Tailwind 기본 팔레트(`gray-100`, `red-500` 등)는 `--color-*: initial`로 비워져 있어 클래스를 써도 CSS가 나오지 않는다. 쓸 수 있는 색은 `page`, `screen`, `card`, `fill`, `line`, `ink`, `text`, `mute`, `dim`, `red`, `green`, `tan`, `cta`, `gray`, `stamp-text`, `kakao`, `kakao-text`, `scrim`(시트와 모달 뒤 덮개), `shadow`(카드 그림자 색. `shadow-card`가 쓴다)다. `bg-transparent`처럼 토큰이 필요 없는 키워드는 그대로 된다. 각 색의 용도는 `docs/design/DESIGN.md`의 색 표에 있다.

- 테라코타(`red`)는 유죄와 기각과 수감, 경고(Alert와 예산 초과)에만, 그린(`green`)은 무죄와 동의와 무지출에만 쓴다
- 노랑(`cta`)은 화면에서 주요 액션 하나에만 쓴다
- 다크는 같은 토큰의 값만 바뀐다(`light-dark()`와 `color-scheme`). `dark:` 변형을 쓰지 않는다. 기본은 시스템 설정이고 `html`의 `data-theme`으로 고정한다

## 클래스는 cn과 cva로 합친다

- 조건부 클래스와 `className` 병합은 `src/shared/lib/cn.ts`의 `cn`으로 한다. 문자열 템플릿이나 배열 join으로 잇지 않는다
- 변형이 둘 이상인 컴포넌트(버튼, 칩, 태그, 도장)는 `class-variance-authority`의 `cva`로 선언한다
- 타이포와 모서리, 그림자 토큰을 추가하면 `cn.ts`의 `extendTailwindMerge` 목록에도 넣는다. 안 넣으면 `text-title`을 글자색으로 오인해 `text-ink`와 충돌시킨다.
- 클래스 순서는 Prettier 플러그인이 정리한다. `cn`과 `cva` 안의 문자열도 정리 대상이다

## CSS 파일 배치

`src/app/styles/`를 역할별로 나눈다. `globals.css`는 진입점이라 `@import`와 `@source`만 담고 규칙을 직접 쓰지 않는다.

```
app/styles/
  globals.css            진입점. main.tsx가 이 파일만 가져온다
  fonts.css              @font-face
  base.css               @layer base. html 기본과 프리플라이트 보정
  utilities.css          @utility
  fonts/                 woff2 파일
  theme/
    colors.css           색 토큰
    typography.css       글꼴 스택과 타이포 단계
    tokens.css           화면 폭, 모서리, 전환, 그림자
```

Tailwind 4는 `@theme`을 여러 파일에 나눠 두고 `@import`로 합치는 것을 지원한다. 새 토큰을 넣을 때 종류에 맞는 파일을 고른다. 어느 파일에도 맞지 않으면 파일을 하나 더 만들고 `globals.css`에 `@import`를 더한다.

## CSS에 주석을 쓰지 않는다

토큰의 용도와 값 근거는 `docs/design/DESIGN.md`에 있다. CSS에 같은 내용을 적으면 두 곳이 어긋난다. 선택자와 속성이 무엇을 하는지는 코드가 말한다.

`/* 정본은 저 문서에 있다 */` 같은 안내 주석도 쓰지 않는다. 문서를 찾는 경로는 `AGENTS.md`에 있다.

## 폰트

Pretendard Variable을 저장소에 두고 쓴다. CDN을 거치지 않는다. 심사 기간에 외부 서비스가 죽으면 글꼴이 함께 죽는다.

- 파일은 `src/app/styles/fonts/`의 dynamic subset 92조각이다. `unicode-range`로 나뉘어 있어 브라우저가 화면에 뜬 글자에 필요한 조각만 받는다. 전체는 3MB지만 한 화면에서 실제로 받는 것은 조각 몇 개다
- `@font-face`는 `fonts.css`에 있고 자동 생성물이라 손으로 고치지 않는다. 버전을 올릴 때는 조각과 `unicode-range`를 함께 다시 받는다
- `font-display: swap`이다. 글꼴이 오기 전에는 시스템 고딕으로 보이고 오면 바뀐다
- `--font-sans`의 첫 순위가 `"Pretendard Variable"`이다. 그다음이 시스템 고딕 순서다
- `font-weight: 45 920` 한 선언이 굵기 전체를 맡는다. 굵기별 파일을 따로 두지 않는다
