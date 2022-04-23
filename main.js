import { index } from "./index.js";
import { CronJob } from "cron";
import { COIN_LIST } from "./COIN_LIST.js";
import { Tweet } from "./Twitter.js";
import { Telegram } from "./Telegram.js";
import { wrapUpTrade } from "./Binance.js";

let main = (interval) => {
  return async function () {
    let response = await index(interval, COIN_LIST);

    if (response) {
      let coin_list = response.result.map((el) => {
        return el.symbol;
      });
      let finalResponse = await index(interval, coin_list);
      if (finalResponse) {
        // SENDING TO TWITTER AND TELEGRAM
        Tweet(finalResponse.message, "Confirm Calls");
        Telegram(finalResponse.message, "Confirm Calls");

        // Binance trade
        let data = await response.result.map((el) => {
          return el;
        });
        wrapUpTrade(interval, data[0]);
      }
    } else {
      Telegram("No coin found in interval", interval);
      console.log("No coin found in ", interval);
    }
  };
};

// WORKING TIME FRAMES

// 1 Hour
var job_1h = new CronJob(
  "00 29 * * * *",
  main("1h"),
  null,
  true,
  "Asia/Kolkata"
);
console.log("Started for 1h");
job_1h.start();

// 2h
var job_2h = new CronJob(
  "00 29 05,07,09,11,13,15,17,19,21,23,01,03 * * *",
  main("2h"),
  null,
  true,
  "Asia/Kolkata"
);
console.log("Started for 2h");
job_2h.start();

// 4 Hour
var job_4h = new CronJob(
  "00 29 01,05,09,13,17,21 * * *",
  main("4h"),
  null,
  true,
  "Asia/Kolkata"
);
job_4h.start();
console.log("Started for 4h");

// 6 Hour
var job_6h = new CronJob(
  "00 29 05,11,17,23 * * *",
  main("6h"),
  null,
  true,
  "Asia/Kolkata"
);
job_6h.start();
console.log("Started for 6h");

// 1D
var job_1D = new CronJob(
  "30 28 05 * * *",
  main("1d"),
  null,
  true,
  "Asia/Kolkata"
);
console.log("Started for 1d");
job_1D.start();

// 1w
var job_1w = new CronJob(
  "00 27 05 * * 01",
  main("1w"),
  null,
  true,
  "Asia/Kolkata"
);
console.log("Started for 1w");
job_1w.start();

// 1M
var job_1M = new CronJob(
  "00 27 05 01 JAN-DEC *",
  main("1M"),
  null,
  true,
  "Asia/Kolkata"
);
job_1M.start();
console.log("Started for 1M");
