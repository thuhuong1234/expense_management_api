const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");
dayjs.extend(isoWeek);
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const getTimeRange = (type) => {
  let from, to;
  from = dayjs().utc().startOf(`${type}`).toDate();
  to = dayjs().utc().endOf(`${type}`).toDate();
  return { from, to };
};

module.exports = { getTimeRange };
