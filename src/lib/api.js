const BASE = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const res = await fetch(\\\\, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(\\ \\);
  return res.status === 204 ? null : res.json();
}
