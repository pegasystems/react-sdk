import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import tzone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(tzone);

const types = ["fromNow", "customFormat"];

// value should be in ISO 8601 format.
function DateFormatter(
  value,
  { type = types[1], format = "DD/MM/YYYY", timezone } = {}
) {
  if (!value) return value;
  switch (type) {
    case types[1]:
      if (timezone) return dayjs(value).tz(timezone).format(format);
      return dayjs(value).format(format);
    case types[0]:
      return dayjs(value).from(dayjs());
    default:
      return value;
  }
}
// value should be in hh:mm:ss format (00:00:00 - 23:59:59).
function TimeFormatter(value, options) {
  if (!value) return value;
  const { locale = "en-US" } = options;
  const timeOnlyRegex = /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/;
  if (value.length === 8 && timeOnlyRegex.test(value)) {
    const tempDate = new Date();
    const hours = parseInt(value.substr(0, 2), 10);
    const minutes = parseInt(value.substr(3, 2), 10);
    const seconds = parseInt(value.substr(6, 2), 10);
    tempDate.setHours(hours);
    tempDate.setMinutes(minutes);
    tempDate.setSeconds(seconds);
    return tempDate.toLocaleTimeString(locale);
  }
  return DateFormatter(value, options);
}

export default {
  "DateTime-Long": (value, options) =>
    DateFormatter(value, { ...options, type: "customFormat", format: "LLL" }),
  "DateTime-Short": (value, options) =>
    DateFormatter(value, {
      ...options,
      type: "customFormat",
      format: "MMM DD, YYYY"
    }),
  "DateTime-Since": (value) => DateFormatter(value, { type: "fromNow" }),
  "Time-Only": (value, options) =>
    TimeFormatter(value, {
      ...options,
      type: "customFormat",
      format: "hh:mm:ss A"
    }),
  convertToTimezone: (value, options) => {
    return value && options && options.timezone
      ? DateFormatter(value, {
          ...options,
          type: "customFormat",
          format: "YYYY-MM-DDTHH:mm:ss"
        })
      : value;
  },
  convertFromTimezone: (value, timezone) =>
    value && timezone ? dayjs.tz(value, timezone).utc().format() : value,
  Date: (value, options) =>
    DateFormatter(value, { type: "customFormat", ...options })
};
