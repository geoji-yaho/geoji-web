#!/usr/bin/env bash
#
# check-conventions. 룰 파일마다 적어 둔 grep 검사를 한 번에 돌린다.
#
# `.agents/rules/` 의 각 룰은 "확인하는 법" 절에 찾는 명령을 갖고 있다.
# 흩어져 있으면 아무도 전부 돌리지 않는다. 여기 모아 한 번에 돌린다.
#
# 기계가 판정할 수 있는 것만 넣는다. 판단이 필요한 것은 리뷰 에이전트 몫이다.
# 검사를 추가할 때는 근거가 되는 룰 파일 이름을 절 제목에 적는다.
#
# Usage: bash .agents/scripts/check-conventions.sh
# 막는 검사가 하나라도 걸리면 1로 끝난다.
# CHECK_ROOT 를 주면 그 디렉터리를 검사한다. harness-test.sh 가 픽스처를 넘기는 자리다.
#
# macOS bash 3.2 호환. grep -P와 연관 배열을 쓰지 않는다.

set -uo pipefail

REPO_ROOT="${CHECK_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

MAX_LINES=15
fail_count=0
pass_count=0
soft_count=0

# 검사 하나를 돌린다. 출력이 있으면 걸린 것이다.
check() {
	local title="$1"
	local cmd="$2"
	local out total

	out="$(eval "$cmd" 2>/dev/null)"

	if [ -z "$out" ]; then
		printf '  통과  %s\n' "$title"
		pass_count=$((pass_count + 1))
		return 0
	fi

	total="$(printf '%s\n' "$out" | wc -l | tr -d ' ')"
	printf '\n  걸림  %s  (%s건)\n' "$title" "$total"
	printf '%s\n' "$out" | head -"$MAX_LINES" | sed 's/^/        /'
	if [ "$total" -gt "$MAX_LINES" ]; then
		printf '        ... %s건 더 있다\n' "$((total - MAX_LINES))"
	fi
	printf '\n'
	fail_count=$((fail_count + 1))
}

# 판단이 필요한 검사. 자리를 알려 주되 실패로 세지 않는다.
soft_check() {
	local title="$1"
	local cmd="$2"
	local out total

	out="$(eval "$cmd" 2>/dev/null)"

	if [ -z "$out" ]; then
		printf '  없음  %s\n' "$title"
		return 0
	fi

	total="$(printf '%s\n' "$out" | wc -l | tr -d ' ')"
	printf '\n  볼것  %s  (%s건)\n' "$title" "$total"
	printf '%s\n' "$out" | head -"$MAX_LINES" | sed 's/^/        /'
	printf '\n'
	soft_count=$((soft_count + 1))
}

# 추적 중이거나 아직 추적되지 않은 텍스트 파일에서 금지 문자를 찾는다.
# 지워진 파일과 바이너리를 거르고 UTF-8로 읽어 한글이 바이트로 쪼개지지 않게 한다.
scan_symbols() {
	local pattern="$1"
	shift
	git ls-files -z --cached --others --exclude-standard -- "$@" |
		SCAN_RE="$pattern" perl -CSD -0 -ne '
			chomp;
			next unless -f $_;
			open(my $fh, "<:encoding(UTF-8)", $_) or next;
			local $/ = "\n";
			my $n = 0;
			while (my $line = <$fh>) {
				$n++;
				print "$_:$n: $line" if $line =~ /$ENV{SCAN_RE}/;
			}
			close $fh;
		'
}

# export 함수 이름의 첫 단어가 생태계 동사가 아닌 것을 찾는다. 제품 용어 동사와 유틸리티 이름 cn 도 목록에 있다.
noun_first_exports() {
	local verbs=" get set fetch load create update remove delete add toggle open close reset clear submit validate parse format find filter select build make use handle is has can should to from calculate count read write play apply render resolve subscribe show hide start stop init prepare check compare merge sort pick group join split copy download share cast judge sign emit notify run call cn "
	local line name first
	grep -rnE "^export (async )?function [a-z]|^export const [a-z][A-Za-z0-9]* = (async )?\(" src --include="*.ts" --include="*.tsx" 2>/dev/null |
		while IFS= read -r line; do
			name="${line#*export }"
			name="${name#async }"
			name="${name#function }"
			name="${name#const }"
			first="$(printf '%s' "$name" | sed -E 's/^([a-z]+).*/\1/')"
			case "$verbs" in
				*" $first "*) ;;
				*) printf '%s\n' "$line" ;;
			esac
		done
}

printf '\n=== 층과 경계 (folder-structure.md) ===\n\n'

check "feature나 shared가 다른 feature를 부른다" \
	'grep -rn "from \"@/features/" src/features src/shared --include="*.ts" --include="*.tsx"'

check "feature 안에서 자기 feature를 @/로 부른다" \
	'for d in src/features/*/; do n="$(basename "$d")"; grep -rn "from \"@/features/$n" "$d" --include="*.ts" --include="*.tsx"; done'

check "shared 안에서 shared를 @/로 부른다" \
	'grep -rn "from \"@/shared/" src/shared --include="*.ts" --include="*.tsx"'

check "app 안에서 app을 @/로 부른다" \
	'grep -rn "from \"@/app/" src/app --include="*.ts" --include="*.tsx"'

check "층을 넘는데 상대 경로를 썼다" \
	'grep -rn "from \"\.\./\.\./" src --include="*.ts" --include="*.tsx"'

check "feature 밖에서 index.ts를 거치지 않고 깊이 들어간다" \
	'grep -rn "from \"@/features/[a-z-]*/" src --include="*.ts" --include="*.tsx"'

check "features/{feature}/index.ts 밖에 배럴이 있다" \
	'find src -name "index.ts" -o -name "index.tsx" | grep -vE "^src/features/[a-z-]+/index\.ts$"'

check "export \*로 내보낸다" \
	'grep -rn "export \*" src --include="*.ts" --include="*.tsx"'

check "컴포넌트 파일 이름이 PascalCase가 아니다" \
	'find src/features src/shared -name "*.tsx" | grep -vE "/[A-Z][A-Za-z0-9]*\.tsx$"'

check "children을 PropsWithChildren 없이 직접 적었다" \
	'grep -rn "children?: ReactNode\|children: ReactNode" src --include="*.tsx" --include="*.ts"'

printf '\n=== Tailwind와 CSS (tailwind.md) ===\n\n'

check "Tailwind 임의값 대괄호를 썼다" \
	'grep -rnoE "(^|[\" ])[a-z-]+-\[[^]]+\]" src --include="*.tsx" --include="*.ts"'

check "dark: 변형을 썼다" \
	'grep -rn "[\" ]dark:" src --include="*.tsx" --include="*.ts"'

check "비워 둔 Tailwind 기본 팔레트 색을 썼다" \
	'grep -rnoE "(bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|accent|caret|shadow)-(gray|red|green|blue|yellow|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" src --include="*.tsx" --include="*.ts"'

check "globals.css에 @import와 @source 밖의 줄이 있다" \
	'grep -nvE "^[[:space:]]*(@import|@source|$)" src/app/styles/globals.css'

printf '\n=== 데이터 층 (api.md) ===\n\n'

check "화면이나 훅이 fetch를 직접 부른다" \
	'grep -rn "fetch(" src/features src/app --include="*.ts" --include="*.tsx"'

check "화면이 http를 직접 가져온다" \
	'grep -rn "shared/api/http" src/features/*/pages src/features/*/components src/app --include="*.ts" --include="*.tsx"'

check "api 모듈이 캐시를 무효화하거나 채운다" \
	'grep -rn "invalidateQueries\|setQueryData" src/shared/api src/features/*/api --include="*.ts"'

check "useMutation이 hooks 밖에 있다" \
	'grep -rln "useMutation(" src --include="*.ts" --include="*.tsx" | grep -v "/hooks/"'

check "Authorization 헤더를 손으로 붙인다" \
	'grep -rn "Authorization" src/features src/app --include="*.ts" --include="*.tsx"'

printf '\n=== 주석 (typescript.md 주석 절) ===\n\n'

check "코드에 // 주석을 적었다" \
	'grep -rnE "(^|[[:space:]])//[^/]" src --include="*.ts" --include="*.tsx" | grep -vE "eslint-|@ts-|prettier-ignore|https?://"'

check "CSS에 주석을 적었다" \
	'grep -rn "/\*" src --include="*.css"'

check "HTML에 주석을 적었다" \
	'grep -n "<!--" index.html'

check "JSX에 {\" \"} 공백 표현식을 썼다" \
	'grep -rn "{\" \"}" src --include="*.tsx"'

printf '\n=== 한국어 표기 (전역 korean-writing.md) ===\n\n'

check "문서에 가운뎃점이나 화살표, em dash, 이모지, 한자를 썼다" \
	'scan_symbols "[\x{00B7}\x{2022}\x{2013}\x{2014}\x{2190}-\x{21FF}\x{2460}-\x{24FF}\x{2700}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}\x{1F300}-\x{1FAFF}\x{3400}-\x{4DBF}\x{4E00}-\x{9FFF}]" ":(glob)docs/**/*.md" ":(glob)*.md" ":(glob)scripts/**/*" ":(glob).agents/**/*" ":(glob).claude/**/*" ":(glob).codex/**/*" ":(glob).github/**/*"'

check "소스에 가운뎃점이나 화살표, em dash, 한자를 썼다. 반응 이모지는 제품 데이터라 보지 않는다" \
	'scan_symbols "[\x{00B7}\x{2013}\x{2014}\x{2190}-\x{21FF}\x{3400}-\x{4DBF}\x{4E00}-\x{9FFF}]" ":(glob)src/**/*.ts" ":(glob)src/**/*.tsx" ":(glob)src/**/*.css" "index.html"'

printf '\n=== 판단이 필요한 자리 (막지 않는다) ===\n\n'

soft_check "적힌 반환 타입. 좁히는 함수와 자기 참조 함수만 예외다 (typescript.md 반환 타입 절)" \
	'{ grep -rnE "^[[:space:]]*(export )?(async )?function [A-Za-z_$][A-Za-z0-9_$]*(<[^>]*>)?\(.*\)[[:space:]]*:[[:space:]]*[A-Za-z]" src --include="*.ts" --include="*.tsx"; grep -rnE "^[[:space:]]*(export )?(const|let) [A-Za-z_$][A-Za-z0-9_$]* = (async )?(<[^>]*>)?\([^)]*\)[[:space:]]*:[[:space:]]*[A-Za-z]" src --include="*.ts" --include="*.tsx"; } | grep -v " is " | grep -v "\.d\.ts"'

soft_check "JSDoc. 이름과 타입이 말하지 못하는 것만 남긴다 (typescript.md 주석 절)" \
	'grep -rn "/\*\*" src --include="*.ts" --include="*.tsx"'

soft_check "격식체 동사로 시작하는 이름 (typescript.md 이름 절의 표 왼쪽)" \
	'grep -rnE "\b(acquire|obtain|retrieve|release|dispose|terminate|invoke|execute|perform|instantiate|materialize|initialize|utilize|leverage|populate|traverse)[A-Z(]" src --include="*.ts" --include="*.tsx"'

soft_check "빈 값으로 받는 자리. 실패를 삼키는지 본다 (api.md 규칙 절)" \
	'grep -rnE "\?\? (\[\]|0|\"\"|\{\})" src --include="*.ts" --include="*.tsx"'

soft_check "console을 직접 쓴다 (typescript.md 단언과 조건 절)" \
	'grep -rnE "console\.(log|warn|error|info|debug)" src --include="*.ts" --include="*.tsx"'

soft_check "대문자 약어가 든 식별자. Id와 Url처럼 일반 단어로 적는다 (typescript.md 이름 절)" \
	'grep -rnoE "\b[a-z][A-Za-z0-9]*(ID|URL|HTTP|API|JSON|HTML|CSS|KST)\b" src --include="*.ts" --include="*.tsx" | grep -vE "innerHTML|toJSON"'

soft_check "on으로 시작하지 않는 함수형 prop (typescript.md 이름 절)" \
	'grep -rnE "^[[:space:]]+[a-z][A-Za-z0-9]*\??:[[:space:]]*\([^)]*\)[[:space:]]*=>" src --include="*.tsx" | grep -vE "[[:space:]](on|render)[A-Z][A-Za-z0-9]*\??:|Fn\??:|[[:space:]](initial|animate|enter|exit)\??:"'

soft_check "접두사 없는 boolean prop. is와 has, can, should 또는 HTML 속성 이름 (typescript.md 이름 절)" \
	'grep -rnE "^[[:space:]]+[a-z][A-Za-z0-9]*\??:[[:space:]]*boolean" src --include="*.tsx" --include="*.ts" | grep -vE "[[:space:]](is|has|can|should)[A-Z]|[[:space:]](disabled|open|selected|checked|active|hidden|required|readOnly|loading|pending|visible|expanded|multiline|autoFocus|multiple|enabled)\??:"'

soft_check "동사로 시작하지 않는 export 함수 이름 (typescript.md 이름 절)" \
	'noun_first_exports'

soft_check "훅만 내보내는데 파일 이름이 훅 이름이 아니다 (folder-structure.md 파일 이름 절)" \
	'for f in $(grep -rl "^export function use[A-Z]" src --include="*.ts" 2>/dev/null); do
		case "$f" in */use[A-Z]*.ts) continue ;; esac
		[ "$(grep -c "^export" "$f")" = "$(grep -c "^export function use[A-Z]" "$f")" ] && echo "$f"
	done'

printf '\n=== 지우면 안 되는 지시문 주석 ===\n\n'

directives="$(grep -rnE "eslint-disable|@ts-nocheck|@ts-expect-error|@ts-ignore|prettier-ignore|/// <reference" \
	src eslint.config.js vite.config.ts 2>/dev/null)"
if [ -z "$directives" ]; then
	printf '  없음. 주석을 일괄로 지워도 깨질 것이 없다\n'
else
	printf '%s\n' "$directives" | sed 's/^/        /'
	printf '\n  위 줄은 도구에 주는 명령이다. 주석을 지울 때 함께 지우지 않는다\n'
fi

printf '\n=== 결과 ===\n\n'
printf '  막는 검사 통과 %s, 걸림 %s. 판단이 필요한 자리 %s\n\n' "$pass_count" "$fail_count" "$soft_count"

if [ "$fail_count" -gt 0 ]; then
	printf '  걸린 것은 제목의 룰 파일을 열어 대신 쓰는 표기로 옮긴다\n\n'
	exit 1
fi
exit 0
