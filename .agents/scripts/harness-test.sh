#!/usr/bin/env bash
#
# harness-test. 검사 스크립트와 훅의 회귀 테스트. harness-check.sh 가 돌린다.
#
# 위반 아홉을 심은 픽스처로 check-conventions.sh 가 그 아홉을 잡는지, 명령 열여덟으로 guard-git.sh 가
# 막을 것을 막고 통과시킬 것을 통과시키는지 본다. 토큰을 쓰지 않는다.
# 픽스처에 심은 위반: 화살표 함수의 반환 타입, 뒤따르는 본문 주석, 격식체 동사 이름, ?? 0, 기능 폴더의 fetch,
# 동사 없는 export 함수 이름, 대문자 약어 roomID, on 없는 함수형 prop, 접두사 없는 boolean prop.
# main 에서의 커밋 차단은 현재 브랜치에 따라 결과가 달라 여기서 시험하지 않는다.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT

mkdir -p "$fixture/src/features/room/api"
git -C "$fixture" init -q
cat >"$fixture/src/features/room/api/rooms.ts" <<'EOF'
export const retrieveRooms = (roomId: string): string[] => [roomId];

export function countRooms(items: string[]) {
	const total = items.length; // 전체 개수
	return total ?? 0;
}

export async function loadRaw() {
	return fetch("/api/rooms");
}

export function memberName(items: string[]) {
	return items[0];
}
EOF
mkdir -p "$fixture/src/features/room/components"
cat >"$fixture/src/features/room/components/RoomCard.tsx" <<'EOF'
type RoomCardProps = {
	roomID: string;
	compactMode: boolean;
	select: (id: string) => void;
};

export function RoomCard({ roomID }: RoomCardProps) {
	return roomID;
}
EOF
git -C "$fixture" add src/features/room/api/rooms.ts src/features/room/components/RoomCard.tsx

fail=0
expect() {
	if printf '%s' "$2" | grep -q -- "$1"; then
		printf '  통과  %s\n' "$1"
	else
		printf '  실패  %s 가 출력에 없다\n' "$1"
		fail=1
	fi
}

printf '=== 검사 스크립트 ===\n\n'
output="$(CHECK_ROOT="$fixture" bash "$ROOT/.agents/scripts/check-conventions.sh" 2>&1)"
status=$?
[ "$status" -eq 1 ] && printf '  통과  종료 코드 1\n' || { printf '  실패  종료 코드 %s. 1 이어야 한다\n' "$status"; fail=1; }
expect "걸림  코드에 // 주석을 적었다" "$output"
expect "걸림  화면이나 훅이 fetch를 직접 부른다" "$output"
expect "볼것  적힌 반환 타입" "$output"
expect "볼것  격식체 동사로 시작하는 이름" "$output"
expect "볼것  빈 값으로 받는 자리" "$output"
expect "볼것  대문자 약어가 든 식별자" "$output"
expect "볼것  on으로 시작하지 않는 함수형 prop" "$output"
expect "볼것  접두사 없는 boolean prop" "$output"
expect "볼것  동사로 시작하지 않는 export 함수 이름" "$output"

printf '\n=== PreToolUse 훅 guard-git ===\n\n'
while IFS='|' read -r cmd want; do
	[ -n "$cmd" ] || continue
	printf '{"tool_input":{"command":%s}}' "$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$cmd")" |
		bash "$ROOT/.agents/hooks/guard-git.sh" 2>/dev/null
	got=$?
	if [ "$got" = "$want" ]; then
		printf '  통과  exit %s  %s\n' "$got" "$cmd"
	else
		printf '  실패  exit %s, 기대 %s  %s\n' "$got" "$want" "$cmd"
		fail=1
	fi
done <<'EOF'
git commit --no-verify -m x|2
git push --no-verify|2
LEFTHOOK=0 git commit -m x|2
git -c core.hooksPath=/dev/null commit -m x|2
git add -A|2
git add .|2
git push --force origin f|2
git push origin main|2
git add .env|2
git add src/a.ts .env.production|2
git add ./src/a.ts|0
git add src/a.ts src/b.ts|0
git add .env.example|0
git push --force-with-lease origin f|0
git push origin feature/x|0
printf "훅 건너뛰기 플래그 --no-verify 금지" > /tmp/x|0
grep -rn -- --no-verify .agents|0
ls -la|0
EOF

printf '\n'
[ "$fail" -eq 0 ] && printf '하네스 검사 통과\n' || { printf '하네스 검사 실패\n'; exit 1; }
