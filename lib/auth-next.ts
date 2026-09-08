export function safeNext(value: string | null, fallback = '/dashboard'): string {
  if (!value || !value.startsWith('/') || /[\\\u0000-\u0020]/.test(value) || value.startsWith('//')) return fallback;
  try {
    const url = new URL(value, 'https://clavisprep.invalid');
    return url.origin === 'https://clavisprep.invalid' ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch { return fallback; }
}
