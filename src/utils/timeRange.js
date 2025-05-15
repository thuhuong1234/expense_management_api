const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // <-- NEW

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(timezone);

const getTimeRange = (type) => {
  let from, to;
  from = dayjs().tz("Asia/Ho_Chi_Minh").startOf(`${type}`).toDate();
  to = dayjs().tz("Asia/Ho_Chi_Minh").endOf(`${type}`).toDate();
  return { from, to };
};

module.exports = { getTimeRange };
