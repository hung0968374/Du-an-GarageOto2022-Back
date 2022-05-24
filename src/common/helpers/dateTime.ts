import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import { TimeZone } from '../types/common';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

export const convertDateToTimeZoneUTC = (date: Date) => {
  return dayjs(date).tz('UTC').toDate();
};

export const convertDBDATEToTZDate = (
  date: Date | string,
  timezone: TimeZone
) => {
  const dbDate = dayjs(date).tz('UTC');
  const resultDate = dayjs(dbDate).tz(timezone);
  return resultDate;
};

export const compareDate1GreaterDate2 = (date1: Date, date2: Date) => {
  const date1JS = dayjs(date1);
  const date2JS = dayjs(date2);

  if (date1JS.diff(date2JS) > 0) {
    return true;
  }
  return false;
};
