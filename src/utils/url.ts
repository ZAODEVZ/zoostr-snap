export function getBaseUrl(req: Request): string {
  if (process.env.SNAP_PUBLIC_BASE_URL) {
    const url = process.env.SNAP_PUBLIC_BASE_URL.replace(/\/$/, '');
    return url.startsWith('http') ? url : `https://${url}`;
  }
  const forwarded = req.headers.get('x-forwarded-host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  if (forwarded) return `${proto}://${forwarded}`;
  const host = req.headers.get('host') ?? 'localhost:3010';
  return `http://${host}`;
}
