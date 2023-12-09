/**
 * READABLE TIME
 *
 * Converts a date to a localized readable time string.
 *
 * LICENSE MIT
 */

type ClockFormatting =
  /** 24-hour clock, eg. 23:15 */
  | "clock-24"
  /** 12-hour clock, eg. 11:15:00 PM */
  | "clock-long"
  /** 12-hour clock, eg. 11:15 PM */
  | "clock-short"
  /** 12-hour clock, padded, eg. 01:15 AM */
  | "clock-short-pad"
  /** 12-hour clock that converts times to words, eg. 11:15 PM -> A few moments ago */
  | "timeago";

const dayInMilliseconds = 1000 * 60 * 60 * 24;
const isWithinYesterday = (date: Date) => Date.now() - date.getTime() <= dayInMilliseconds;
const isPastMidnight = (date: Date) => !isWithinYesterday(date) || date.getDay() !== new Date().getDay();
const isWithinWeek = (date: Date) => Date.now() - date.getTime() <= dayInMilliseconds * 7;
const isWithinMonth = (date: Date) => Date.now() - date.getTime() <= dayInMilliseconds * 31;
const isWithinYear = (date: Date) => Date.now() - date.getTime() <= dayInMilliseconds * 365;

const readableTimeLabels: any = {
  "en-US": {
    justnow: "Just now",
    fewmoments: "A few moments",
    today: "Today",
    yesterday: "Yesterday",
    longtime: "A long time",
    ago: "ago",
    units: {
      minute: "minute",
      hour: "hour",
      day: "day",
      week: "week",
      month: "month",
      year: "year"
    },
    deltas: {
      2: "couple of",
      3: "few",
      4: "few"
    },
    article: {
      a: "A",
      an: "An"
    },
    days: {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    },
    months: {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    }
  }
};

const getReadableTimeLabel = ({
  minutesDelta = 0,
  hoursDelta = 0,
  daysDelta = 0,
  weeksDelta = 0,
  monthsDelta = 0,
  yearsDelta = 0,
  convertToWords = true,
  includeAgoSuffix = true,
  longTimeAgoThresholdDays = -1,
  locale = "en-US"
}: {
  minutesDelta?: number;
  hoursDelta?: number;
  daysDelta?: number;
  weeksDelta?: number;
  monthsDelta?: number;
  yearsDelta?: number;
  convertToWords?: boolean;
  includeAgoSuffix?: boolean;
  longTimeAgoThresholdDays?: number;
  locale?: string;
}): string => {
  let prefix: string = "";
  let unitLabel: string = "";
  const suffix: string = includeAgoSuffix
    ? ` ${readableTimeLabels[locale].ago}`
    : "";

  if (0 <= longTimeAgoThresholdDays && longTimeAgoThresholdDays <= daysDelta)
    return `${readableTimeLabels[locale].longtime}${suffix}`;

  const renderTimeLabel = ({
    delta,
    unit,
    article = readableTimeLabels[locale].article.a
  }: {
    delta: number;
    unit: string;
    article?: string;
  }) => {
    const units = readableTimeLabels[locale].units[unit];
    if (convertToWords && delta < 5)
      prefix =
        article +
        (1 < delta ? ` ${readableTimeLabels[locale].deltas[delta]}` : "");
    else prefix = delta.toString();
    unitLabel = delta === 1 ? units : `${units}s`;
  };

  if (0 < yearsDelta) renderTimeLabel({ delta: yearsDelta, unit: "year" });
  else if (0 < monthsDelta)
    renderTimeLabel({ delta: monthsDelta, unit: "month" });
  else if (0 < weeksDelta) renderTimeLabel({ delta: weeksDelta, unit: "week" });
  else if (0 < daysDelta) renderTimeLabel({ delta: daysDelta, unit: "day" });
  else if (0 < hoursDelta)
    renderTimeLabel({
      delta: hoursDelta,
      unit: "hour",
      article: readableTimeLabels[locale].article[hoursDelta === 1 ? "an" : "a"]
    });
  else renderTimeLabel({ delta: minutesDelta, unit: "minute" });
  return `${prefix} ${unitLabel}${suffix}`;
};

const readableTimesLUT = {
  "clock-24": ({ time, locale }: { time: Date | number; locale: string }) => {
    const date = new Date(time);
    return `${date.getHours()}:${date.getMinutes()}`;
  },
  "clock-long": ({ time, locale }: { time: Date | number; locale: string }) => {
    const date = new Date(time);
    return date.toLocaleTimeString(locale);
  },
  "clock-short": ({
    time,
    locale
  }: {
    time: Date | number;
    locale: string;
  }) => {
    const date = new Date(time);
    return date.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "numeric"
    });
  },
  "clock-short-pad": ({
    time,
    locale
  }: {
    time: Date | number;
    locale: string;
  }) => {
    const date = new Date(time);
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit"
    });
  },
  timeago: ({
    time,
    locale,
    options = {}
  }: {
    time: Date | number;
    locale: string;
    options?: any;
  }) => {
    const {
      verbose,
      convertToWords = true,
      includeAgoSuffix = true,
      includeToday = false,
      includeJustNow = true,
      daysOfWeek = false,
      longform = false,
      longTimeAgoThresholdDays,
      abbreviateDays = 0,
      abbreviateMonths = 0, 
      abbreviatePeriod = ".",
    } = options;

    const date = new Date(time);
    const dateTime = date.getTime();
    const currentTime = Date.now();
    const currentDate = new Date(currentTime);
    const timeDelta = currentTime - dateTime;
    const minutesDelta = Math.floor(timeDelta / 1000 / 60);
    const hoursDelta = Math.floor(minutesDelta / 60);

    if (includeJustNow && minutesDelta < 1)
      return readableTimeLabels[locale][verbose ? "fewmoments" : "justnow"];

    if (verbose) {
      const daysDelta = Math.floor(hoursDelta / 24);
      const weeksDelta = Math.floor(daysDelta / 7);
      const monthsDelta = Math.floor(daysDelta / 30);
      const yearsDelta = Math.floor(daysDelta / 365);

      return getReadableTimeLabel({
        minutesDelta,
        hoursDelta,
        daysDelta,
        weeksDelta,
        monthsDelta,
        yearsDelta,
        convertToWords,
        includeAgoSuffix,
        longTimeAgoThresholdDays,
        locale
      });
    }
    const isWithinYesterday = timeDelta <= dayInMilliseconds;
    const isPastMidnight = !isWithinYesterday || date.getDay() !== currentDate.getDay();
    const isWithinWeek = timeDelta <= dayInMilliseconds * 7;

    if (convertToWords) {
      // Within the Last Day
      if (includeToday && hoursDelta < 24 && !isPastMidnight) {
        return readableTimeLabels[locale].today;
      }
      if (
        // Within 24 Hours, Past Midnight
        (hoursDelta < 24 && isPastMidnight) ||
        // Within the Last 2 Days
        (24 <= hoursDelta && hoursDelta < 48 && isWithinYesterday)
      ) {
        return readableTimeLabels[locale].yesterday;
      }
    }
    // Beyond the Last Day
    if (!isWithinYesterday) {
      if (convertToWords) {
        if (longform) {
          const endIndex = 0 < abbreviateMonths ? abbreviateMonths : Infinity;
          const endChar = 0 < abbreviateMonths ? abbreviatePeriod : "";
          const month = readableTimeLabels[locale]
            .months[date.getMonth()]
            .substring(0, endIndex) + endChar;
          return `${month} ${date.getDate()}, ${date.getFullYear()}`;
        }
        if (isWithinWeek) {
          const endIndex = 0 < abbreviateDays ? abbreviateDays : Infinity;
          const endChar = 0 < abbreviateDays ? abbreviatePeriod : "";
          return readableTimeLabels[locale]
            .days[date.getDay()]
            .substring(0, endIndex) + endChar;
        }
        if (daysOfWeek) {
          const endIndex = 0 < abbreviateDays ? abbreviateDays : Infinity;
          const endChar = 0 < abbreviateDays ? abbreviatePeriod : "";
          const day = readableTimeLabels[locale]
            .days[date.getDay()]
            .substring(0, endIndex) + endChar;
          const month = readableTimeLabels[locale]
            .months[date.getMonth()]
            .substring(0, endIndex) + endChar;
          return `${day}, ${month} ${date.getDate()}`;
        }
      }
      return date.toLocaleDateString(locale, {
        month: "numeric",
        day: "numeric",
        year: "numeric"
      });
    }
    // Within the Last Day
    const timeFormatted = date.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "numeric"
    });
    return timeFormatted;
  }
};

/**
 * Converts a date to a readable time string.
 *
 * Support for multiple formats:
 * - **24-hour clock**, eg. 23:15
 * - **12-hour clock**, eg. 11:15:00 PM
 * - **12-hour clock short**, eg. 11:15 PM
 * - **12-hour clock short padded**, eg. 01:15 AM
 * - **Timeago clock** with multiple formats:
 *  - _Concise_, eg. Yesterday
 *  - _Verbose_, eg. 2 days ago
 *  - _Verbose Extended_ with only words for times less than 5, eg. A few minutes ago
 *
 * Localization is supported with the following locales:
 * - `en-US` (default)
 *
 * The Timeago clock is useful for displaying relative times,
 * such as "2 days ago" or "A few moments ago".
 *
 * The concise format displays:
 * - 'Just now' when within a minute
 * - The time when within the last day
 * - 'Yesterday' when within the last two days
 * - The day of the week when within the last week
 * - The date when beyond a week
 *   > NOTE: If `daysOfWeek` is enabled, the day of the week, month and day when beyond a week
 *   > NOTE: If `longform` is enabled, the month, day, and year when beyond a week
 *
 * The verbose format displays:
 * - 'A few moments ago' when within a minute
 * - 'X minutes ago' when within an hour
 * - 'X hours ago' when within a day
 * - 'X days ago' when within a week
 * - 'X weeks ago' when within a month
 * - 'X months ago' when within a year
 * - 'X years ago' when beyond two years
 *
 * The verbose extended format with only words for times less than 5 displays:
 * - 'A few moments ago' when within a minute
 * - 'A couple of minutes ago' when within 2 minutes
 * - 'A few minutes ago' when within 5 minutes
 * - 'X minutes ago' when within an hour
 * - 'An hour ago' when within 2 hours
 * - 'A few hours ago' when within 5 hours
 * - 'X hours ago' when within a day
 * - 'A day ago' when within 2 days
 * - 'A few days ago' when within 5 days
 * - 'X days ago' when within a week
 * - 'A week ago' when within 2 weeks
 * - 'A few weeks ago' when within 5 weeks
 * - 'X weeks ago' when within a month
 * - 'A month ago' when within 2 months
 * - 'A few months ago' when within 5 months
 * - 'X months ago' when within a year
 * - 'A year ago' when within 2 years
 * - 'A few years ago' when within 5 years
 * - 'X years ago' when beyond 5 years
 *
 * @param time The date to convert to a readable time string.
 * @param format The format to convert the date to. Defaults to 'timeago'.
 *   - 'clock-24': 24-hour clock, eg. 23:15
 *   - 'clock-long': 12-hour clock, eg. 11:15:00 PM
 *   - 'clock-short': 12-hour clock short, eg. 11:15 PM
 *   - 'clock-short-pad': 12-hour clock short padded, eg. 01:15 AM
 *   - 'timeago': Timeago clock with multiple formats.
 * @param locale The locale to use for formatting. Defaults to 'en-US'.
 * @param options The options to use for formatting.
 *  - verbose: Whether to use the verbose format for the timeago clock. Defaults to false.
 *  - convertToWords: Whether to convert the timeago clock to words, eg. A few minutes ago. Works for both concise & verbose formats. Defaults to true.
 *  - includeAgoSuffix: Whether to include the 'ago' suffix for the timeago clock. Defaults to true.
 *  - includeToday: Whether to include 'Today' for times within the past day for the timeago clock. Defaults to false.
 *  - includeJustNow: Whether to include 'Just now' for times within a minute for the timeago clock. Defaults to true.
 *  - daysOfWeek: Whether to include the day of the week for the timeago clock. Defaults to false.
 *  - longform: Whether to use the longform date format for the timeago clock. Defaults to false.
 *  - longTimeAgoThresholdDays: The threshold in days to use for the timeago clock. If the time is beyond this threshold, the timeago clock will display 'A long time ago'. Defaults to -1.
 *  - abbreviateDays: The number of characters to abbreviate the days of the week to. Defaults to `0` (no abbreviation).
 *  - abbreviateMonths: The number of characters to abbreviate the months of the year to. Defaults to `0` (no abbreviation).
 *  - abbreviatePeriod: The character to use for abbreviating days & months. Defaults to `.`.
 * @returns A string representing the date in the specified format.
 */
const toReadableTime = ({
  time,
  format = "timeago",
  locale = "en-US",
  options = {}
}: {
  time: Date | number;
  format?: ClockFormatting;
  locale?: string;
  options?: any;
}): string => {
  return readableTimesLUT[format]({ time, locale, options });
};

export {
  toReadableTime,
  isWithinYesterday,
  isPastMidnight,
  isWithinWeek,
  isWithinMonth,
  isWithinYear
};
export type { ClockFormatting };
