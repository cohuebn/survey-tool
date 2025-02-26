import { parseISO, getUnixTime } from "date-fns";

import { asUtcDateString, binSeconds, toDate, toDateRange, toStartEndDatePairs } from "./index";

describe("date-time-utils", () => {
  describe("binSeconds", () => {
    type BinTestCase = {
      input: string;
      binInSeconds: number;
      expected: string;
    };

    const testCases: BinTestCase[] = [
      {
        input: "2023-01-02T17:45:05Z",
        binInSeconds: 5,
        expected: "2023-01-02T17:45:05Z",
      },
      {
        input: "2023-01-02T17:45:33Z",
        binInSeconds: 5,
        expected: "2023-01-02T17:45:30Z",
      },
      {
        input: "2023-01-02T17:45:33Z",
        binInSeconds: 10,
        expected: "2023-01-02T17:45:30Z",
      },
      {
        input: "2023-02-28T17:45:59Z",
        binInSeconds: 10,
        expected: "2023-02-28T17:45:50Z",
      },
      {
        input: "2023-02-28T17:45:59Z",
        binInSeconds: 60,
        expected: "2023-02-28T17:45:00Z",
      },
      {
        input: "2023-02-28T17:45:59Z",
        binInSeconds: 120,
        expected: "2023-02-28T17:44:00Z",
      },
    ];
    testCases.forEach((testCase) => {
      it(`should bin date. input: ${testCase.input}, bin: ${testCase.binInSeconds}`, () => {
        const result = binSeconds(parseISO(testCase.input), testCase.binInSeconds);
        expect(result).toEqual(parseISO(testCase.expected));
      });
    });
  });

  describe("toDate", () => {
    it("should convert an ISO string into a date", () => {
      const input = "2023-01-02T03:04:05Z";
      const result = toDate(input);

      const expected = new Date(input);
      expect(result).toEqual(expected);
    });

    it("should convert an epoch number into a date", () => {
      const expected = new Date("2023-01-02T03:04:05Z");

      const result = toDate(getUnixTime(expected));

      expect(result).toEqual(expected);
    });

    it("should convert an epoch string into a date", () => {
      const expected = new Date("2023-01-02T03:04:05Z");

      const result = toDate(`${getUnixTime(expected)}`);

      expect(result).toEqual(expected);
    });

    it("should pass through a date as itself", () => {
      const expected = new Date("2023-01-02T03:04:05Z");

      const result = toDate(expected);

      expect(result).toEqual(expected);
    });
  });

  describe("toDateRange", () => {
    it("should return all dates within the given range (1 hour interval)", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-02T06:04:05Z");

      const result = toDateRange(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual(startDate);
      expect(result[1]).toEqual(new Date("2023-01-02T04:04:05Z"));
      expect(result[2]).toEqual(new Date("2023-01-02T05:04:05Z"));
      expect(result[3]).toEqual(endDate);
    });

    it("should return all dates within the given range (1 day interval)", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-05T06:04:05Z");

      const result = toDateRange(startDate, endDate, { days: 1 });

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual(startDate);
      expect(result[1]).toEqual(new Date("2023-01-03T03:04:05Z"));
      expect(result[2]).toEqual(new Date("2023-01-04T03:04:05Z"));
      expect(result[3]).toEqual(new Date("2023-01-05T03:04:05Z"));
      expect(result[4]).toEqual(endDate);
    });

    it("should return start and end dates even when interval returns no other dates", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-02T03:05:06Z");

      const result = toDateRange(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(startDate);
      expect(result[1]).toEqual(endDate);
    });

    it("should return empty list when start date after end date", () => {
      const endDate = new Date("2023-01-02T03:04:05Z");
      const startDate = new Date("2023-01-02T06:04:05Z");

      const result = toDateRange(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(0);
    });
  });

  describe("toStartEndDatePairs", () => {
    it("should return all pairs of dates within the given range (1 hour interval)", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-02T06:04:05Z");

      const result = toStartEndDatePairs(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(3);
      expect(result[0].start).toEqual(startDate);
      expect(result[0].end).toEqual(new Date("2023-01-02T04:04:05Z"));
      expect(result[1].start).toEqual(new Date("2023-01-02T04:04:05.001Z"));
      expect(result[1].end).toEqual(new Date("2023-01-02T05:04:05Z"));
      expect(result[2].start).toEqual(new Date("2023-01-02T05:04:05.001Z"));
      expect(result[2].end).toEqual(endDate);
    });

    it("should return all pairs of dates within the given range (1 day interval)", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-05T06:04:05Z");

      const result = toStartEndDatePairs(startDate, endDate, { days: 1 });

      expect(result).toHaveLength(4);
      expect(result[0].start).toEqual(startDate);
      expect(result[0].end).toEqual(new Date("2023-01-03T03:04:05Z"));
      expect(result[1].start).toEqual(new Date("2023-01-03T03:04:05.001Z"));
      expect(result[1].end).toEqual(new Date("2023-01-04T03:04:05Z"));
      expect(result[2].start).toEqual(new Date("2023-01-04T03:04:05.001Z"));
      expect(result[2].end).toEqual(new Date("2023-01-05T03:04:05Z"));
      expect(result[3].start).toEqual(new Date("2023-01-05T03:04:05.001Z"));
      expect(result[3].end).toEqual(endDate);
    });

    it("should return start and end date pair even when interval returns no other dates", () => {
      const startDate = new Date("2023-01-02T03:04:05Z");
      const endDate = new Date("2023-01-02T03:05:06Z");

      const result = toStartEndDatePairs(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].start).toEqual(startDate);
      expect(result[0].end).toEqual(endDate);
    });

    it("should return empty list when start date after end date", () => {
      const endDate = new Date("2023-01-02T03:04:05Z");
      const startDate = new Date("2023-01-02T06:04:05Z");

      const result = toDateRange(startDate, endDate, { hours: 1 });

      expect(result).toHaveLength(0);
    });
  });

  describe("asUtcDateString", () => {
    const testCases = [
      { input: "2023-01-02T03:04:05Z", expected: "2023-01-02" },
      { input: "2023-01-02T03:04:05.123Z", expected: "2023-01-02" },
      { input: "2023-02-28T03:04:05.123Z", expected: "2023-02-28" },
      { input: "2023-02-28T03:04:05.123+06", expected: "2023-02-27" },
    ];
    testCases.forEach(({ input, expected }) => {
      it(`should return the date portion of the given date using UTC as the time zone: ${input}`, () => {
        const dateInput = toDate(input);
        const result = asUtcDateString(dateInput);

        expect(result).toEqual(expected);
      });
    });
  });
});
