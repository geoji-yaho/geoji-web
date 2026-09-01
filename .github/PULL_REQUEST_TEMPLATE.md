## 변경 사항

<!-- 주요 변경 내용을 항목별로 정리 -->

-

## 관련 문서

<!-- 해당 항목만 남기고 나머지는 삭제 -->

- 제품: `docs/product/PRD.md` 범위 또는 성공 기준
- 기능 명세: `docs/product/SPEC.md` 기능 또는 기술 결정
- 로드맵: `docs/product/ROADMAP.md` 작업 순서 또는 하지 않기로 한 것
- 디자인 방향: `docs/design/DESIGN.md` 토큰 또는 카피 톤
- 화면 명세: `docs/design/DESIGN-SPEC.md` 화면 또는 공통 컴포넌트
- 운영: `docs/release/RUNBOOK.md` 배포와 장애 대응, 운영 절차
- 개인정보: `docs/release/PRIVACY.md` 수집 항목이 바뀌었을 때

공개 계약이나 동작 규칙을 바꿨다면 해당 문서를 이 PR에서 함께 고친다.

## 검증

<!-- CI(.github/workflows/ci.yaml)가 게이트를 돌린다. 로컬에서도 돌렸으면 표시한다 -->

- [ ] `pnpm check` (타입 검사, 빌드, 린트, 포맷 검사)
- [ ] 개발 서버에서 동작 확인

UI를 건드렸다면 아래도 확인한다.

- [ ] 모바일 세로, 태블릿, PC 폭에서 배치 확인
- [ ] 키보드만으로 조작 가능하고 포커스 표시가 보인다

## 머지 방법

**merge commit으로 머지해 주세요. squash는 쓰지 않습니다.**

squash로 압축하면 커밋 단위 이력이 사라지고 브랜치 조상 관계가 끊겨 다음 PR마다 충돌이 반복됩니다.
