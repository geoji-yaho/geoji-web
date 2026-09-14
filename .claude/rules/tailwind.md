---
description: 대괄호 임의값을 쓰지 않는다. 색은 src/app/styles/theme/colors.css 토큰만 쓰고 dark: 변형이 없다. 클래스는 cn과 cva로 합치고 CSS에 주석을 쓰지 않는다
paths: ["src/**/*.tsx", "src/**/*.css"]
---

# Tailwind 규칙

## 임의값 대괄호를 쓰지 않는다

`rotate-[-6deg]`, `text-[44px]`, `h-[52px]`처럼 대괄호로 값을 박지 않는다. 디자인 값이 컴포넌트마다 흩어져 시안이 바뀌면 전부 찾아 고쳐야 한다.

| 쓰지 않는 표기            | 대신 쓰는 표기      | 이유                                                       |
| ------------------------- | ------------------- | ---------------------------------------------------------- |
| `rotate-[-6deg]`          | `-rotate-6`         | 정식 클래스가 있다. 각도는 아무 정수나 된다(`-rotate-7`)   |
| `h-[52px]`, `size-[54px]` | `h-13`, `size-13.5` | 간격은 4px 배수에 .5와 .25가 전부 된다                     |
| `text-[44px]`             | `text-amount`       | 타이포 단계는 `theme/typography.css`의 `--text-*` 토큰이다 |
| `rounded-[22px]`          | `rounded-card`      | 모서리 토큰. 16은 `rounded-2xl`, 24는 `rounded-3xl`        |
| `bg-[#c4553f]`            | `bg-red`            | 색은 `theme/colors.css`의 토큰 이름만 쓴다                 |
| `bg-[rgba(196,85,63,.1)]` | `bg-red/10`         | 투명도는 슬래시로 붙인다                                   |
| `shadow-[0_6px_24px_...]` | `shadow-card`       | 그림자 토큰. 다크에서 색이 바뀌므로 값을 박으면 안 된다    |

정식 클래스로도 토큰으로도 안 나오는 값이면 `src/app/styles/theme/`의 맞는 파일에 토큰을 추가한다. 토큰 이름은 시안의 이름을 따르고 용도는 `docs/design/DESIGN.md`에 적는다.

글자 크기만 예외다. 토큰에 없는 단계는 `text-xs`, `text-base` 같은 기본 클래스를 쓴다. `--text-*`는 색과 달리 `initial`로 비워 두지 않았다. 시안에 새 단계가 생기면 그때 토큰을 만든다.

## 색은 토큰만 쓴다

Tailwind 기본 팔레트(`gray-100`, `red-500`)는 `--color-*: initial`로 비워져 있어 클래스를 써도 CSS가 나오지 않는다. 쓸 수 있는 색은 `page`, `screen`, `card`, `fill`, `line`, `ink`, `text`, `mute`, `dim`, `red`, `green`, `tan`, `cta`, `gray`, `stamp-text`, `kakao`, `kakao-text`, `scrim`, `shadow`다. `bg-transparent`처럼 토큰이 필요 없는 키워드는 그대로 된다. 각 색의 용도는 `docs/design/DESIGN.md`의 색 표에 있다.

- 테라코타(`red`)는 유죄와 기각, 수감, 경고에만, 그린(`green`)은 무죄와 동의, 무지출에만 쓴다
- 노랑(`cta`)은 화면에서 주요 액션 하나에만 쓴다
- 다크는 같은 토큰의 값만 바뀐다(`light-dark()`와 `color-scheme`). `dark:` 변형을 쓰지 않는다. 기본은 시스템 설정이고 `html`의 `data-theme`으로 고정한다

## 클래스는 cn과 cva로 합친다

- 조건부 클래스와 `className` 병합은 `src/shared/lib/cn.ts`의 `cn`으로 한다. 문자열 템플릿이나 배열 join으로 잇지 않는다
- 변형이 둘 이상인 컴포넌트(버튼, 칩, 태그, 도장)는 `class-variance-authority`의 `cva`로 선언한다
- 타이포와 모서리, 그림자 토큰을 추가하면 `cn.ts`의 `extendTailwindMerge` 목록에도 넣는다. 안 넣으면 `text-title`을 글자색으로 오인해 `text-ink`와 충돌시킨다
- 클래스 순서는 Prettier 플러그인이 정리한다. `cn`과 `cva` 안의 문자열도 정리 대상이다

## CSS 파일 배치

`src/app/styles/`를 역할별로 나눈다. `globals.css`는 진입점이라 `@import`와 `@source`만 담는다. 새 토큰은 종류에 맞는 theme 파일에 넣고 어느 파일에도 맞지 않으면 파일을 하나 더 만들어 `globals.css`에 `@import`를 더한다.

```
app/styles/
  globals.css            진입점. main.tsx가 이 파일만 가져온다
  fonts.css              @font-face. 자동 생성물이라 손으로 고치지 않는다
  base.css               @layer base. html 기본과 프리플라이트 보정
  utilities.css          @utility
  fonts/                 Pretendard Variable woff2 조각
  theme/
    colors.css           색 토큰
    typography.css       글꼴 스택과 타이포 단계
    tokens.css           화면 폭, 모서리, 전환, 그림자
```

CSS와 HTML에 주석을 쓰지 않는다. 토큰의 용도와 값 근거는 `docs/design/DESIGN.md`에 있고 같은 내용을 두 곳에 적으면 한쪽이 낡는다.

## 폰트

Pretendard Variable을 저장소에 두고 서빙한다. CDN을 거치지 않는다. 심사 기간에 외부 서비스가 죽으면 글꼴이 함께 죽는다. 조각은 `unicode-range`로 나뉘어 브라우저가 화면에 뜬 글자에 필요한 것만 받고 `font-weight: 45 920` 한 선언이 굵기 전체를 맡는다. 버전을 올릴 때는 조각과 `fonts.css`를 함께 다시 받는다.
