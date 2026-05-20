export function formatDate(dateStr: string | undefined, locale = 'tr-TR') {
  if (!dateStr) return { date: '—', time: '' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: '—', time: '' };
  return {
    date: d.toLocaleDateString(locale),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
}

export function calculateRemainingDays(expiresAt: string | number) {
  if (!expiresAt) return 0;
  const today = new Date();
  const expireDate = new Date(expiresAt);
  const diffTime = expireDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
