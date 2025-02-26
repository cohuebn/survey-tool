import {
  getUnixTime,
  fromUnixTime,
  parseISO,
  add,
  isAfter,
  addMilliseconds,
  Duration,
  formatISO,
} from "date-fns";
import { utc } from "@date-fns/utc";
import { isNullOrUndefined } from "@survey-tool/core";

export function getRelativeTime(date: Date | number): string {
  const then = date instanceof Date ? date.getTime() : date;

  if (then <= 0) {
    return "Never";
  }

  const now = new Date().getTime();
  const elapsed = now - then;

  const seconds = elapsed / 1000;
  if (seconds < 60) {
    return seconds < 10 ? "Just moments ago" : `${Math.floor(seconds)} seconds ago`;
  }

  const minutes = elapsed / 60000;
  if (minutes < 60) {
    return minutes < 2 ? "About a minute ago" : `About ${Math.floor(minutes)} minutes ago`;
  }

  const hours = elapsed / (60000 * 60);
  if (hours < 24) {
    return hours < 2 ? "About an hour ago" : `About ${Math.floor(hours)} hours ago`;
  }

  const days = elapsed / (60000 * 60 * 24);
  return days < 2 ? "About a day ago" : `About ${Math.floor(days)} days ago`;
}

/**
 * Put a given date into a bin, where each bin is the provided "seconds" length long.
 * This is modeled after Timescale's time_bucket function; times are rounded down for
 * the given duration.
 * @param date The date to put into a bin
 * @param secondsPerBin How many seconds long should each bin be?
 */
export function binSeconds(date: Date, secondsPerBin: number): Date {
  const dateInSeconds = getUnixTime(date);
  const binnedSeconds = Math.floor(dateInSeconds / secondsPerBin) * secondsPerBin;
  return fromUnixTime(binnedSeconds);
}

/** Convert a value into a date:
 * 1. If it's already a Date, return it
 * 2. If it's a number, treat it as a Unix timestamp
 * 3. If it's a string containing only digits, treat it as a Unix timestamp
 * 4. If it's a string, parse it as an ISO date
 */
export function toDate(dateish: Date | string | number): Date {
  if (dateish instanceof Date) return dateish;
  if (typeof dateish === "number") return fromUnixTime(dateish);
  return /^\d+$/.test(dateish) ? fromUnixTime(parseInt(dateish, 10)) : parseISO(dateish);
}

/**
 * Convert a start date, end date, and duration into all dates that
 * fall within that range. This is inclusive of the start and end dates.
 * If a start date is after the end date, an empty array is returned.
 * @param startDate The start date of the range. This will be included in the result.
 * @param endDate The end date of the range. This will be included in the result.
 * @param duration The duration between each date in the range. E.g. set to { hours: 1 } to
 * get all dates every hour between the start and end date.
 */
export function toDateRange(startDate: Date, endDate: Date, duration: Duration): Date[] {
  if (isAfter(startDate, endDate)) return [];
  const dateRange = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dateRange.push(currentDate);
    currentDate = add(currentDate, duration);
  }
  const lastDateInRange = dateRange.at(-1);
  if (isNullOrUndefined(lastDateInRange) || isAfter(endDate, lastDateInRange)) {
    dateRange.push(endDate);
  }
  return dateRange;
}

type StartEndPair = {
  start: Date;
  end: Date;
};

/**
 * Convert a start date, end date, and duration into pairs of start and end dates
 * that fall within that range. This is inclusive of the start and end dates.
 * @param startDate The start date of the range. This will be included in the result.
 * @param endDate The end date of the range. This will be included in the result.
 * @param duration The duration between each date in the range. E.g. set to { hours: 1 } to
 * get all dates every hour between the start and end date.
 */
export function toStartEndDatePairs(
  startDate: Date,
  endDate: Date,
  duration: Duration,
): StartEndPair[] {
  const dateRange = toDateRange(startDate, endDate, duration);
  const pairs: StartEndPair[] = [];
  for (let index = 0; index < dateRange.length - 1; index++) {
    const amountToOffsetStart = pairs.length ? 1 : 0;
    const start = addMilliseconds(dateRange[index], amountToOffsetStart);
    const end = dateRange[index + 1];
    pairs.push({ start, end });
  }
  return pairs;
}

/**
 * Sometimes, you just want the date portion of a UTC date/time.
 * This function returns the date portion as a string
 * @param date The date to convert
 * @returns The date portion of the given date as a string
 */
export function asUtcDateString(utcDate: Date): string {
  return formatISO(utc(utcDate), { representation: "date" });
}
