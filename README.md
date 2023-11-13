# **_Readable Time_**

Converts a date to a readable time string.

``` javascript
const timeago = toReadableTime({
  time
});

const now = new Date();
console.log({ now, time, timeago });
// now:  2023-11-13T08:12:00.000Z
// time: 2023-11-12T02:22:00.000Z
// timeago: Yesterday
```

Support for multiple formats:

- **_24-hour clock_**, eg. 23:15
- **_12-hour clock_**, eg. 11:15:00 PM
- **_12-hour clock short_**, eg. 11:15 PM
- **_12-hour clock short padded_**, eg. 01:15 AM
- **_Timeago clock_** with multiple formats:
  - _Concise_, eg. `Yesterday`
  - _Verbose_, eg. `2 days ago`
  - _Verbose Extended_ with only words for times less than 5, eg. `A few minutes ago`

Localization is supported with the following locales:
- `en-US` (_default_)

-----

# Timeago Clock

The Timeago clock is useful for displaying relative times,
such as "2 days ago" or "A few moments ago".

The `concise` format displays:

- `Just now` when within a minute
- The time when within the last day
- `Yesterday` when within the last two days
- The day of the week when within the last week
- The date when beyond a week

The `verbose` format displays:

- `A few moments ago` when within a minute
- `X minutes ago` when within an hour
- `X hours ago` when within a day
- `X days ago` when within a week
- `X weeks ago` when within a month
- `X months ago` when within a year
- `X years ago` when beyond two years

The `verbose extended` with only words for times less than 5 format displays:

- `A few moments ago` when within a minute
- `A couple of minutes ago` when within 2 minutes
- `A few minutes ago` when within 5 minutes
- `X minutes ago` when within an hour
- `An hour ago` when within 2 hours
- `A few hours ago` when within 5 hours
- `X hours ago` when within a day
- `A day ago` when within 2 days
- `A few days ago` when within 5 days
- `X days ago` when within a week
- `A week ago` when within 2 weeks
- `A few weeks ago` when within 5 weeks
- `X weeks ago` when within a month
- `A month ago` when within 2 months
- `A few months ago` when within 5 months
- `X months ago` when within a year
- `A year ago` when within 2 years
- `A few years ago` when within 5 years
- `X years ago` when beyond 5 years

-----

# Parameters

## `time`

The date to convert to a readable time string.

## `format`

The format to convert the date to. Defaults to `timeago`.

- `clock-24`: 24-hour clock, eg. 23:15
- `clock-long`: 12-hour clock, eg. 11:15:00 PM
- `clock-short`: 12-hour clock short, eg. 11:15 PM
- `clock-short-pad`: 12-hour clock short padded, eg. 01:15 AM
- `timeago`: Timeago clock with multiple formats.

## `locale`

The locale to use for formatting. Defaults to `en-US`.

## `options`

The options to use for formatting.

#### `verbose`

Whether to use the verbose format for the timeago clock. Defaults to `false`.

#### `convertToWords`

Whether to convert the timeago clock to words, eg. `A few minutes ago`. Works for both concise & verbose formats. Defaults to `true`.

#### `includeAgoSuffix`

Whether to include the `ago` suffix for the timeago clock. Defaults to `true`.

#### `includeToday`

Whether to include `Today` for times within the past day for the timeago clock. Defaults to `true`.

#### `includeJustNow`

Whether to include `Just now` for times within the past minute for the timeago clock. Defaults to `true`.

#### `longTimeAgoThresholdDays`

The threshold in days to use for the timeago clock. If the time is beyond this threshold, the timeago clock will display `A long time ago`. Defaults to `-1`.

-----

# Examples

## iMessage Style Timestamps

``` javascript
const createdAt = Date.now();

const day = toReadableTime({
  time: createdAt,
  options: {
    includeToday: true,
    includeJustNow: false
  }
});
const time = toReadableTime({
  time: createdAt,
  format: "clock-short" // 12-hour clock
});

const timeago = `${day} ${time}`;

console.log(timeago);
// Today 11:15 PM
```

-----
