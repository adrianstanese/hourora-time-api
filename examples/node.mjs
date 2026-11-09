// node examples/node.mjs  (Node 18 or later)
import { time, convert, zone, cities, lookup, tzdata } from "../client/hourora.mjs";

const now = await time({ tz: "Europe/London" });
console.log(`London: ${now.time} ${now.abbreviation} (UTC${now.offset})`);

const call = await convert({ from: "America/New_York", to: "Asia/Tokyo", time: "2027-03-15T09:00" });
console.log(`09:00 in New York on 15 March 2027 is ${call.to.local.slice(11, 16)} in Tokyo (${call.to.local.slice(0, 10)})`);

const ro = await zone("Europe/Bucharest", { year: 2027 });
console.log(`Europe/Bucharest: ${ro.countries.map((c) => c.name).join(", ")}`);

const [paris] = (await cities({ q: "paris", limit: 1 })).cities;
console.log(`Paris is in ${paris.zone}`);

const here = await lookup({ lat: 44.43, lng: 26.1 });
console.log(`44.43, 26.10 → ${here.city.name} (${here.city.zone}), ${here.distanceKm} km away`);

console.log(`tzdata ${(await tzdata()).version}`);
