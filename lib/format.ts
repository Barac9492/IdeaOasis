// lib/format.ts
export const formatDateKR = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
export const formatKRW = (n?: number) =>
  typeof n === 'number' ? new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(n) : '';
