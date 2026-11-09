# python3 examples/time_now.py  (standard library only)
import json
import urllib.parse
import urllib.request

BASE = "https://hourora.app/api/v1"


def get(path, **params):
    query = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    req = urllib.request.Request(f"{BASE}{path}?{query}", headers={"Accept": "application/json", "User-Agent": "hourora-time-api-example"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return json.load(res)


now = get("/time", tz="Asia/Kolkata")
print(f"Kolkata: {now['time']} {now['abbreviation']} (UTC{now['offset']})")

call = get("/convert", **{"from": "Europe/Berlin", "to": "America/Sao_Paulo", "time": "2027-10-31T14:00"})
print(f"14:00 in Berlin on 31 October 2027 is {call['to']['local'][11:16]} in São Paulo")
