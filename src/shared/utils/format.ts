/** 금액에 천 단위 쉼표를 붙인다. 단위 원은 호출하는 쪽이 붙인다 */
export function formatAmount(amount: number) {
	return amount.toLocaleString("ko-KR");
}
