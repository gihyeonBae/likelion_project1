export function formatCurrency(value) {
  return `${new Intl.NumberFormat('ko-KR').format(value)}원`;
}

export function formatQuantity(value) {
  return `${new Intl.NumberFormat('ko-KR').format(value)}개`;
}
