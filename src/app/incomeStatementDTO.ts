export interface IncomeStatementDTO {
  glCode: string;
  glName: string;
  periodToDateAmount: number;
  periodToDatePercentage: number;
  yearToDateAmount: number;
  yearToDatePercentage: number;
  adjustingJournalEntry: number;
  roundedToZero: number;
  oneDollarRounding: number;
  finalAmount: number;
}
