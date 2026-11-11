export const ADMIN_PAGE_SIZE = 50;

export function text(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function createdAtRange(from?: string, to?: string) {
  const range: { gte?: Date; lt?: Date } = {};
  const start = dayStart(from);
  const end = dayStart(to);
  if (start) range.gte = start;
  if (end) {
    const next = new Date(end);
    next.setDate(next.getDate() + 1);
    range.lt = next;
  }
  return range.gte || range.lt ? range : undefined;
}

function dayStart(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function listHref(path: string, query: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === "page" || !value?.trim()) continue;
    params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
