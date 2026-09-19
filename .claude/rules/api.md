---
description: 데이터 층 규칙. 요청은 shared/api/http만 쓰고 엔티티 모듈은 쓰는 feature 수로 자리를 가른다. 쿼리 키는 엔티티로 시작하는 계층, 변이는 feature hooks의 useMutation 훅, 401 밖은 error.kind로 분기하고 아직 없는 리소스는 queryFn에서 null로 바꾼다
paths:
  - "src/**/api/**"
  - "src/**/hooks/**"
  - "src/shared/lib/query-client.ts"
  - "src/app/providers/**"
---

# 데이터 층

서버 상태는 TanStack Query 5가 맡고 요청은 `src/shared/api/http.ts`의 `http`가 브라우저 `fetch`로 보낸다. 백엔드 규약은 geoji-server 저장소의 `API.md`다. 기준 주소는 `VITE_API_BASE_URL`에서 온다. 파일마다 하는 일은 `CONTRIBUTING.md` 데이터 층 절의 표에 있다.

## 층

| 층                                                                | 아는 것                                                                    |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `shared/api/http.ts`                                              | HTTP만. 쿼리 스트링과 JSON 바디, Authorization 헤더, 타임아웃, `ApiError`  |
| 엔티티 모듈 (`shared/api/{entity}.ts`, `features/{feature}/api/`) | 엔드포인트와 응답 타입, 요청 함수, `queryOptions` 팩토리, 서버 값의 대응표 |
| `features/{feature}/hooks/`                                       | 변이. `useMutation`과 캐시 갱신                                            |
| 화면                                                              | `useQuery`와 변이 훅을 부르고 상태를 그린다                                |

## 규칙

- 요청은 `http`만 쓴다. 화면이나 훅에서 `fetch`를 직접 부르지 않고 Authorization 헤더를 손으로 붙이지 않는다
- 엔티티 모듈은 두 feature 이상이 쓰면 `src/shared/api/{entity}.ts`, 한 feature만 쓰면 그 feature의 `api/`에 둔다. 프로필(auth, home, me)과 방(home, room)은 shared다
- 키는 엔티티로 시작하는 계층이다. `["rooms"]`, `["rooms", "list"]`, `["rooms", "detail", id]`처럼 팩토리 함수로 만들고 `queryOptions`로 정의해 `useQuery`, `useSuspenseQuery`, `queryClient.prefetchQuery`가 같은 정의를 쓴다. 손으로 적은 키 배열은 한 글자 차이로 다른 캐시가 된다
- 조회 훅은 따로 만들지 않는다. 페이지에서 `useQuery(xxxQueries.yyy())`로 바로 부른다. 쿼리 여럿을 합쳐 계산하고 그 결과를 화면 둘 이상이 쓰는 자리만 `shared/hooks/`에 훅으로 둔다. `useMyMonthStats`가 그 경우다
- 변이는 쓰는 화면의 feature `hooks/`에 `useMutation` 훅으로 둔다. api 모듈은 캐시를 무효화하거나 채우지 않는다. 성공하면 `setQueryData`로 상세를 채우고 `invalidateQueries`로 목록을 다시 받는다. `onSuccess`가 그 Promise를 돌려주면 목록이 올 때까지 `isPending`이 유지된다
- 401은 전역에서 로그인 화면으로 보내므로 화면이 다루지 않는다. 그 밖은 `error.kind` 8종(badRequest, unauthorized, forbidden, notFound, conflict, server, network, timeout)으로 분기한다. `Register.defaultError`를 `ApiError`로 등록해 두어 `error`가 `ApiError`로 잡힌다
- 아직 없는 리소스는 queryFn 안에서 잡아 `null`로 바꾼다. 404로 오는 엔드포인트는 `notFound`를, 온보딩 전 프로필은 `GET /api/me`가 409로 오므로 `conflict`를 잡는다. `data === null`이 아직 없다는 뜻이다
- 재시도는 network와 timeout, server만 2회까지다. 4xx와 변이는 다시 시도하지 않는다
- 응답 타입은 `API.md`의 필드와 값을 그대로 옮긴다. 화면 모델과 값이 다른 것은 엔티티 모듈에 대응표를 두고 화면이 그 표로 바꾼다. 지금은 방 강도와 게시물 타입, 판결, 형량이 모두 서버 값과 `shared/domain/`의 타입이 같아 대응표를 둔 모듈이 없다
- 실패를 빈 값으로 감추지 않는다. `?? []`와 `?? ""`는 `isPending`과 `isError`를 따로 그리는 화면에서만 정당하다

실제 예시는 엔티티 모듈 `src/shared/api/rooms.ts`와 변이 훅 `src/features/room/hooks/useCreateRoom.ts`다.

## 확인하는 법

`check-conventions.sh`의 데이터 층 절이 `fetch` 직접 호출과 화면의 `http` 직접 import, api 모듈의 무효화, hooks 밖의 `useMutation`, 손으로 붙인 Authorization을 막고 `?? 빈값` 자리를 볼것으로 낸다. 무효화 키와 조회 키의 대조, 응답 필드 이름, 실패를 삼키는지는 review-data가 본다.
