export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const SAFE_CHARS = /[^a-zA-Z0-9 _-]/g;

export function sanitizeInput(value: string, maxLen = 80): string {
  return value
    .replace(SAFE_CHARS, '')
    .trim()
    .slice(0, maxLen);
}

export function fmt(n: number): string {
  return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '0';
}
