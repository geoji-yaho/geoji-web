---
description: src는 app, features, shared 3층이고 위에서 아래로만 가져온다. 같은 층 안은 상대 경로, 층을 넘으면 @/. index.ts는 feature 공개 API에만 두고 export *를 쓰지 않는다. 컴포넌트 파일은 PascalCase, 그 밖은 주 export를 따른다
paths:
  - "src/**/*"
---

# 폴더 구조

`src/`는 app, features, shared 3층이다. 화면은 feature 안에서 조립하고 `app/router`가 URL에 연결한다. 기능 전용 코드는 그 feature에 두고 두 feature 이상에서 필요해질 때만 shared로 내린다.

| 층       | 경로                      | 담는 것                                                                                                          |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| app      | `src/app/`                | 앱 조립. `layouts`, `router`, `providers`, `styles`, `App.tsx`. 라우트 레이아웃은 feature 전용이라도 여기        |
| features | `src/features/{feature}/` | 기능 단위. `pages`, `components`, `api`, `hooks`, `utils`, `index.ts` 가운데 필요한 것만                         |
| shared   | `src/shared/`             | 여러 feature가 함께 쓰는 것. `ui`, `components`, `domain`, `api`, `hooks`, `lib`, `utils`, `constants`, `@types` |

## import 방향

위에서 아래로만 가져온다. app은 features와 shared를, features는 shared만 가져온다.

- features끼리 import하지 않는다. 필요하면 shared로 내리거나 app에서 조합한다
- shared는 위 층을 모른다. 도메인 타입(Post, Room, Verdict)은 `src/shared/domain/`에 두어 features가 서로를 가져오지 않게 한다
- `shared/ui`는 `shared/components`와 `shared/domain`을 모른다

## import 경로

**같은 층 안이면 상대 경로, 층을 넘으면 `@/`.** `@/`는 `src/`를 가리키고 매핑은 `tsconfig.app.json`의 `paths`에 있다. Vite는 `resolve.tsconfigPaths`로 같은 값을 읽는다.

층은 셋이다. `src/app` 전체가 한 층, `src/features/{feature}` 하나하나가 한 층, `src/shared` 전체가 한 층이다.

```ts
// src/app/router/routes.tsx
import { AppLayout } from "../layouts/AppLayout"; // 같은 app 층
import { HomePage } from "@/features/home"; // 층을 넘는다

// src/shared/components/RoomCard.tsx
import type { Intensity } from "../domain/room"; // 같은 shared 층
import { CountBadge } from "../ui/CountBadge"; // 같은 shared 층

// src/features/room/pages/RoomFeedPage.tsx
import { ExpenseCard } from "@/shared/components/ExpenseCard"; // 층을 넘는다
import { RoomRuleList } from "../components/RoomRuleList"; // 같은 room 층
```

판정은 상대 경로로 한다. `../`가 한 번까지면 같은 층이니 상대 경로이고 두 번 이상이면 층을 넘은 것이니 `@/`다. `src/app/App.tsx`에서 `src/shared`로 가는 것만 예외로, `../`가 한 번이지만 층을 넘으므로 `@/`를 쓴다. `src/main.tsx`는 진입점 하나뿐이라 `./app/App`처럼 적는다. 이렇게 두면 `@/features/`가 다른 feature 파일에서 보이는 것만으로 위반이 드러난다.

## 공개 API

`index.ts`는 `features/{feature}/index.ts`에만 둔다. 그 파일이 feature의 공개 API다.

- 서브폴더 배럴과 `features/index.ts`, `shared/index.ts` 같은 전체 배럴을 만들지 않는다
- `export *` 대신 이름을 적어 내보내고 타입은 `export type`으로 낸다
- feature 밖에서는 `@/features/room`처럼 `index.ts`로만 들어간다. 밖에서 필요한 것이 생기면 `index.ts`에 한 줄 더한다
- feature 안에서는 자기 `index.ts`를 거치지 않고 `../components/RoomRuleList`처럼 파일을 직접 가져온다
- shared는 배럴이 없으니 `@/shared/ui/Button`처럼 파일 경로까지 적는다

## 폴더 안

역할별 폴더는 필요할 때 만든다. 없는 역할의 폴더를 미리 만들지 않는다.

```
app/
  App.tsx              루트 컴포넌트
  layouts/             레이아웃. 앱 전체와 라우트 단위 모두
  providers/           QueryClientProvider 같은 앱 전역 공급자
  router/              URL과 화면 연결
  styles/              CSS. 구조는 tailwind.md

features/{feature}/
  pages/               라우트에 붙는 화면. 파일 이름이 Page로 끝난다
  components/          화면을 이루는 조각. 페이지를 가져오지 않는다
  api/                 이 기능만 쓰는 엔티티 모듈. 둘 이상이 쓰면 shared/api로 내린다
  hooks/               변이 훅
  utils/
  index.ts             밖에 노출하는 것만 내보낸다

shared/
  ui/                  떼거지를 모르는 UI. 다른 제품에 옮겨도 그대로 돈다
  components/          판결과 티어, 방처럼 이 서비스의 개념을 아는 공통 컴포넌트
  domain/              도메인 타입과 그 타입에 딸린 값
  api/                 http 클라이언트와 두 feature 이상이 쓰는 엔티티 모듈
  constants/           타입에 매이지 않은 값
  hooks/               범용 훅과 쿼리 여럿을 합쳐 계산하는 훅
  lib/                 외부 라이브러리 설정과 브라우저 API를 감싼 것
  utils/               범용 함수
  @types/              전역 선언 파일(.d.ts). import와 export를 쓰지 않는다
```

라우트 레이아웃은 feature 전용이라도 `app/layouts/`에 둔다. URL 구조를 아는 층이 조립하기 때문이다. 그 레이아웃이 feature의 컴포넌트를 쓰면 그 컴포넌트를 feature `index.ts`에 내보낸다.

## shared를 가르는 기준

| 폴더         | 판별                                        | 예                                                            |
| ------------ | ------------------------------------------- | ------------------------------------------------------------- |
| `ui`         | 떼거지를 모른다. 다른 제품에 그대로 옮긴다  | `Button`, `Card`, `Avatar`, `TextField`, `MeterBar`, `Tag`    |
| `components` | 판결과 티어, 방처럼 이 서비스의 개념을 안다 | `Logo`, `BackHeader`, `VerdictStamp`, `TierBadge`             |
| `domain`     | 도메인 타입과 그 타입 없이는 뜻이 없는 값   | `Verdict`와 `VERDICT_LABELS`, `PostType`과 `POST_TYPE_LABELS` |
| `constants`  | 타입에 매이지 않은 값                       | `EXPENSE_CATEGORIES`, `LOGO_COLORS`                           |

`shared/domain/`의 타입을 가져오거나 브랜드 자산과 서비스 카피를 담으면 `components`, 그 밖은 `ui`다. `components`는 `ui`를 가져다 쓰고 반대는 안 된다.

`domain`과 `@types`는 export 여부로 가른다. `Verdict`처럼 가져다 쓰는 타입은 `domain`의 모듈이고 `ImportMetaEnv`처럼 전역을 보강하는 선언은 `@types`의 `.d.ts`다. 선언 파일에 `import`나 `export`가 한 줄이라도 들어가면 모듈이 되어 전역 보강이 끊긴다.

`domain`과 `constants`는 값이 타입에 매였는지로 가른다. `VERDICT_LABELS`는 `Record<Verdict, string>`이라 `Verdict`가 바뀌면 컴파일러가 함께 고치라고 하므로 같은 파일에 둔다. `EXPENSE_CATEGORIES`는 그런 짝이 없으니 `constants`다.

## 파일 이름

컴포넌트 파일은 PascalCase(`RoomCard.tsx`)다. 폴더는 kebab-case이고 `@types`만 예외다.

| 무엇을 내보내나                                     | 표기             | 예                                                          |
| --------------------------------------------------- | ---------------- | ----------------------------------------------------------- |
| 주 export가 하나이고 파일 이름이 그 심볼과 같아진다 | 심볼 표기 그대로 | `useTheme.ts`, `cn.ts`, `useVote.ts`                        |
| 상수 모음과 타입 모음처럼 주 export가 여럿이다      | kebab-case       | `expense-categories.ts`, `logo-colors.ts`, `theme-store.ts` |

한 단어면 두 줄의 결과가 같다. 여럿을 내보내는 파일에 camelCase를 쓰면 어떤 심볼과도 같아지지 않아 아무것도 반영하지 못하고, 소문자와 하이픈만 쓰면 macOS와 Windows가 대소문자를 구분하지 않아 이름 변경 커밋을 놓치는 문제도 피한다.

한 `.tsx`에 컴포넌트 하나만 둔다. 화면에서만 쓰는 작은 조각도 파일을 따로 만든다. cva 변형과 상수, 타입은 그 컴포넌트 파일 안에 함께 두어도 되고 둘 이상이 나눠 쓰면 그때 별도 파일로 뺀다.

## props 타입

`children`을 받는 컴포넌트는 `PropsWithChildren`으로 감싼다. `children?: ReactNode`를 직접 적지 않는다. `PropsWithChildren`이 내는 `children`은 옵셔널이라 내용 없이 쓰는 것을 컴파일러가 막지 못하는 점은 감수한다.

```ts
type TagProps = PropsWithChildren<{
	tone?: TagTone;
	className?: string;
}>;
```

cva를 쓰는 컴포넌트는 변형 타입을 손으로 적지 않고 `VariantProps`에서 뽑는다.

```ts
type LogoProps = VariantProps<typeof logoWordmarkVariants> & {
	className?: string;
};
```
