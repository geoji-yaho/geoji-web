---
description: src 폴더 구조와 import 방향, import 경로 규칙, 공개 API, 파일 이름
paths:
  - "src/**/*"
---

# 폴더 구조

`src/`는 app, features, shared 3층이다. 화면은 feature 안에서 조립하고 `app/router`가 URL에 연결한다. 기능 전용 코드는 그 feature에 두고 두 feature 이상에서 필요해질 때만 shared로 내린다.

## 층

| 층       | 경로                      | 담는 것                                                                                                          |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| app      | `src/app/`                | 앱 초기화와 조립. `layouts`, `router`, `styles`, `App.tsx`. 라우트 레이아웃은 feature 전용이라도 여기 둔다       |
| features | `src/features/{feature}/` | 비즈니스 기능 단위. `pages`, `components`, `api`, `hooks`, `store`, `utils`, `index.ts` 가운데 필요한 것만 둔다  |
| shared   | `src/shared/`             | 여러 feature가 함께 쓰는 것. `ui`, `components`, `domain`, `api`, `hooks`, `lib`, `utils`, `constants`, `@types` |

## import 방향

위에서 아래로만 가져온다. app은 features와 shared를, features는 shared만 가져온다.

- features끼리 import하지 않는다. 필요하면 shared로 내리거나 app에서 조합한다
- shared는 위 층을 모른다. 도메인 타입(Post, Room, Verdict 같은 것)은 `src/shared/domain/`에 두어 features가 서로를 가져오지 않게 한다
- `shared/ui`는 `shared/components`와 `shared/domain`을 모른다. 의존은 한 방향이다

## import 경로

**같은 층 안이면 상대 경로, 층을 넘으면 `@/`.** `@/`는 `src/`를 가리키고 매핑은 `tsconfig.app.json`의 `paths`에 있다. Vite는 `resolve.tsconfigPaths`로 같은 값을 읽으므로 `vite.config.ts`에 별칭을 따로 적지 않는다.

층은 셋이다. `src/app` 전체가 한 층, `src/features/{feature}` 하나하나가 한 층, `src/shared` 전체가 한 층이다. `src/app/layouts`와 `src/app/router`는 같은 층이고 `src/shared/ui`와 `src/shared/lib`도 같은 층이다.

```ts
// src/app/router/routes.tsx
import { AppLayout } from "../layouts/AppLayout"; // 같은 app 층
import { HomePage } from "@/features/home"; // 층을 넘는다

// src/app/App.tsx
import { router } from "./router/routes"; // 같은 app 층

// src/shared/components/RoomCard.tsx
import type { Intensity } from "../domain/room"; // 같은 shared 층
import { cn } from "../lib/cn"; // 같은 shared 층
import { CountBadge } from "../ui/CountBadge"; // 같은 shared 층
import { StatusTag } from "./StatusTag"; // 같은 폴더

// src/features/room/pages/RoomFeedPage.tsx
import { ExpenseCard } from "@/shared/components/ExpenseCard"; // 층을 넘는다
import { RoomRuleList } from "../components/RoomRuleList"; // 같은 room 층
```

`src/main.tsx`는 진입점 하나뿐이라 `./app/App`처럼 상대 경로로 적는다.

기계적으로 판정하려면 상대 경로를 계산해 보면 된다. `../`가 한 번까지면 같은 층 안이니 상대 경로이고, 두 번 이상 올라가야 하면 층을 넘은 것이니 `@/`다. `src/app/App.tsx`에서 `src/shared`로 가는 것만 예외로, `../`가 한 번이지만 층을 넘으므로 `@/`를 쓴다.

같은 층 안을 상대 경로로 두는 이유는 경계가 import 줄에 드러나기 때문이다. `@/features/...`가 다른 feature 파일에서 보이면 그 자체로 위반 신호이고, `@/`가 보이면 층을 넘었다는 뜻이다. 순서는 `eslint-plugin-simple-import-sort`가 정리하고 `@/`는 절대 경로 그룹, 상대 경로는 그 뒤 그룹으로 나뉜다.

## 공개 API

`index.ts`는 `features/{feature}/index.ts` 다섯 개만 둔다. 그 파일이 feature의 공개 API다.

- 서브폴더마다 배럴을 만들지 않고 `features/index.ts`와 `shared/index.ts` 같은 전체 배럴도 만들지 않는다
- `export *` 대신 이름을 적어 내보내고 타입은 `export type`으로 낸다
- feature 밖에서는 `@/features/room`처럼 `index.ts`로만 들어간다. `@/features/room/components/RoomTabsHeader`처럼 깊이 들어가지 않는다. 밖에서 필요한 것이 생기면 `index.ts`에 한 줄 더한다
- feature 안에서는 자기 `index.ts`를 거치지 않고 `../components/RoomRuleList`처럼 파일을 직접 가져온다
- shared는 배럴이 없으니 `@/shared/ui/Button`처럼 파일 경로까지 적는다. 어느 파일에서 오는지가 import 줄에 그대로 보인다

## 폴더 안

역할별 폴더는 필요할 때 만든다. 없는 역할의 폴더를 미리 만들지 않는다.

```
app/
  App.tsx              루트 컴포넌트
  layouts/             레이아웃. 앱 전체와 라우트 단위 모두
  router/              URL과 화면 연결
  styles/              CSS. 구조는 tailwind.md

features/{feature}/
  pages/               라우트에 붙는 화면. 파일 이름이 Page로 끝난다
  components/          화면을 이루는 조각. 페이지를 가져오지 않는다
  api/                 이 기능만 쓰는 API 호출. 둘 이상이 쓰면 shared/api로 내린다
  hooks/
  store/               이 기능의 상태
  utils/
  index.ts             밖에 노출하는 것만 내보낸다

shared/
  ui/                  도메인을 모르는 UI. 다른 제품에 옮겨도 그대로 돈다
  components/          서비스에 종속된 공통 컴포넌트
  domain/              도메인 타입과 그 타입에 딸린 값
  api/                 fetch 클라이언트와 두 feature 이상이 쓰는 엔티티 요청 모듈
  constants/           타입에 매이지 않은 값
  hooks/               범용 훅
  lib/                 외부 라이브러리 설정과 브라우저 API를 감싼 것
  utils/               범용 함수
  @types/              전역 선언 파일(.d.ts). import와 export를 쓰지 않는다
```

라우트 레이아웃은 feature 전용이라도 `app/layouts/`에 둔다. 라우터가 조립하는 것이라 URL 구조를 아는 층이 갖는 편이 맞다. 그 레이아웃이 feature의 컴포넌트를 쓰면 그 컴포넌트를 feature `index.ts`에 내보낸다.

## shared를 가르는 기준

| 폴더         | 판별                                        | 예                                                            |
| ------------ | ------------------------------------------- | ------------------------------------------------------------- |
| `ui`         | 떼거지를 모른다. 다른 제품에 그대로 옮긴다  | `Button`, `Card`, `Avatar`, `TextField`, `MeterBar`, `Tag`    |
| `components` | 판결과 티어, 방처럼 이 서비스의 개념을 안다 | `Logo`, `BackHeader`, `VerdictStamp`, `TierBadge`             |
| `domain`     | 도메인 타입과 그 타입 없이는 뜻이 없는 값   | `Verdict`와 `VERDICT_LABELS`, `PostType`과 `POST_TYPE_LABELS` |
| `constants`  | 타입에 매이지 않은 값                       | `EXPENSE_CATEGORIES`, `LOGO_COLORS`                           |

`shared/domain/`의 타입을 가져오거나 브랜드 자산과 서비스 카피를 담으면 `components`, 그 밖은 `ui`다. `components`는 `ui`를 가져다 쓰고 반대는 안 된다. 도메인을 아는 것이 도메인을 모르는 것에 얹히는 방향이라야 UI를 따로 떼어 볼 수 있다.

`domain`과 `@types`를 가르는 것은 export 여부다. `Verdict`처럼 가져다 쓰는 타입은 `domain`의 모듈이고, `ImportMetaEnv`처럼 전역을 보강하는 선언은 `@types`의 `.d.ts`다. 선언 파일에 `import`나 `export`가 한 줄이라도 들어가면 모듈이 되어 전역 보강이 끊긴다.

`domain`과 `constants`를 가르는 것은 그 값이 타입에 매여 있는지다. `VERDICT_LABELS`는 `Record<Verdict, string>`이라 `Verdict`가 바뀌면 컴파일러가 함께 고치라고 한다. 그래서 같은 파일에 둔다. `EXPENSE_CATEGORIES`는 그런 짝이 없으니 `constants`다.

같은 컴포넌트의 순수한 껍데기와 도메인 껍질을 나눠도 된다. `ui/Tag`가 딱지의 모양을 갖고 `components/IntensityTag`가 잔소리 강도를 그 모양에 얹는 식이다.

## 파일 이름

컴포넌트 파일은 PascalCase(`RoomCard.tsx`)다. 폴더는 kebab-case. `@types`만 예외로, 선언 파일만 담는 폴더라는 표시다.

컴포넌트가 아닌 파일은 무엇을 내보내는지로 갈린다.

| 무엇을 내보내나                                     | 표기             | 예                                                          |
| --------------------------------------------------- | ---------------- | ----------------------------------------------------------- |
| 주 export가 하나이고 파일 이름이 그 심볼과 같아진다 | 심볼 표기 그대로 | `useTheme.ts`, `cn.ts`, `useVote.ts`                        |
| 상수 모음과 타입 모음처럼 주 export가 여럿이다      | kebab-case       | `expense-categories.ts`, `logo-colors.ts`, `theme-store.ts` |

한 단어면 두 줄의 결과가 같다. `format.ts`와 `percent.ts`, `motion.ts`, `post.ts`가 그렇다.

파일 이름이 심볼과 같으면 import 줄만 보고 무엇이 오는지 안다. 여럿을 내보내는 파일은 어떤 심볼과도 같아지지 않으니 camelCase가 아무것도 반영하지 못한다. `expenseCategories.ts`는 `EXPENSE_CATEGORIES`도 아니고 다른 어떤 심볼도 아니다. 소문자와 하이픈만 쓰면 macOS와 Windows가 파일 이름 대소문자를 구분하지 않아 이름 변경 커밋이 인식되지 않는 문제도 피한다.

한 `.tsx`에 컴포넌트 하나만 둔다. 파일 이름이 곧 그 컴포넌트다. 화면에서만 쓰는 작은 조각도 파일을 따로 만든다. 한 파일에 둘을 두면 import하는 쪽이 어느 이름이 어디 있는지 외워야 하고, 파일 이름으로 찾을 수 없게 된다.

컴포넌트가 아닌 것(cva 변형, 상수, 타입)은 그 컴포넌트 파일 안에 함께 두어도 된다. 둘 이상이 나눠 쓰면 그때 별도 파일로 뺀다.

## props 타입

`children`을 받는 컴포넌트는 `PropsWithChildren`으로 감싼다. `children?: ReactNode`를 직접 적지 않는다.

```ts
type TagProps = PropsWithChildren<{
	tone?: TagTone;
	className?: string;
}>;
```

`PropsWithChildren`이 내는 `children`은 옵셔널이다. 내용 없이 쓰면 안 되는 컴포넌트라도 컴파일러가 막아 주지 않으니 그 점은 감수한다.

cva를 쓰는 컴포넌트는 변형 타입을 손으로 적지 않고 `VariantProps`에서 뽑는다.

```ts
type LogoProps = VariantProps<typeof logoWordmarkVariants> & {
	className?: string;
};
```

cva의 boolean 변형은 `VariantProps`에서 `boolean | null | undefined`가 된다. 그 값을 `aria-pressed`처럼 `null`을 받지 않는 자리에 넘기면 `& { selected?: boolean }`로 좁혀야 한다. 중복처럼 보여도 지우면 컴파일이 깨진다.

## 지금 상태

화면 14개가 `features/{feature}/pages/`에 있고 라우터는 react-router 8이다. feature는 `auth`, `home`, `room`, `post`, `me` 다섯이고 각각 `pages/`와 필요한 만큼의 `components/`, `index.ts`를 갖는다.

`src/app/`에 `App.tsx`와 `router/routes.tsx`, `layouts/`의 `AppLayout.tsx`와 `RoomLayout.tsx`, `styles/`가 있다. `AppLayout`은 393 열 정렬과 화면 전환을, `RoomLayout`은 방 화면 셋이 공유하는 탭 헤더를 맡는다.

`src/shared/`에는 `ui/` 22개와 `components/` 25개, `domain/`의 도메인 파일 다섯(`verdict`, `post`, `room`, `tier`, `theme`), `constants/`의 `expense-categories.ts`와 `logo-colors.ts`, `hooks/useTheme.ts`, `lib/`의 `cn.ts`와 `motion.ts`, `stamp-sound.ts`, `theme-store.ts`, `utils/`의 `format.ts`와 `percent.ts`가 있다.

`api/`와 `store/`는 아직 어느 feature에도 없다. 표시용 샘플 데이터는 각 페이지 파일의 상수이고 API 규약이 나오면 그 자리가 `api/`로 옮겨간다. 상태 관리 도구와 테스트 도구는 미도입이다.
