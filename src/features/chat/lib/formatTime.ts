// "오후 3:42" 형태로 포맷. 카카오/당근 채팅의 시간 표기와 비슷하게.
export function formatKoreanTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
