// A tiny client for the Hourora time zone API (https://hourora.app/en/developers).
// No dependencies, no key: it wraps fetch, so it works in Node 18+, Deno, Bun and browsers.
// Every function returns the parsed JSON; a non-2xx answer throws an Error with `.status` and `.body`.

const BASE = "https://hourora.app/api/v1";

async function get(path, params = {}, { base = BASE, signal } = {}) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)]));
  const url = `${base}${path}${qs.size ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { accept: "application/json" }, signal });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(`Hourora API ${res.status} for ${url}`), { status: res.status, body });
  return body;
}

/** Current time in an IANA zone (`tz`) or a city (`city` slug). Without either: UTC. */
export const time = ({ tz, city } = {}, opts) => get("/time", { tz, city }, opts);

/** Convert a wall-clock time (ISO local, e.g. "2027-03-28T09:00") from one zone or city to another. Omit `time` for now. */
export const convert = ({ from, to, time }, opts) => get("/convert", { from, to, time }, opts);

/** Every time zone, or the zones of one country (ISO 3166-1 alpha-2, e.g. "US"). */
export const zones = ({ country } = {}, opts) => get("/zones", { country }, opts);

/** One zone: countries, cities, current state and its clock changes in `year`. */
export const zone = (id, { year } = {}, opts) => get(`/zones/${id.split("/").map(encodeURIComponent).join("/")}`, { year }, opts);

/** Search cities by name. */
export const cities = ({ q, limit, country }, opts) => get("/cities", { q, limit, country }, opts);

/** One city by slug, with its current time. */
export const city = (slug, opts) => get(`/cities/${encodeURIComponent(slug)}`, {}, opts);

/** The nearest listed city and its zone for a coordinate (approximate: zone borders are not modelled). */
export const lookup = ({ lat, lng }, opts) => get("/lookup", { lat, lng }, opts);

/** The tzdata release and data range the API is running. */
export const tzdata = (opts) => get("/tzdata", {}, opts);
