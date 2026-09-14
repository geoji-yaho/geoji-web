---
description: 이 저장소의 TypeScript와 주석 규칙. 추론되는 반환 타입을 적지 않는 것과 예외 둘, TypeScript와 React 생태계가 쓰는 동사와 접두사, 접미사로 짓는 이름, 코드에 주석을 적지 않고 지시문만 남기는 것, as 단언과 이름 없는 숫자. 전역 룰과 어긋나면 여기가 이긴다
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript와 주석

strict mode이고 `any`와 non-null assertion `!`을 쓰지 않는다. 타입으로만 쓰는 대상은 `import type`으로 가져온다. 경로 별칭 `@/`와 파일 이름 표기는 `folder-structure.md`가 정한다. 전역 룰이 경로 별칭을 금지하거나 파일 이름을 점으로 구분하라고 해도 이 저장소에서는 `folder-structure.md`를 따른다.

## 반환 타입

추론되는 반환 타입은 적지 않는다. 구현이 바뀌면 적어 둔 타입이 따로 놀다 낡는다. 예외는 둘이다.

- 넓은 입력을 좁히는 함수. `parseTheme(raw: string | null): ThemePreference`처럼 무엇으로 좁혔는지가 선언이다
- 반환식에서 자기 자신을 참조하는 함수. 지우면 선언 파일을 방출할 때 `any`로 떨어진다

타입 술어(`value is Room`)는 추론되지 않으니 적는다. 지역 변수에 타입을 붙여 같은 효과를 낼 수 있으면 그쪽을 먼저 본다.

## 이름

TypeScript와 React 생태계가 이미 쓰는 말로 짓는다. 새 말을 만들지 않고 낯선 동사가 떠오르면 표에서 고른다. 제품 용어(vote, verdict, trial, judge, room, expense, tier)는 그대로 쓴다.

| 자리               | 쓰는 말                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 동사               | get, set, fetch, load, create, update, remove, add, toggle, open, close, reset, clear, submit, validate, parse, format, find, filter, select, build, calculate |
| 컴포넌트 안 핸들러 | `handleClick`, `handleSubmit`처럼 `handle` 뒤에 사건                                                                                                           |
| 콜백 prop          | `onClick`, `onChange`, `onSuccess`처럼 `on` 뒤에 사건                                                                                                          |
| 훅                 | `useX`. 변이 훅은 `useCreateX`, `useUpdateX`, `useRemoveX`                                                                                                     |
| boolean            | `isX`, `hasX`, `canX`, `shouldX`. HTML 속성 이름(`disabled`, `open`, `selected`, `checked`, `multiline`)은 그대로                                              |
| 상태               | `[value, setValue]`, updater 인자는 `prev`                                                                                                                     |
| 명사와 접미사      | `XProps`, `xRef`, `XContext`와 `XProvider`, `xId`, `xCount`, `xById`, `initialX`, `defaultX`, `currentX`, `selectedX`. 배열은 복수형                           |
| 변환               | `toX`, `fromX`, `formatX`, `parseX`                                                                                                                            |

격식체 동사는 쓰지 않는다.

| 쓰지 않는 동사              | 대신 쓰는 동사       |
| --------------------------- | -------------------- |
| acquire, obtain, retrieve   | get, fetch, load     |
| release, dispose, terminate | stop, close, clear   |
| invoke, execute, perform    | run, call, handle    |
| instantiate, materialize    | create, build, make  |
| initialize                  | init, setup, prepare |
| utilize, leverage           | use                  |
| populate, traverse          | fill, walk           |

브라우저 API나 라이브러리를 감싸면 그 API의 동사를 따른다. `useSyncExternalStore`가 정한 `subscribe`와 `getSnapshot`이 그 예다. 동사만 있고 목적어가 없는 이름(`emit`, `resolve`)과 동사가 없어 값으로 읽히는 함수 이름(`memberName`)을 쓰지 않는다. 상수는 UPPER_SNAKE_CASE, 타입과 컴포넌트는 PascalCase이고 약어는 `Http`, `Id`처럼 일반 단어다. enum 대신 `as const` 객체와 유니온 타입을 쓴다.

## 주석

코드에 주석을 적지 않는다. CSS와 HTML은 한 줄도 쓰지 않고 TypeScript는 지시문(`eslint-disable-next-line`, `@ts-expect-error`, `/// <reference`)만 남긴다. 설명이 필요하면 조건을 이름 있는 변수로, 숫자를 이름 붙인 상수로, 블록을 함수로 뽑는다. 값의 근거는 `CONTRIBUTING.md` 주석 절의 목록이나 커밋 메시지에 적는다. JSDoc은 이름과 타입이 말하지 못하는 것(순서 제약, 실측 근거, throw 조건)만 담고 그것도 남기는 쪽이 예외다.

JSX에서 `{" "}` 공백 표현식을 쓰지 않는다. `&nbsp;`나 문장 재구성으로 푼다.

## 단언과 조건

`as` 단언은 런타임 검증 직후에만 쓴다. 이름 없는 숫자와 세 항 넘는 조건은 변수로 뺀다. 한 파일 안에서 같은 종류의 검증이 throw와 boolean 반환으로 갈리지 않게 한다. `console`을 직접 쓰지 않는다. 사용자가 알아야 할 실패는 화면 상태로 그린다.

## 확인하는 법

`check-conventions.sh`가 본문 주석과 CSS, HTML 주석, JSX `{" "}`를 막는다. 적힌 반환 타입과 격식체 동사, JSDoc, `console`, 대문자 약어(`roomID`), `on` 없는 함수형 prop, 접두사 없는 boolean prop, 동사로 시작하지 않는 export 함수는 볼것으로 낸다. 예외 둘에 드는지와 이름이 생태계 말인지, JSDoc이 남을 자격이 있는지는 review-typescript가 본다.
