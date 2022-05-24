import { RecurrenceRule } from 'node-schedule';

const rule1Second = new RecurrenceRule();
rule1Second.second = 1;

const rule2Hours = new RecurrenceRule();
rule2Hours.hour = 2;

const rule6Months = new RecurrenceRule();
rule6Months.month = 6;

const rule5Months = new RecurrenceRule();
rule5Months.month = 5;

export default {
  rule1Second,
  rule2Hours,
  rule6Months,
  rule5Months,
};
