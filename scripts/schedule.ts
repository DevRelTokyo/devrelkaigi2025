import { readFileSync, writeFileSync } from "fs";
const ary = JSON.parse(readFileSync("./app/data/timeschedule.json").toString());

const results = {
  2: {
    en: {}, ja: {},
  },
  3: {
    en: {}, ja: {},
  }
};

ary.forEach((item: any) => {
  const day = Number.parseInt(item.day);
  const { start, language } = item;
  if (!results[day][language][start]) {
    results[day][language][start] = [];
  }
  delete item.start;
  delete item.language;
  delete item.send;
  delete item.day;
  delete item.range;
  results[day][language][start].push(item);
});

writeFileSync("./app/data/schedule.json", JSON.stringify(results, null, 2));