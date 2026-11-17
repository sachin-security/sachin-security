import type { ComputeResult, SalaryComponent } from "./payroll";

export function payrollMonthDays(month: string): number {
  if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(month)) return 0;
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
}

// Paushak–Halol October 2026 wage sheet, Sheet3 rows 20–23.
const rates: Record<string, {monthly: number; basic: number; hra: number; allowance: number}> = {
  "SR S/S": { monthly: 24553, basic: 13897, hra: 2941, allowance: 7715 },
  "S/S": { monthly: 22875, basic: 13897, hra: 2941, allowance: 6037 },
  "L/G": { monthly: 16217, basic: 13351, hra: 0, allowance: 2866 },
  "S/G": { monthly: 20630, basic: 13351, hra: 500, allowance: 6779 },
};

export function isPaushakPayroll(location: unknown, month: string) {
  const site = String(location ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return site === "paushak halol" && payrollMonthDays(month) > 0 && month >= "2026-10";
}

const fields = [
  ["rate", "Monthly rate", "info"], ["calendarDays", "Calendar days", "info"],
  ["ratePerDay", "Monthly rate / calendar days", "info"], ["duty", "Regular duty", "info"],
  ["extraDuty", "Extra duty", "info"], ["holidayDuty", "Public holiday duty", "info"],
  ["basic", "Basic wages", "earning"], ["hra", "HRA", "earning"],
  ["wageAllowance", "Wage allowance", "earning"], ["extraWages", "Extra wages", "earning"],
  ["grossPay", "Regular and extra-duty gross", "total"],
  ["bonus", "Bonus", "earning"], ["leavePay", "Leave pay", "earning"],
  ["holidayWages", "Public holiday wages", "earning"], ["pf", "PF", "deduction"],
  ["esic", "ESIC", "deduction"], ["ptax", "Professional tax", "deduction"],
  ["lwf", "Labour welfare fund", "deduction"], ["lunch", "Lunch", "deduction"],
  ["advance", "Advance", "deduction"], ["uniform", "Uniform", "deduction"],
  ["roomRent", "Room", "deduction"], ["canteen", "Canteen / vehicle", "deduction"],
  ["sheetDeductions", "Wage sheet deductions before recovery", "total"],
  ["recovery", "Recovery", "deduction"], ["rounding", "Wage rounding adjustment", "info"],
  ["totalDeduction", "Deductions including recovery", "total"], ["netPay", "Net pay", "total"],
] as const;

export const paushakInputKeys = [
  "duty", "extraDuty", "holidayDuty", "lwf", "lunch", "advance", "uniform", "roomRent", "canteen", "recovery",
] as const;
export const paushakComponents: SalaryComponent[] = fields.map(([key, label, category]) => ({
  key, label, category, calc: "fixed",
}));

const currency = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;
const roundRupee = (amount: number) => Math.sign(amount) * Math.round(Math.abs(amount));

export function calculatePaushakPayroll(
  designation: unknown, month: string, recordedDuty: number, inputs: Record<string, number> = {},
): ComputeResult {
  const calendarDays = payrollMonthDays(month);
  const rateKey = String(designation ?? "").trim().toUpperCase().replace(/\s+/g, " ");
  const rate = Object.hasOwn(rates, rateKey) ? rates[rateKey] : undefined;
  if (!rate) throw new Error("Select a Paushak wage-sheet designation (SR S/S, S/S, L/G or S/G).");
  if (!calendarDays) throw new Error("Select a valid payroll month.");

  const duty = inputs.duty ?? recordedDuty;
  const extraDuty = inputs.extraDuty ?? 0;
  const holidayDuty = inputs.holidayDuty ?? 0;
  if ([duty, extraDuty, holidayDuty].some(days => !Number.isFinite(days) || days < 0 || days > calendarDays)) {
    throw new Error(`Duty inputs must be between 0 and ${calendarDays} days for ${month}.`);
  }
  const values: Record<string, number> = { rate: rate.monthly, calendarDays, ratePerDay: rate.monthly / calendarDays, duty, extraDuty, holidayDuty };
  for (const key of paushakInputKeys.slice(3)) {
    const amount = inputs[key] ?? 0;
    if (!Number.isFinite(amount) || amount < 0) throw new Error("Enter valid nonnegative deductions.");
    values[key] = amount;
  }

  values.basic = rate.basic * duty / calendarDays;
  values.hra = rate.hra * duty / calendarDays;
  values.wageAllowance = rate.allowance * duty / calendarDays;
  values.extraWages = rate.monthly * extraDuty / calendarDays;
  values.grossPay = values.basic + values.hra + values.wageAllowance + values.extraWages;
  values.bonus = values.basic * 0.0833;
  values.leavePay = values.basic * 0.05;
  values.holidayWages = rate.monthly * holidayDuty / 26;
  values.pf = values.basic * 0.12;
  values.esic = Math.ceil(values.grossPay * 0.0075);
  values.ptax = values.grossPay >= 12000 ? 200 : 0;
  values.sheetDeductions = values.pf + values.esic + values.ptax
    + values.lwf + values.lunch + values.advance + values.uniform + values.roomRent + values.canteen;
  values.totalDeduction = values.sheetDeductions + values.recovery;
  const beforeAdditions = values.grossPay - values.totalDeduction;
  const rounded = roundRupee(beforeAdditions);
  values.rounding = rounded - beforeAdditions;
  values.netPay = rounded + values.bonus + values.leavePay + values.holidayWages;
  return {
    values: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, currency(value)])),
    grossPay: currency(values.grossPay),
    totalDeduction: currency(values.totalDeduction),
    netPay: currency(values.netPay),
  };
}
