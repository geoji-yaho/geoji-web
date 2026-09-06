---
description: Tailwind 클래스 작성 규칙. 임의값 대괄호 금지, 색은 토큰만, cn과 cva
paths: ["src/**/*.tsx", "src/**/*.css"]
---

# Tailwind 규칙

## 임의값 대괄호를 쓰지 않는다

`rotate-[-6deg]`, `text-[44px]`, `h-[52px]`처럼 대괄호로 값을 박지 않는다. Tailwind IntelliSense가 `suggestCanonicalClasses` 경고를 내고, 디자인 값이 컴포넌트마다 흩어져 시안이 바뀌면 전부 찾아 고쳐야 한다. 에디터의 Tailwind CSS IntelliSense 경고를 그대로 두지 않는다.

| 쓰지 않는 표기            | 대신 쓰는 표기      | 이유                                                     |
| ------------------------- | ------------------- | -------------------------------------------------------- |
| `rotate-[-6deg]`          | `-rotate-6`         | 정식 클래스가 있다. 각도는 아무 정수나 된다(`-rotate-7`) |
| `h-[52px]`, `size-[54px]` | `h-13`, `size-13.5` | 간격은 4px 배수에 .5와 .25가 전부 된다                   |
| `text-[44px]`             | `text-amount`       | 시안의 타이포 단계는 `globals.css`의 `--text-*` 토큰이다 |
| `rounded-[22px]`          | `rounded-card`      | 모서리 토큰. 16은 `rounded-2xl`, 24는 `rounded-3xl`      |
| `bg-[#c4553f]`            | `bg-red`            | 색은 `globals.css`의 토큰 이름만 쓴다                    |
| `bg-[rgba(196,85,63,.1)]` | `bg-red/10`         | 투명도는 슬래시로 붙인다                                 |
| `shadow-[0_6px_24px_...]` | `shadow-card`       | 그림자 토큰. 다크에서 색이 바뀌므로 값을 박으면 안 된다  |

정식 클래스로도 토큰으로도 안 나오는 값이면 클래스에 박지 말고 `src/app/styles/globals.css`의 `@theme`에 토큰을 추가한다. 토큰 이름은 시안의 이름을 따르고 용도를 주석으로 남긴다.

## 색은 토큰만 쓴다

Tailwind 기본 팔레트(`gray-100`, `red-500` 등)는 `--color-*: initial`로 비워져 있어 클래스를 써도 CSS가 나오지 않는다. 쓸 수 있는 색은 `page`, `screen`, `card`, `fill`, `line`, `ink`, `text`, `mute`, `dim`, `red`, `green`, `tan`, `cta`, `gray`, `stamp-text`, `kakao`, `kakao-text`, `shadow`(카드 그림자 색. `shadow-card`가 쓴다)다. `bg-transparent`처럼 토큰이 필요 없는 키워드는 그대로 된다. 각 색의 용도는 `globals.css`의 주석에 있다.

- 테라코타(`red`)는 유죄와 기각과 수감, 경고(Alert와 예산 초과)에만, 그린(`green`)은 무죄와 동의와 무지출에만 쓴다
- 노랑(`cta`)은 화면에서 주요 액션 하나에만 쓴다
- 다크는 `prefers-color-scheme`으로 같은 토큰의 값만 바뀐다. `dark:` 변형을 쓰지 않는다

## 클래스는 cn과 cva로 합친다

- 조건부 클래스와 `className` 병합은 `src/shared/lib/cn.ts`의 `cn`으로 한다. 문자열 템플릿이나 배열 join으로 잇지 않는다
- 변형이 둘 이상인 컴포넌트(버튼, 칩, 태그, 도장)는 `class-variance-authority`의 `cva`로 선언한다
- 타이포와 모서리, 그림자 토큰을 추가하면 `cn.ts`의 `extendTailwindMerge` 목록에도 넣는다. 안 넣으면 `text-title`을 글자색으로 오인해 `text-ink`와 충돌시킨다.
- 클래스 순서는 Prettier 플러그인이 정리한다. `cn`과 `cva` 안의 문자열도 정리 대상이다
