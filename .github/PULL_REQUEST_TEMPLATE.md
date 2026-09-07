## 변경 사항

<!-- 주요 변경 내용을 항목별로 정리 -->

-

## 관련 문서

<!-- 해당 항목만 남기고 나머지는 삭제. 공개 계약이나 동작 규칙을 바꿨다면 해당 문서를 이 PR에서 함께 고친다 -->

- 제품: `docs/product/PRD.md`
- 기능 명세: `docs/product/SPEC.md`
- 로드맵: `docs/product/ROADMAP.md`
- 디자인 방향: `docs/design/DESIGN.md`
- 화면 명세: `docs/design/DESIGN-SPEC.md`
- 운영: `docs/release/RUNBOOK.md`
- 개인정보: `docs/release/PRIVACY.md`

## 검증

<!-- CI(.github/workflows/ci.yaml)가 게이트를 돌린다. 로컬에서도 돌렸으면 표시한다 -->

- [ ] `pnpm check` (타입 검사, 빌드, 린트, 포맷 검사)
- [ ] 개발 서버에서 동작 확인
- [ ] UI를 건드렸다면 모바일 폭에서 배치를 보고, 키보드만으로 조작되며 포커스 표시가 보이는지 확인

## 머지 방법

**merge commit으로 머지해 주세요. squash는 쓰지 않습니다.** squash로 압축하면 커밋 단위 이력이 사라지고 브랜치 조상 관계가 끊겨 다음 PR마다 충돌이 반복됩니다.
