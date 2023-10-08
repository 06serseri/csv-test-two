import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IncomeStatementDTO } from './incomeStatementDTO';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'csv-test-two';
  inputField: string = '';
  @ViewChild('filterName', { static: true }) filterName!: ElementRef;

  incomeStatementDTO: IncomeStatementDTO = {
    glCode: '',
    glName: '',
    periodToDateAmount: 0,
    periodToDatePercentage: 0,
    yearToDateAmount: 0,
    yearToDatePercentage: 0,
    adjustingJournalEntry: 0,
    roundedToZero: 0,
    oneDollarRounding: 0,
    finalAmount: 0,
  };
  val: number = 2;
  sumGlCodeList: string[] = [
    '490000',
    '499500',
    '669800',
    '669900',
    '799800',
    '799900',
    '869900',
    '919900',
    '970000',
    '979900',
    '999700',
  ];

  incomeStatementRowList: IncomeStatementDTO[] = [];

  public changeListener(event) {
    let csvFile = event.target.files[0];
    // console.log(file.name);
    // console.log(file.size);
    // console.log(file.type);
    let reader: FileReader = new FileReader();
    reader.readAsText(csvFile);
    reader.onload = (e) => {
      let csvData: string = reader.result as string;
      //console.log(csvData);
      //
      for (const csvDataRow of csvData.split(/[\r\n]+/)) {
        console.log(csvDataRow);
        console.log(csvDataRow.substring(0));

        this.incomeStatementDTO = {
          glCode: '',
          glName: '',
          periodToDateAmount: 0,
          periodToDatePercentage: 0,
          yearToDateAmount: 0,
          yearToDatePercentage: 0,
          adjustingJournalEntry: 0,
          roundedToZero: 0,
          oneDollarRounding: 0,
          finalAmount: 0,
        };

        if (csvDataRow.substring(0, 5) !== ',,,,,') {
          (this.incomeStatementDTO.glCode = csvDataRow.split(',')[0]),
            (this.incomeStatementDTO.glName = csvDataRow.split(',')[1]),
            (this.incomeStatementDTO.periodToDateAmount = parseFloat(
              csvDataRow.split(',')[2]
            )),
            (this.incomeStatementDTO.periodToDatePercentage =
              parseFloat(csvDataRow.split(',')[3]) / 100),
            (this.incomeStatementDTO.yearToDateAmount = parseFloat(
              csvDataRow.split(',')[4]
            )),
            (this.incomeStatementDTO.yearToDatePercentage =
              parseFloat(csvDataRow.split(',')[5]) / 100),
            (this.incomeStatementDTO.adjustingJournalEntry = 0), //INPUT FROM THE USER
            (this.incomeStatementDTO.roundedToZero =
              this.incomeStatementDTO.yearToDateAmount +
              this.incomeStatementDTO.adjustingJournalEntry), //ROUND THIS NUMBER TO ZERO DECIMALS
            (this.incomeStatementDTO.oneDollarRounding = 0), //INPUT FROM THE USER
            (this.incomeStatementDTO.finalAmount =
              this.incomeStatementDTO.roundedToZero +
              this.incomeStatementDTO.oneDollarRounding);
          //console.log(this.incomeStatementDTO);
          if (this.incomeStatementDTO.glCode != '') {
            this.incomeStatementRowList.push(this.incomeStatementDTO);
          }

          //console.log(this.incomeStatementRowList);
        } else {
          (this.incomeStatementDTO.glCode = ''),
            (this.incomeStatementDTO.glName = ''),
            (this.incomeStatementDTO.periodToDateAmount = 0),
            (this.incomeStatementDTO.periodToDatePercentage = 0),
            (this.incomeStatementDTO.yearToDateAmount = 0),
            (this.incomeStatementDTO.yearToDatePercentage = 0),
            (this.incomeStatementDTO.adjustingJournalEntry = 0),
            (this.incomeStatementDTO.roundedToZero = 0),
            (this.incomeStatementDTO.oneDollarRounding = 0),
            (this.incomeStatementDTO.finalAmount = 0);
        }
      }
    };
  }
  showJJT: boolean = false;

  doAdjustingJournalEntry(i: number) {
    this.incomeStatementRowList[i].roundedToZero =
      this.incomeStatementRowList[i].yearToDateAmount +
      this.incomeStatementRowList[i].adjustingJournalEntry;

    this.calculateFinalAmount(i);
    //CALCULATE SUBTOTALS AND GRAND TOTAL
    this.calculateTotalBusinessIncome();
    this.calculateTotalRevenue();
    this.calculateTotalRecoverableOperatingExpense();
    this.calculateTotalRecoverableExpense();
    this.calculateTotalOperatingExpenses();
    this.calculateNetOperatingIncome();
    this.calculateTotalGeneralAndAdministrative();
    this.calculateTotalAmortization();
    this.calculateTotalBusinessExpense();
    this.calculateNetIncomeBeforeFairValueAdjustments();
    this.calculateNetEarningsOrLossForPeriod();
  }

  calculateFinalAmount(i: number) {
    this.incomeStatementRowList[i].finalAmount =
      this.incomeStatementRowList[i].roundedToZero +
      this.incomeStatementRowList[i].oneDollarRounding;
  }

  calculateTotalBusinessIncome() {
    let totalBusinessIncomeIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '490000'
    );

    this.incomeStatementRowList[totalBusinessIncomeIndex].roundedToZero =
      this.incomeStatementRowList[totalBusinessIncomeIndex - 1].roundedToZero;
    this.incomeStatementRowList[totalBusinessIncomeIndex].finalAmount =
      this.incomeStatementRowList[totalBusinessIncomeIndex - 1].finalAmount;
  }

  calculateTotalRevenue() {
    // CALCULATE TOTAL BUSINESS INCOME
    let totalRevenue = this.incomeStatementRowList.find(
      (i) => i.glCode === '499500'
    );
    let totalRevenueIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '499500'
    );
    this.incomeStatementRowList[totalRevenueIndex].roundedToZero =
      this.incomeStatementRowList[totalRevenueIndex - 1].roundedToZero;
    this.incomeStatementRowList[totalRevenueIndex].finalAmount =
      this.incomeStatementRowList[totalRevenueIndex - 1].finalAmount;
  }

  calculateTotalRecoverableOperatingExpense() {
    let totalRecoverableOperatingExpense = this.incomeStatementRowList.find(
      (i) => i.glCode === '669800'
    );
    let totalRecoverableOperatingExpenseIndex =
      this.incomeStatementRowList.findIndex((i) => i.glCode === '669800');
    this.incomeStatementRowList[
      totalRecoverableOperatingExpenseIndex
    ].roundedToZero =
      this.incomeStatementRowList[
        totalRecoverableOperatingExpenseIndex - 1
      ].roundedToZero;
    this.incomeStatementRowList[
      totalRecoverableOperatingExpenseIndex
    ].finalAmount =
      this.incomeStatementRowList[
        totalRecoverableOperatingExpenseIndex - 1
      ].finalAmount;
  }

  calculateTotalRecoverableExpense() {
    let totalRecoverableExpense = this.incomeStatementRowList.find(
      (i) => i.glCode === '669900'
    );
    let totalRecoverableExpenseIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '669900'
    );
    this.incomeStatementRowList[totalRecoverableExpenseIndex].roundedToZero =
      this.incomeStatementRowList[
        totalRecoverableExpenseIndex - 1
      ].roundedToZero;
    this.incomeStatementRowList[totalRecoverableExpenseIndex].finalAmount =
      this.incomeStatementRowList[totalRecoverableExpenseIndex - 1].finalAmount;
  }

  calculateTotalOperatingExpenses() {
    let totalOperatingExpenses = this.incomeStatementRowList.find(
      (i) => i.glCode === '799800'
    );
    let totalOperatingExpensesIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '799800'
    );
    this.incomeStatementRowList[totalOperatingExpensesIndex].roundedToZero =
      this.incomeStatementRowList[
        totalOperatingExpensesIndex - 1
      ].roundedToZero;
    this.incomeStatementRowList[totalOperatingExpensesIndex].finalAmount =
      this.incomeStatementRowList[totalOperatingExpensesIndex - 1].finalAmount;
  }

  calculateNetOperatingIncome() {
    let NetOperatingIncome = this.incomeStatementRowList.find(
      (i) => i.glCode === '799900'
    );
    let NetOperatingIncomeIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '799900'
    );

    this.incomeStatementRowList[NetOperatingIncomeIndex].roundedToZero =
      this.incomeStatementRowList[NetOperatingIncomeIndex - 5].roundedToZero -
      this.incomeStatementRowList[NetOperatingIncomeIndex - 1].roundedToZero;

    this.incomeStatementRowList[NetOperatingIncomeIndex].finalAmount =
      this.incomeStatementRowList[NetOperatingIncomeIndex - 5].finalAmount -
      this.incomeStatementRowList[NetOperatingIncomeIndex - 1].finalAmount;
  }

  calculateTotalGeneralAndAdministrative() {
    let totalGeneralAndAdministrative = this.incomeStatementRowList.find(
      (i) => i.glCode === '869900'
    );
    let totalGeneralAndAdministrativeIndex =
      this.incomeStatementRowList.findIndex((i) => i.glCode === '869900');
    this.incomeStatementRowList[
      totalGeneralAndAdministrativeIndex
    ].roundedToZero =
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 1]
        .roundedToZero +
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 2]
        .roundedToZero +
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 3]
        .roundedToZero;

    this.incomeStatementRowList[
      totalGeneralAndAdministrativeIndex
    ].finalAmount =
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 1]
        .finalAmount +
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 2]
        .finalAmount +
      this.incomeStatementRowList[totalGeneralAndAdministrativeIndex - 3]
        .finalAmount;
  }

  calculateTotalAmortization() {
    // CALCULATE TOTAL BUSINESS INCOME
    let totalAmortization = this.incomeStatementRowList.find(
      (i) => i.glCode === '919900'
    );
    let totalAmortizationIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '919900'
    );
    this.incomeStatementRowList[totalAmortizationIndex].roundedToZero =
      this.incomeStatementRowList[totalAmortizationIndex - 1].roundedToZero;
    this.incomeStatementRowList[totalAmortizationIndex].finalAmount =
      this.incomeStatementRowList[totalAmortizationIndex - 1].finalAmount;
  }

  calculateTotalBusinessExpense() {
    let totalBusinessExpenseIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '970000'
    );
    this.incomeStatementRowList[totalBusinessExpenseIndex].roundedToZero =
      this.incomeStatementRowList[totalBusinessExpenseIndex - 1].roundedToZero +
      this.incomeStatementRowList[totalBusinessExpenseIndex - 3].roundedToZero;

    this.incomeStatementRowList[totalBusinessExpenseIndex].finalAmount =
      this.incomeStatementRowList[totalBusinessExpenseIndex - 1].finalAmount +
      this.incomeStatementRowList[totalBusinessExpenseIndex - 3].finalAmount;
  }

  calculateNetIncomeBeforeFairValueAdjustments() {
    let NetIncomeBeforeFairValueAdjustmentsIndex =
      this.incomeStatementRowList.findIndex((i) => i.glCode === '979900');
    this.incomeStatementRowList[
      NetIncomeBeforeFairValueAdjustmentsIndex
    ].roundedToZero =
      this.incomeStatementRowList[NetIncomeBeforeFairValueAdjustmentsIndex - 8]
        .roundedToZero -
      this.incomeStatementRowList[NetIncomeBeforeFairValueAdjustmentsIndex - 1]
        .roundedToZero;

    this.incomeStatementRowList[
      NetIncomeBeforeFairValueAdjustmentsIndex
    ].finalAmount =
      this.incomeStatementRowList[NetIncomeBeforeFairValueAdjustmentsIndex - 8]
        .finalAmount -
      this.incomeStatementRowList[NetIncomeBeforeFairValueAdjustmentsIndex - 1]
        .finalAmount;
  }

  calculateNetEarningsOrLossForPeriod() {
    let NetEarningsOrLossForPeriodIndex = this.incomeStatementRowList.findIndex(
      (i) => i.glCode === '999700'
    );
    this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex].roundedToZero =
      this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex - 2]
        .roundedToZero -
      this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex - 1]
        .roundedToZero;

    this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex].finalAmount =
      this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex - 2]
        .finalAmount -
      this.incomeStatementRowList[NetEarningsOrLossForPeriodIndex - 1]
        .finalAmount;
  }

  submit() {
    this.showJJT = true;

    setTimeout(() => {
      let mywindow = window.open(
        '',
        'PRINT',
        'height=800,width=1200,top=100,left=150'
      );
      let title = 'Super Tuna Report';
      mywindow.document.write(`<html><head><title>${title}</title>`);
      mywindow.document.write('</head><body>');
      mywindow.document.write(document.getElementById('printMeOut').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close();
      mywindow.focus();

      mywindow.print();
      mywindow.close();
    }, 200);
    console.log(
      this.incomeStatementRowList[this.incomeStatementRowList.length - 1]
    );
    // console.log(
    //   'INCOME STATEMENT ROW LIST IS: ' +
    //     JSON.stringify(this.incomeStatementRowList)
    // );
  }

  resetIncomeStatementRowList() {
    this.incomeStatementRowList = [];
    this.filterName.nativeElement.value = '';
  }
}
