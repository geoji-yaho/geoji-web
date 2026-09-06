---
description: src 폴더 구조와 import 방향. 새 파일을 어디에 두고 무엇을 가져올 수 있는지
paths:
  - "src/**/*"
---

# 폴더 구조

Feature 기반 구조에 FSD 2.1의 pages-first 원칙을 더한 4층이다. 프론트엔드 둘이 20일 안에 화면 14개를 만드는 규모라 FSD 풀세트(widgets, entities, 세그먼트 규칙)는 쓰지 않는다. 화면 전용 코드는 페이지에 두고, 두 화면 이상에서 필요해질 때만 아래 층으로 내린다.

## 층

| 층       | 경로                      | 담는 것                                                                           |
| -------- | ------------------------- | --------------------------------------------------------------------------------- |
| app      | `src/app/`                | 앱 진입과 라우터, 전역 프로바이더. 화면을 URL에 연결한다                          |
| pages    | `src/pages/{screen}/`     | 화면 14개 하나씩. 그 화면에서만 쓰는 컴포넌트와 훅, API 호출은 여기 둔다          |
| features | `src/features/{feature}/` | 두 화면 이상에서 쓰는 기능 단위. 페이지에서 재사용 필요가 생길 때 내린다          |
| shared   | `src/shared/`             | 기능과 무관한 공용. 공통 컴포넌트, 디자인 토큰, API 클라이언트, 유틸, 도메인 타입 |

## import 방향

위에서 아래로만 가져온다. app은 pages를, pages는 features와 shared를, features는 shared를 가져온다.

- pages끼리 import하지 않는다. 같은 것이 두 페이지에 필요하면 features나 shared로 내린다
- features끼리 import하지 않는다. 필요하면 shared로 내리거나 페이지에서 조합한다
- shared는 위 층을 모른다. 도메인 타입(Post, Room, Verdict 같은 것)은 `src/shared/types/`에 두어 features가 서로를 가져오지 않게 한다

## 페이지 폴더 이름

팀 위키의 화면 구성 명세(S-01부터 S-14)와 하나씩 대응한다.

| 화면                     | 폴더                       |
| ------------------------ | -------------------------- |
| S-01 로그인              | `pages/login/`             |
| S-02 온보딩 월 예산 설정 | `pages/onboarding-budget/` |
| S-03 홈                  | `pages/home/`              |
| S-04 거지방 만들기       | `pages/room-create/`       |
| S-05 방 참여             | `pages/invite/`            |
| S-06 방 상세 피드        | `pages/room-feed/`         |
| S-07 방 상세 랭킹        | `pages/room-ranking/`      |
| S-08 방 상세 방 정보     | `pages/room-info/`         |
| S-09 지출 등록           | `pages/post-create/`       |
| S-10 판결 결과           | `pages/verdict/`           |
| S-11 판결 공유 카드      | `pages/verdict-card/`      |
| S-12 마이페이지          | `pages/my/`                |
| S-13 예산 변경           | `pages/my-budget/`         |
| S-14 배심원 투표         | `pages/vote/`              |

## 페이지와 기능 폴더 안

폴더 안은 역할로 나눈다. 없는 역할의 폴더는 미리 만들지 않는다.

```
pages/room-feed/
  RoomFeedPage.tsx     화면 컴포넌트. 라우터가 가져오는 진입점
  components/          이 화면 전용 컴포넌트
  hooks/               이 화면 전용 훅
  api.ts               이 화면 전용 API 호출

features/vote/
  components/
  hooks/
  api.ts
  model.ts             이 기능의 타입과 상태
```

## shared 안

```
shared/
  components/   공통 컴포넌트. 2026-09-06 기준 19종
  styles/       globals.css. 디자인 토큰 정본
  api/          백엔드 클라이언트. fetch 래퍼와 토큰 헤더
  lib/          순수 유틸. 금액 포맷, 날짜 계산
  hooks/        범용 훅
  types/        도메인 타입
  platform.ts   플랫폼 의존 기능 격리. PWA, 푸시, 공유 (MVP 스펙 기술 절)
```

## 지금 상태 (2026-09-06)

`src/shared/components/`, `src/shared/styles/`, `src/shared/types.ts`, `src/App.tsx`(컴포넌트 쇼케이스)만 있다. 라우터는 미도입이다. 첫 화면을 만들 때 `src/app/`과 `src/pages/`를 만들고 `App.tsx`의 쇼케이스는 그때 정리한다. `types.ts`는 `types/` 폴더로 옮긴다.

## 파일 이름

컴포넌트 파일은 PascalCase(`RoomCard.tsx`), 그 외는 camelCase(`useVote.ts`, `api.ts`). 폴더는 kebab-case.
