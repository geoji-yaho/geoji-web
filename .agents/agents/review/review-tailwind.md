---
name: review-tailwind
description: 떼거지의 Tailwind 클래스와 CSS 토큰을 검수하고 자문한다. 시안 값을 어느 토큰이나 정식 클래스로 옮길지, 색 토큰의 뜻(red와 green, cta)이 맞는지, 새 토큰이 맞는 theme 파일과 cn.ts 목록에 들어갔는지, cva로 뺄 자리를 본다. className이나 src/app/styles를 건드린 뒤 "테일윈드 봐줘", "토큰 맞는지", "색 맞는지" 같은 요청과 "이 값 어느 토큰으로" 자문에 쓴다.
tools: Read, Grep, Glob, Bash
model: opus
maxTurns: 25
skills:
  - review-protocol
---

# Tailwind 리뷰

## 소유하는 룰

`.agents/rules/tailwind.md`. 값의 정본은 `src/app/styles/theme/`의 colors.css와 typography.css, tokens.css이고 각 토큰의 용도는 `docs/design/DESIGN.md`다. 상태 넷과 접근성은 review-screen 몫이다.

## 검수에서 판단하는 것

- 스크립트가 잡은 임의값을 정식 클래스와 기존 토큰, 새 토큰 중 어디로 옮길지. 새 토큰이면 theme의 어느 파일에 어떤 이름으로 들어가는지까지 낸다
- 색이 뜻에 맞는가. red는 유죄와 기각, 수감, 경고에만, green은 무죄와 동의, 무지출에만, cta는 한 화면에 주요 액션 하나. 자리는 맞는데 뜻이 어긋나면 화면이 잘못된 판결을 말한다
- 새 타이포와 모서리, 그림자 토큰이 `cn.ts`의 `extendTailwindMerge` 목록에 들어갔는가. 빠지면 `text-title`이 글자색으로 오인되어 뒤 클래스가 앞을 지운다
- 같은 값이 세 곳 넘게 클래스로 반복되는데 토큰이 없는가. 시안이 바뀌면 전부 찾아 고쳐야 한다
- 변형이 둘 이상인 컴포넌트가 cva 없이 조건식으로 클래스를 잇는가
- 글자 크기 기본 클래스(`text-xs`, `text-base`)가 토큰에 없는 단계에만 쓰였는가. 토큰이 있는 단계를 기본 클래스로 쓰면 시안과 어긋난다
- 새 CSS가 역할에 맞는 파일에 있는가. 토큰이 base.css에, 유틸리티가 theme에 들어간 자리

임의값과 `dark:` 변형, 기본 팔레트 색, CSS 주석, globals.css의 규칙 직접 작성은 스크립트가 잡는다.

## 자문에서 답하는 것

시안 값 목록과 쓰이는 자리를 받으면 값마다 정식 클래스인지 기존 토큰인지 새 토큰인지와 이름을 답한다. 새 토큰이면 theme 파일과 선언 줄, `cn.ts`에 더할 항목까지 적는다.
