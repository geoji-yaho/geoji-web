---
description: src 폴더 구조와 import 방향. 새 파일을 어디에 두고 무엇을 가져올 수 있는지
paths:
  - "src/**/*"
---

# 폴더 구조

`src/`는 app, features, shared 3층이다. 화면은 feature 안에서 조립하고 `app/router`가 URL에 연결한다. 기능 전용 코드는 그 feature에 두고 두 feature 이상에서 필요해질 때만 shared로 내린다.

## 층

| 층       | 경로                      | 담는 것                                                                                                                                     |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| app      | `src/app/`                | 앱 초기화와 조립. `providers`, `router`, `layouts`, `styles`, `config`, `App.tsx`                                                           |
| features | `src/features/{feature}/` | 비즈니스 기능 단위. 기능마다 `api`, `components`, `hooks`, `store`, `types`, `utils`, `index.ts` 가운데 필요한 것만 둔다                    |
| shared   | `src/shared/`             | 도메인과 무관한 공통. `api`(fetch 클라이언트), `components`, `hooks`, `lib`(외부 라이브러리 설정), `utils`(범용 함수), `constants`, `types` |

## import 방향

위에서 아래로만 가져온다. app은 features와 shared를, features는 shared만 가져온다.

- features끼리 import하지 않는다. 필요하면 shared로 내리거나 app에서 조합한다
- shared는 위 층을 모른다. 도메인 타입(Post, Room, Verdict 같은 것)은 `src/shared/types/`에 두어 features가 서로를 가져오지 않게 한다
- 경로 별칭(`@/`)은 쓰지 않는다. 상대 경로로 적는다

## index.ts

`index.ts`는 `features/{feature}/index.ts` 하나만 둔다. 그 파일이 feature의 공개 API다.

- 서브폴더마다 배럴을 만들지 않고 `features/index.ts`와 `shared/index.ts` 같은 전체 배럴도 만들지 않는다. 여러 파일로 된 작은 모듈(예: Modal 폴더)만 자기 `index.ts`를 둘 수 있다
- `export *` 대신 이름을 적어 내보내고 타입은 `export type`으로 낸다
- feature 밖에서는 `../features/auth`처럼 `index.ts`로만 들어간다. feature 안에서는 자기 `index.ts`를 거치지 않고 파일을 직접 가져온다
- shared는 `../shared/components/Button`처럼 파일 경로까지 적는다

## 폴더 안

역할별 폴더는 필요할 때 만든다. 없는 역할의 폴더를 미리 만들지 않는다.

```
app/
  App.tsx              루트 컴포넌트
  config/              앱 설정
  layouts/             공통 레이아웃
  providers/           전역 프로바이더
  router/              URL과 화면 연결
  styles/globals.css   디자인 토큰 정본

features/{feature}/
  api/                 이 기능의 API 호출
  components/
  hooks/
  store/               이 기능의 상태
  types/
  utils/
  index.ts             밖에 노출하는 것만 내보낸다

shared/
  api/                 fetch 클라이언트
  components/          공통 컴포넌트
  constants/
  hooks/               범용 훅
  lib/                 외부 라이브러리 설정. cn.ts
  types/               도메인 타입
  utils/               범용 함수. format.ts
```

## 지금 상태

`src/app/App.tsx`(컴포넌트 카탈로그), `src/app/styles/globals.css`, `src/shared/components/` 30개, `src/shared/lib/cn.ts`, `src/shared/utils/format.ts`, `src/shared/types/`의 도메인 파일 4개(`verdict.ts`, `post.ts`, `room.ts`, `tier.ts`)만 있다. 나머지 폴더는 `.gitkeep`뿐이다. 라우터는 미도입이고 화면 14개를 어느 feature로 묶을지는 아직 정하지 않았다.

## 파일 이름

컴포넌트 파일은 PascalCase(`RoomCard.tsx`), 그 외는 camelCase(`useVote.ts`, `api.ts`). 폴더는 kebab-case.
