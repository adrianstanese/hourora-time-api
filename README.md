# Hourora time zone API

A free JSON API for world time, built on the IANA time zone database. It gives you the current time anywhere,
conversions that handle daylight saving correctly, every zone with its clock changes, city search and coordinate
lookup.

**There is no key, no sign-up, and nothing to install.** CORS is open, so you can call it straight from a browser.

It is the same engine that runs [hourora.app](https://hourora.app). The full interactive reference is at
**[hourora.app/en/developers](https://hourora.app/en/developers)**.

This repository holds the documentation, a small dependency-free JavaScript client and runnable examples. The API
itself is hosted at `https://hourora.app/api/v1`.

## At a glance

| | |
|---|---|
| Base URL | `https://hourora.app/api/v1` |
| Format | JSON (UTF-8), `GET` only |
| Authentication | None |
| CORS | Every origin |
| Rate limit | 120 requests per minute per client. Please cache responses |
| Time data | IANA tzdata, updated with each IANA release (`/tzdata` tells you which) |
| Description | [OpenAPI 3.1](https://hourora.app/api/v1/openapi.json) (a snapshot is in [`openapi.json`](openapi.json)) |

## Endpoints

| Endpoint | What it returns |
|---|---|
| `GET /time?tz=Europe/London` or `?city=london` | The current local time, UTC offset, abbreviation, whether daylight saving time is in force, and the next clock change. With no parameters: UTC. |
| `GET /convert?from=…&to=…&time=2027-03-28T09:00` | A wall-clock time converted between two zones or cities. It also says whether that time doesn't exist (spring forward) or happens twice (fall back). |
| `GET /zones?country=US` | Every zone, or the zones of one country. |
| `GET /zones/Europe/Bucharest?year=2027` | One zone: its countries and cities, its current state, and its clock changes in that year. |
| `GET /cities?q=paris&limit=5` | City search across about 7,200 cities. |
| `GET /cities/london` | One city, with its time zone and current time. |
| `GET /lookup?lat=44.43&lng=26.10` | The nearest listed city and its zone. This is approximate: zone borders are not modelled. |
| `GET /tzdata` | The tzdata release and the range of dates the data covers. |

Times are ISO 8601. Offsets are given in minutes east of UTC (New York in winter is `-300`) and also as text
(`-05:00`).

## Quick start

```sh
curl -s "https://hourora.app/api/v1/time?tz=Asia/Tokyo"
```

```js
// Node 18+, Deno, Bun or a browser. Copy client/hourora.mjs into your project.
import { time, convert } from "./client/hourora.mjs";

const now = await time({ tz: "Europe/London" });
console.log(now.time, now.abbreviation);          // e.g. 12:28:36 GMT

const call = await convert({ from: "America/New_York", to: "Asia/Tokyo", time: "2027-03-15T09:00" });
console.log(call.to.local);                        // 2027-03-15T22:00:00 (US summer time starts 14 March)
```

```python
import json, urllib.request
with urllib.request.urlopen("https://hourora.app/api/v1/time?tz=Asia/Kolkata") as r:
    print(json.load(r)["time"])
```

More examples are in [`examples/`](examples): `curl.sh`, `node.mjs`, `time_now.py` and `browser.html`.

## Example response

`GET /convert?from=Europe/London&to=Asia/Tokyo&time=2027-03-28T09:00`. This is the morning the UK moves its clocks
forward:

```json
{
  "status": "ok",
  "requested": "2027-03-28T09:00:00",
  "utc": "2027-03-28T08:00:00.000Z",
  "from": { "zone": "Europe/London", "local": "2027-03-28T09:00:00", "offset": "+01:00", "abbreviation": "BST", "dst": true },
  "to":   { "zone": "Asia/Tokyo",    "local": "2027-03-28T17:00:00", "offset": "+09:00", "abbreviation": "JST", "dst": false }
}
```

The response is shortened here; the API returns more fields.

## Terms

The API is free for personal and commercial use, with no key and no account. Attribution is appreciated but not
required: a link to [hourora.app](https://hourora.app) near where the data appears.

It is provided as is, with no service-level agreement or guarantee of availability. Don't use it where a wrong or
missing time could cause harm.

Version 1 stays compatible: new fields may be added, but nothing is removed or renamed. Please stay within the rate
limit. The full terms are at [hourora.app/en/developers#terms](https://hourora.app/en/developers#terms).

The code in this repository (the client and the examples) is MIT-licensed. Time zone rules come from the
[IANA Time Zone Database](https://www.iana.org/time-zones), which is in the public domain.

## Questions and issues

Open an issue in this repository, or write to contact@stanese.ro.
