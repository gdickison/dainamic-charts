function getAverage(array){
  return (array.reduce((a, b) => Number(a) + Number(b)) / array.length).toFixed(2)
}

function getPercentage(part, whole){
  return ((Number(part) / Number(whole)) * 100).toFixed(2)
}

const getDateLabelsForChart = (start, end) => {
  let start_date = new Date(start)
  let end_date = new Date(end)
  const generatedLabels = []
  while(end_date >= start_date){
    generatedLabels.push(start_date.toLocaleString('default', { month: 'long' , year: 'numeric'}))
    start_date.setMonth(start_date.getMonth() + 1);
  }
  return generatedLabels
}

function groupDataByRegion(list, key){
  return list.reduce(function(rv, x){
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

function getLinearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  } 

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

function getQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3 + 1);
}

function split(str, index) {
  const result = [str.slice(0, index), str.slice(index)];

  return result;
}

const chartFadedColors = [
  "rgba(255, 0, 0, 0.3)",
  "rgba(0, 83, 255, 0.3)",
  "rgba(0, 180, 0, 0.3)",
  "rgba(255, 225, 0, 0.3)",
  "rgba(255, 130, 0, 0.3)",
  "rgba(51, 177, 255, 0.3)",
  "rgba(56, 245, 39, 0.3)",
  "rgba(245, 172, 39, 0.3)"
]

const chartSolidColors = [
  "rgba(255, 0, 0, 0.7)",
  "rgba(0, 83, 255, 0.7)",
  "rgba(0, 180, 0, 0.7)",
  "rgba(255, 225, 0, 0.7)",
  "rgba(255, 130, 0, 0.7)",
  "rgba(51, 177, 255, 0.7)",
  "rgba(56, 245, 39, 0.7)",
  "rgba(245, 172, 39, 0.7)"
]

const cexFadedColors = [
  'rgb(31,120,180, 0.5)',
  'rgb(51,160,44, 0.5)',
  'rgb(227,26,28, 0.5)',
  'rgb(253,191,111, 0.5)',
  'rgb(106,61,154, 0.5)',
  'rgb(255,127,0, 0.5)',
  'rgb(255,255,100, 0.5)',
  'rgb(177,89,40, 0.5)'
]

const cexSolidColors = [
  'rgb(31,120,180, 0.9)',
  'rgb(51,160,44, 0.9)',
  'rgb(227,26,28, 0.9)',
  'rgb(253,191,111, 0.9)',
  'rgb(106,61,154, 0.9)',
  'rgb(255,127,0, 0.9)',
  'rgb(255,255,100, 0.9)',
  'rgb(177,89,40, 0.9)'
]

const pointStyles = [
  'circle',
  'rect',
  'triangle',
  'rectRot'
]

const regressionLineColor = '#94A3B8'

const rconOptionsList = [
  {
    value: "RCON1288",
    label:	"RCON1288 - LOANS TO DEPOSITORY INSTITUTIONS"
  },
  {
    value: "RCON1420",
    label:	"RCON1420 - REAL ESTATE LOANS SECURED BY FARMLAND"
  },
  {
    value: "RCON1460",
    label:	"RCON1460 - REAL ESTATE LOANS SECURED BY MULTI-FAMILY (5 OR MORE) RESIDENTIAL PROPERTIES"
  },
  {
    value: "RCON1545",
    label:	"RCON1545 - LOANS FOR PURCHASING OR CARRYING SECURITIES"
  },
  {
    value: "RCON1590",
    label:	"RCON1590 - LOANS TO FINANCE AGRICULTURAL PRODUCTION AND OTHER LOANS TO FARMERS"
  },
  {
    value: "RCON1763",
    label:	"RCON1763 - COMMERCIAL AND INDUSTRIAL LOANS TO U.S. ADDRESSEES"
  },
  {
    value: "RCON1764",
    label:	"RCON1764 - COMMERCIAL AND INDUSTRIAL LOANS TO NON-U.S. ADDRESSEES"
  },
  {
    value: "RCON1766",
    label:	"RCON1766 - COMMERCIAL AND INDUSTRIAL LOANS"
  },
  {
    value: "RCON1797",
    label:	"RCON1797 - REVOLVING, OPEN-END LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES AND EXTENDED UNDER LINES OF CREDIT"
  },
  {
    value: "RCON2081",
    label:	"RCON2081 - LOANS TO FOREIGN GOVERNMENTS AND OFFICIAL INSTITUTIONS"
  },
  {
    value: "RCON2107",
    label:	"RCON2107 - OBLIGATIONS (OTHER THAN SECURITIES AND LEASES) OF STATES AND POLITICAL SUBDIVISIONS IN THE U.S."
  },
  {
    value: "RCON2122",
    label:	"RCON2122 - TOTAL LOANS AND LEASES, NET OF UNEARNED INCOME"
  },
  {
    value: "RCON2123",
    label:	"RCON2123 - UNEARNED INCOME ON LOANS"
  },
  {
    value: "RCON2165",
    label:	"RCON2165 - LEASE FINANCING RECEIVABLES (NET OF UNEARNED INCOME)"
  },
  {
    value: "RCON2746",
    label:	"RCON2746 - LOANS TO FINANCE COMMERCIAL REAL ESTATE, CONSTRUCTION, AND LAND DEVELOPMENT ACTIVITIES INCLUDED IN ITEMS 1766, 1563 FOR (FR Y-9C), IN ITEMS 1766, 1563 FOR (FFIEC 031), IN ITEMS 1766, 1564 FOR (FFIEC 032 AND 033), AND IN ITEMS 1766, 2080 FOR (FFIEC 034)"
  },
  {
    value: "RCON5367",
    label:	"RCON5367 - ALL OTHER LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES: SECURED BY FIRST LIENS"
  },
  {
    value: "RCON5368",
    label:	"RCON5368 - ALL OTHER LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES: SECURED BY JUNIOR LIENS"
  },
  {
    value: "RCON5370",
    label:	"RCON5370 - ADJUSTABLE RATE CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONA247",
    label:	"RCONA247 - FIXED RATE AND FLOATING RATE LOANS AND LEASES WITH A REMAINING MATURITY OF ONE YEAR OR LESS"
  },
  {
    value: "RCONA564",
    label:	"RCONA564 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF THREE MONTHS OR LESS"
  },
  {
    value: "RCONA565",
    label:	"RCONA565 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER THREE MONTHS THROUGH 12 MONTHS"
  },
  {
    value: "RCONA566",
    label:	"RCONA566 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER ONE YEAR THROUGH THREE YEARS"
  },
  {
    value: "RCONA567",
    label:	"RCONA567 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER THREE YEARS THROUGH FIVE YEARS"
  },
  {
    value: "RCONA568",
    label:	"RCONA568 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER FIVE YEARS THROUGH 15 YEARS"
  },
  {
    value: "RCONA569",
    label:	"RCONA569 - CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER 15 YEARS"
  },
  {
    value: "RCONA570",
    label:	"RCONA570 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF THREE MONTHS OR LESS"
  },
  {
    value: "RCONA571",
    label:	"RCONA571 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER THREE MONTHS THROUGH 12 MONTHS"
  },
  {
    value: "RCONA572",
    label:	"RCONA572 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER ONE YEAR THROUGH THREE YEARS"
  },
  {
    value: "RCONA573",
    label:	"RCONA573 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER THREE YEARS THROUGH FIVE YEARS"
  },
  {
    value: "RCONA574",
    label:	"RCONA574 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER FIVE YEARS THROUGH 15 YEARS"
  },
  {
    value: "RCONA575",
    label:	"RCONA575 - ALL LOANS AND LEASES OTHER THAN CLOSED-END LOANS SECURED BY FIRST LIENS ON 1-4 FAMILY RESIDENTIAL PROPERTIES (IN DOMESTIC OFFICES) WITH A REMAINING MATURITY OR REPRICING FREQUENCY OF OVER 15 YEARS"
  },
  {
    value: "RCONB531",
    label:	"RCONB531 - LOANS TO DEPOSITORY INSTITUTIONS AND ACCEPTANCES OF OTHER BANKS: TO COMMERCIAL BANKS IN THE U.S."
  },
  {
    value: "RCONB534",
    label:	"RCONB534 - LOANS TO OTHER DEPOSITORY INSTITUTIONS IN THE U.S."
  },
  {
    value: "RCONB535",
    label:	"RCONB535 - LOANS TO BANKS IN FOREIGN COUNTRIES"
  },
  {
    value: "RCONB538",
    label:	"RCONB538 - LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES (I.E., CONSUMER LOANS)(INCLUDES PURCHASED PAPER): CREDIT CARDS"
  },
  {
    value: "RCONB539",
    label:	"RCONB539 - LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES (I.E., CONSUMER LOANS)(INCLUDES PURCHASED PAPER): OTHER REVOLVING CREDIT PLANS"
  },
  {
    value: "RCONB837",
    label:	"RCONB837 - LOANS SECURED BY REAL ESTATE TO NON-U.S. ADDRESSEES (DOMICILE)"
  },
  {
    value: "RCONC391",
    label:	"RCONC391 - OUTSTANDING CREDIT CARD FEES & FINANCE CHARGES"
  },
  {
    value: "RCONC779",
    label:	"RCONC779 - PURCHASED IMPAIRED LOANS HELD FOR INVESTMENT ACCOUNTED FOR IN ACCORDANCE WITH AICPA STATEMENT OF POSITION 03-3 (EXCLUDE LOANS HELD FOR SALE): OUTSTANDING BALANCE"
  },
  {
    value: "RCONC780",
    label:	"RCONC780 - PURCHASED IMPAIRED LOANS HELD FOR INVESTMENT ACCOUNTED FOR IN ACCORDANCE WITH AICPA STATEMENT OF POSITION 03-3 (EXCLUDE LOANS HELD FOR SALE): CARRYING AMOUNT INCLUDED IN SCHEDULE RC-C, PART I, ITEMS 1 THRU 9"
  },
  {
    value: "RCONF158",
    label:	"RCONF158 - LOANS SECURED BY 1-4 FAMILY RESIDENTIAL CONSTRUCTION"
  },
  {
    value: "RCONF159",
    label:	"RCONF159 - LOANS SECURED BY OTHER CONSTRUCTION LOANS AND ALL LAND DEVELOPMENT AND OTHER LAND LOANS"
  },
  {
    value: "RCONF160",
    label:	"RCONF160 - LOANS SECURED BY OWNER OCCUPIED NONFARM NONRESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONF161",
    label:	"RCONF161 - LOANS SECURED BY OTHER NONFARM NONRESIDENTIAL PROPERTIES."
  },
  {
    value: "RCONF162",
    label:	"RCONF162 - LEASES TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES (I.E. CONSUMER LEASES)"
  },
  {
    value: "RCONF163",
    label:	"RCONF163 - ALL OTHER LEASE FINANCING RECEIVABLES"
  },
  {
    value: "RCONF230",
    label:	"RCONF230 - TOTAL CARRYING AMOUNT OF CLOSED-END LOANS WITH NEGATIVE AMORTIZATION FEATURES SECURE BY 1-4 FAMILY RESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONF231",
    label:	"RCONF231 - TOTAL MAXIMUM REMAINING AMOUNT OF NEGATIVE AMORTIZATION CONTRACTUALLY PERMITTED ON CLOSED-END LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES."
  },
  {
    value: "RCONF232",
    label:	"RCONF232 - TOTAL AMOUNT OF NEGATIVE AMORTIZATION ON CLOSED-END LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES INCLUDED IN THE CARRYING AMOUNT REPORTED IN MEMORANDUM ITEM 8.A ABOVE"
  },
  {
    value: "RCONF576",
    label:	"RCONF576 - LOANS AND LEASES RESTRUCTURED AND IN COMPLIANCE WITH MODIFIED TERMS: LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES IN DOMESTIC OFFICES"
  },
  {
    value: "RCONF577",
    label:	"RCONF577 - LOANS SECURED BY 1-4 FAMILY RESIDENTIAL PROPERTIES IN DOMESTIC OFFICES IN PROCESS OF FORECLOSURE (INCLUDED IN RC-C, PART I, ITEMS 1.C.(1), 1.C.(2)(A), AND 1.C.(2)(B)"
  },
  {
    value: "RCONG091",
    label:	"RCONG091 - FAIR VALUE AT ACQUISITION DATE OF ACQUIRED LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS SECURED BY REAL ESTATE"
  },
  {
    value: "RCONG092",
    label:	"RCONG092 - GROSS CONTRACTUAL AMOUNTS RECEIVABLE AT ACQUISITION DATE OF LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS SECURED BY REAL ESTATE"
  },
  {
    value: "RCONG093",
    label:	"RCONG093 - BEST ESTIMATE AT ACQUISITION DATE OF CONTRACTUAL CASH FLOWS NOT EXPECTED TO BE COLLECTED FOR LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS SECURED BY REAL ESTATE"
  },
  {
    value: "RCONG094",
    label:	"RCONG094 - FAIR VALUE AT ACQUISITION DATE OF ACQUIRED LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: COMMERCIAL AND INDUSTRIAL LOANS"
  },
  {
    value: "RCONG095",
    label:	"RCONG095 - GROSS CONTRACTUAL AMOUNTS RECEIVABLE AT ACQUISITION DATE OF LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: COMMERCIAL AND INDUSTRIAL LOANS"
  },
  {
    value: "RCONG096",
    label:	"RCONG096 - BEST ESTIMATE AT ACQUISITION DATE OF CONTRACTUAL CASH FLOWS NOT EXPECTED TO BE COLLECTED FOR LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: COMMERCIAL AND INDUSTRIAL LOANS"
  },
  {
    value: "RCONG097",
    label:	"RCONG097 - FAIR VALUE AT ACQUISITION DATE OF ACQUIRED LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY AND OTHER PERSONAL EXPENDITURES"
  },
  {
    value: "RCONG098",
    label:	"RCONG098 - GROSS CONTRACTUAL AMOUNTS RECEIVABLE AT ACQUISITION DATE OF LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS TO INDIVIDUAL FOR HOUSEHOLD FAMILY AND OTHER PERSONAL EXPENDITURES"
  },
  {
    value: "RCONG099",
    label:	"RCONG099 - BEST ESTIMATE AT ACQUISITION DATE OF CONTRACTUAL CASH FLOWS NOT EXPECTED TO BE COLLECTED FOR LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES"
  },
  {
    value: "RCONG100",
    label:	"RCONG100 - FAIR VALUE AT ACQUISITION DATE OF ACQUIRED LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: ALL OTHER LOANS AND ALL LEASES"
  },
  {
    value: "RCONG101",
    label:	"RCONG101 - GROSS CONTRACTUAL AMOUNTS RECEIVABLE AT ACQUISITION DATE OF LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: ALL OTHER LOANS AND ALL LEASES"
  },
  {
    value: "RCONG102",
    label:	"RCONG102 - BEST ESTIMATE AT ACQUISITION DATE OF CONTRACTUAL CASH FLOWS NOT EXPECTED TO BE COLLECTED FOR LOANS AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR: ALL OTHER LOANS AND ALL LEASES"
  },
  {
    value: "RCONG376",
    label:	"RCONG376 - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS IN DOMESTIC OFFICES WITH INTEREST RESERVES: AMOUNT OF LOANS THAT PROVIDE FOR THE USE OF INTEREST RESERVES (INCLUDED IN SCHEDULED RC-C, PART I, ITEM 1.A., COLUMN B)"
  },
  {
    value: "RCONG378",
    label:	"RCONG378 - PLEDGED LOANS AND LEASES"
  },
  {
    value: "RCONGW45",
    label:	"RCONGW45 - LOANS (NOT SUBJECT TO THE REQUIREMENTS OF FASB ASC 310-30 (FORMER AICPA STATEMENT OF POSITION 03-3)) AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR, FAIR VALUE OF ACQUIRED LOANS AND LEASES AT ACQUISITION DATE"
  },
  {
    value: "RCONGW46",
    label:	"RCONGW46 - LOANS (NOT SUBJECT TO THE REQUIREMENTS OF FASB ASC 310-30 (FORMER AICPA STATEMENT OF POSITION 03-3)) AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR, GROSS CONTRACTUAL AMOUNTS RECEIVABLE AT ACQUISITION DATE"
  },
  {
    value: "RCONGW47",
    label:	"RCONGW47 - LOANS (NOT SUBJECT TO THE REQUIREMENTS OF FASB ASC 310-30 (FORMER AICPA STATEMENT OF POSITION 03-3)) AND LEASES HELD FOR INVESTMENT THAT WERE ACQUIRED IN BUSINESS COMBINATIONS WITH ACQUISITION DATES IN THE CURRENT CALENDAR YEAR, BEST ESTIMATE AT ACQUISITION DATE OF CONTRACTUAL CASH FLOWS NOT EXPECTED TO BE COLLECTED"
  },
  {
    value: "RCONHK25",
    label:	"RCONHK25 - TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONJ451",
    label:	"RCONJ451 - ALL OTHER LOANS (EXCLUDE CONSUMER LOANS)"
  },
  {
    value: "RCONJ454",
    label:	"RCONJ454 - LOANS TO NONDEPOSITORY FINANCIAL INSTITUTIONS"
  },
  {
    value: "RCONJ464",
    label:	"RCONJ464 - OTHER LOANS"
  },
  {
    value: "RCONJ466",
    label:	"RCONJ466 - REVERSE MORTGAGES OUTSTANDING THAT ARE HELD FOR INVESTMENT (INCLUDED IN SCHEDULE RC-C, ITEM 1.C, ABOVE): HOME EQUITY CONVERSION MORTGAGE (HECM) REVERSE MORTGAGES"
  },
  {
    value: "RCONJ467",
    label:	"RCONJ467 - REVERSE MORTGAGES OUTSTANDING THAT ARE HELD FOR INVESTMENT (INCLUDED IN SCHEDULE RC-C, ITEM 1.C, ABOVE): PROPRIETARY REVERSE MORTGAGES"
  },
  {
    value: "RCONJ468",
    label:	"RCONJ468 - REVERSE MORTGAGES: ESTIMATED NUMBER OF REVERSE MORTGAGES FOR WHICH FEE-PAID REFERRALS WERE RECEIVED DURING THE YEAR:HOME EQUITY CONVERSION MORTGAGE (HECM) REVERSE MORTGAGES"
  },
  {
    value: "RCONJ469",
    label:	"RCONJ469 - REVERSE MORTGAGES: ESTIMATED NUMBER OF REVERSE MORTGAGES FOR WHICH FEE-PAID REFERRALS WERE RECEIVED DURING THE YEAR:PROPRIETARY REVERSE MORTGAGES"
  },
  {
    value: "RCONJ470",
    label:	"RCONJ470 - REVERSE MORTGAGES: PRINCIPAL AMOUNT OF REVERSE MORTGAGE ORIGINATIONS THAT HAVE BEEN SOLD DURING THE YEAR:HOME EQUITY CONVERSION MORTGAGE (HECM) REVERSE MORTGAGES"
  },
  {
    value: "RCONJ471",
    label:	"RCONJ471 - REVERSE MORTGAGES: PRINCIPAL AMOUNT OF REVERSE MORTGAGE ORIGINATIONS THAT HAVE BEEN SOLD DURING THE YEAR:PROPRIETARY REVERSE MORTGAGES"
  },
  {
    value: "RCONK098",
    label:	"RCONK098 - LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES: CREDIT CARDS THAT EXCEED 10 PERCENT OF TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONK137",
    label:	"RCONK137 - AUTOMOBILE LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES (I.E., CONSUMER LOANS)(INCLUDES PURCHASED PAPER)"
  },
  {
    value: "RCONK158",
    label:	"RCONK158 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS: 1 - 4 FAMILY RESIDENTIAL CONSTRUCTION LOANS"
  },
  {
    value: "RCONK159",
    label:	"RCONK159 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS: OTHER CONSTRUCTION LOANS AND ALL LAND DEVELOPMENT AND OTHER LAND LOANS"
  },
  {
    value: "RCONK160",
    label:	"RCONK160 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS: SECURED BY MULTIFAMILY (5 OR MORE) NONRESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONK161",
    label:	"RCONK161 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS: SECURED BY NONFARM NONRESIDENTIAL PROPERTIES: LOANS SECURED BY OWNER-OCCUPIED NONFARM NONRESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONK162",
    label:	"RCONK162 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - CONSTRUCTION, LAND DEVELOPMENT, AND OTHER LAND LOANS: SECURED BY NONFARM NONRESIDENTIAL PROPERTIES: LOANS SECURED BY OTHER NONFARM NONRESIDENTIAL PROPERTIES"
  },
  {
    value: "RCONK163",
    label:	"RCONK163 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - COMMERCIAL AND INDUSTRIAL LOANS: TO U.S. ADDRESSEES (DOMICILE)"
  },
  {
    value: "RCONK164",
    label:	"RCONK164 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - COMMERCIAL AND INDUSTRIAL LOANS: TO NON-U.S. ADDRESSEES (DOMICILE)"
  },
  {
    value: "RCONK165",
    label:	"RCONK165 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - ALL OTHER LOANS"
  },
  {
    value: "RCONK166",
    label:	"RCONK166 - ITEMIZE LOANS SECURED BY FARMLAND THAT EXCEED 10 PERCENT OF TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONK168",
    label:	"RCONK168 - ITEMIZE LOANS LOANS TO FINANCE AGRICULTURAL PRODUCTION AND OTHER LOANS TO FARMERS THAT EXCEED 10 PERCENT OF TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONK203",
    label:	"RCONK203 - LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES: AUTOMOBILE LOANS THAT EXCEED 10 PERCENT OF TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONK204",
    label:	"RCONK204 - LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES: OTHER CONSUMER LOANS THAT EXCEED 10 PERCENT OF TOTAL LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS THAT ARE IN COMPLIANCE WITH THEIR MODIFIED TERMS"
  },
  {
    value: "RCONK207",
    label:	"RCONK207 - OTHER CONSUMER LOANS TO INDIVIDUALS FOR HOUSEHOLD, FAMILY, AND OTHER PERSONAL EXPENDITURES (INCLUDES SINGLE PAYMENT, INSTALLMENT, AND ALL STUDENT LOANS)"
  },
  {
    value: "RCONK256",
    label:	"RCONK256 - LOANS RESTRUCTURED IN TROUBLED DEBT RESTRUCTURINGS - COMMERCIAL AND INDUSTRIAL LOANS"
  },
  {
    value: "RCONLE75",
    label:	"RCONLE75 - Revolving, open-end lines of credit secured by 1-4 family residential properties that have converted to non-revolving closed-end status that are included in item 1.c(1) above"
  },
  {
    value: "RCONLG24",
    label:	"RCONLG24 - Number of outstanding Section 4013 loans"
  },
  {
    value: "RCONLG25",
    label:	"RCONLG25 - Outstanding balance of Section 4013 loans"
  }
]

const ubprOptionsList = [
  {
    value: "UBPRD490",
    label: "UBPRD490 - LOANS TO FINANCE CONSTRUCTION AND DEVELOPMENT AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRD646",
    label: "UBPRD646 - CONSTRUCTION AND LAND DEVELOPMENT LOANS AS PERCENT OF TOTAL LOANS"
  },
  {
    value: "UBPRD647",
    label: "UBPRD647 - COMMERCIAL REAL ESTATE LOANS INCLUDING NONOWNER OCCPIED NONFARM NONRESIDENTIAL LOANS AS PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRD648",
    label: "UBPRD648 - COMMERCIAL REAL ESTATE LOANS INCLUDING NONOWNER OCCUPIED NONFARM NONRESIDENTIAL PROPERTIES AS PERCENT OF TOTAL LOANS"
  },
  {
    value: "UBPRD649",
    label: "UBPRD649 - TOTAL COMMERCIAL REAL ESTATE LOANS INCLUDING ALL NONFARM NONRESIDENTIAL LOANS AS PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRD650",
    label: "UBPRD650 - TOTAL COMMMERCIAL REAL ESTATE LOANS INCLUDING ALL NONFARM NONRESIDENTIAL REAL ESTATE LOANS AS PERCENT OT TOTAL LOANS"
  },
  {
    value: "UBPRE392",
    label: "UBPRE392 - LOANS SECURED BY NONFARM NONRESIDENTIAL PROPERTIES AS PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRE632",
    label: "UBPRE632 - 1-4 FAMILY RESIDENTIAL CONSTRUCTION LOANS AS PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRE657",
    label: "UBPRE657 - OTHER CONSTRUCTION AND LAND DEVELOPMENT LOANS AS PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRE658",
    label: "UBPRE658 - 1 TO 4 FAMILY REAL ESTATE LOANS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE663",
    label: "UBPRE663 - HOME EQUITY LOANS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE880",
    label: "UBPRE880 - LOANS SECURED BY FARMLAND AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE881",
    label: "UBPRE881 - LOANS SECURED BY MULTIFAMILY REAL ESTATE AS PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE882",
    label: "UBPRE882 - LOANS SECURED BY NONFARM NONRESIDENTIAL PROPERTIES AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE883",
    label: "UBPRE883 - LOANS SECURED BY NONFARM NONRESIDENTIAL OWNER OCCUPIED PROPERTY AS A PERCENT OF TOTAL CAPITAL"
  },
  {
    value: "UBPRE884",
    label: "UBPRE884 - TOTAL REAL ESTATE LOANS IN DOMESTIC OFFICES AS A PERCENT OF TIER ONE CAPITAL PLUS THE ALLOWANCE FOR LOAN AND LEASE LOSSES."
  },
  {
    value: "UBPRE885",
    label: "UBPRE885 - LOANS TO FINANCIAL INSTITUTIONS AS PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE886",
    label: "UBPRE886 - LOANS TO FINANCE AGRICULTURAL PRODUCTION AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE887",
    label: "UBPRE887 - COMMERCIAL AND INDUSTRIAL LOANS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE888",
    label: "UBPRE888 - LOANS TO INDIVIDUALS IN DOMESTIC OFFICES AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE889",
    label: "UBPRE889 - CREDIT CARD LOANS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE890",
    label: "UBPRE890 - LOANS TO STATE AND LOCAL GOVERNMENTS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE891",
    label: "UBPRE891 - LOANS AND LEASES IN FOREIGN OFFICES AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE892",
    label: "UBPRE892 - OTHER DOMESTIC LOANS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE893",
    label: "UBPRE893 - DOMESTIC LEASE FINANCING AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE894",
    label: "UBPRE894 - LOANS TO FOREIGN GOVERNMENTS AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRE895",
    label: "UBPRE895 - LOANS TO FINANCE COMMERCIAL REAL ESTATE AS A PERCENT OF TOTAL RISK-BASED CAPITAL"
  },
  {
    value: "UBPRFB78",
    label: "UBPRFB78 - RATIO 1-4 FAMILY 1ST LIEN LOANS TO CAPITAL"
  },
  {
    value: "UBPRFB79",
    label: "UBPRFB79 - RATIO 1-4 FAMILY JR LIEN LOANS TO CAPITAL"
  },
  {
    value: "UBPRFB80",
    label: "UBPRFB80 - RATIO RE LOANS IN FO TO CAPITAL"
  },
  {
    value: "UBPRFB81",
    label: "UBPRFB81 - RATIO AUTO LOANS TO CAPITAL"
  },
  {
    value: "UBPRFB82",
    label: "UBPRFB82 - RATIO LEASES TO INDIVIDUALS TO CAPITAL"
  },
  {
    value: "UBPRFB83",
    label: "UBPRFB83 - RATIO ALL OTHER LEASES TO CAPITAL"
  },
  {
    value: "UBPRNL33",
    label: "UBPRNL33 - 3 YEAR NOO CRE GROWTH RATIO"
  }
]

const peerGroupOptionsList = [
  {
    "id": 1,
    metric: "peer_group",
    value: `AND "ASSET_INT" > 100000000`,
    label: "1 - In excess of $100 billion"
  },
  {
    "id": 2,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 10000000 AND 100000000`,
    label: "2 - Between $10 billion and $100 billion"
  },
  {
    "id": 3,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 3000000 AND 10000000`,
    label: "3 - Between $3 billion and $10 billion"
  },
  {
    "id": 4,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 1000000 AND 3000000`,
    label: "4 - Between $1 billion and $3 billion"
  },
  {
    "id": 5,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 300000 AND 1000000`,
    label: "5 - Between $300 million and $1 billion"
  },
  {
    "id": 6,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 100000 AND 300000 AND "OFFICES" >= 3 AND "MSA" != ''`,
    label: "6 - Between $100 million and $300 million, with 3 or more offices, in a Metropolitan area"
  },
  {
    "id": 7,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 100000 AND 300000 AND "OFFICES" >= 3 AND "MSA" = ''`,
    label: "7 - Between $100 million and $300 million, with 3 or more offices, in a Non-metropolitan area"
  },
  {
    "id": 8,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 100000 AND 300000 AND "OFFICES" <= 2 AND "MSA" != ''`,
    label: "8 - Between $100 million and $300 million, with 2 or fewer offices, in a Metropolitan area"
  },
  {
    "id": 9,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 100000 AND 300000 AND "OFFICES" <= 2 AND "MSA" = ''`,
    label: "9 - Between $100 million and $300 million, with 2 or fewer offices, in a Non-metropolitan area"
  },
  {
    "id": 10,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 50000 AND 100000 AND "OFFICES" >= 3 AND "MSA" != ''`,
    label: "10 - Between $50 million and $100 million, with 3 or more offices, in a Metropolitan area"
  },
  {
    "id": 11,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 50000 AND 100000 AND "OFFICES" >= 3 AND "MSA" = ''`,
    label: "11 - Between $50 million and $100 million, with 3 or more offices, in a Non-metropolitan area"
  },
  {
    "id": 12,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 50000 AND 100000 AND "OFFICES" <= 2 AND "MSA" != ''`,
    label: "12 - Between $50 million and $100 million, with 2 or fewer offices, in a Metropolitan area"
  },
  {
    "id": 13,
    metric: "peer_group",
    value: `AND "ASSET_INT" BETWEEN 50000 AND 100000 AND "OFFICES" <= 2 AND "MSA" = ''`,
    label: "13 - Between $50 million and $100 million, with 2 or fewer offices, in a Non-metropolitan area"
  },
  {
    "id": 14,
    metric: "peer_group",
    value: `AND "ASSET_INT" < 50000 AND "OFFICES" >= 2 AND "MSA" != ''`,
    label: "14 - Less than $50 million, with 2 or more offices, in a Metropolitan area"
  },
  {
    "id": 15,
    metric: "peer_group",
    value: `AND "ASSET_INT" < 50000 AND "OFFICES" >= 2 AND "MSA" = ''`,
    label: "15 - Less than $50 million, with 2 or more offices, in a Non-metropolitan area"
  },
  {
    "id": 16,
    metric: "peer_group",
    value: `AND "ASSET_INT" < 50000 AND "OFFICES" = 1 AND "MSA" != ''`,
    label: "16 - Less than $50 million, with 1 office, in a Metropolitan area"
  },
  {
    "id": 17,
    metric: "peer_group",
    value: `AND "ASSET_INT" < 50000 AND "OFFICES" = 1 AND "MSA" = ''`,
    label: "17 - Less than $50 million, with 1 office, in a Non-metropolitan area"
  }
]

const peerGroupStateOptionsList = [
  {
    metric: "state",
    value: "Alabama",
    label: "Alabama"
  },
  {
    metric: "state",
    value: "Alaska",
    label: "Alaska"
  },
  {
    metric: "state",
    value: "Arizona",
    label: "Arizona"
  },
  {
    metric: "state",
    value: "Arkansas",
    label: "Arkansas"
  },
  {
    metric: "state",
    value: "California",
    label: "California"
  },
  {
    metric: "state",
    value: "Colorado",
    label: "Colorado"
  },
  {
    metric: "state",
    value: "Connecticut",
    label: "Connecticut"
  },
  {
    metric: "state",
    value: "Delaware",
    label: "Delaware"
  },
  {
    metric: "state",
    value: "Florida",
    label: "Florida"
  },
  {
    metric: "state",
    value: "Georgia",
    label: "Georgia"
  },
  {
    metric: "state",
    value: "Hawaii",
    label: "Hawaii"
  },
  {
    metric: "state",
    value: "Idaho",
    label: "Idaho"
  },
  {
    metric: "state",
    value: "Illinois",
    label: "Illinois"
  },
  {
    metric: "state",
    value: "Indiana",
    label: "Indiana"
  },
  {
    metric: "state",
    value: "Iowa",
    label: "Iowa"
  },
  {
    metric: "state",
    value: "Kansas",
    label: "Kansas"
  },
  {
    metric: "state",
    value: "Kentucky",
    label: "Kentucky"
  },
  {
    metric: "state",
    value: "Louisiana",
    label: "Louisiana"
  },
  {
    metric: "state",
    value: "Maine",
    label: "Maine"
  },
  {
    metric: "state",
    value: "Maryland",
    label: "Maryland"
  },
  {
    metric: "state",
    value: "Massachusetts",
    label: "Massachusetts"
  },
  {
    metric: "state",
    value: "Michigan",
    label: "Michigan"
  },
  {
    metric: "state",
    value: "Minnesota",
    label: "Minnesota"
  },
  {
    metric: "state",
    value: "Mississippi",
    label: "Mississippi"
  },
  {
    metric: "state",
    value: "Missouri",
    label: "Missouri"
  },
  {
    metric: "state",
    value: "Montana",
    label: "Montana"
  },
  {
    metric: "state",
    value: "Nebraska",
    label: "Nebraska"
  },
  {
    metric: "state",
    value: "Nevada",
    label: "Nevada"
  },
  {
    metric: "state",
    value: "New Hampshire",
    label: "New Hampshire"
  },
  {
    metric: "state",
    value: "New Jersey",
    label: "New Jersey"
  },
  {
    metric: "state",
    value: "New Mexico",
    label: "New Mexico"
  },
  {
    metric: "state",
    value: "New York",
    label: "New York"
  },
  {
    metric: "state",
    value: "North Carolina",
    label: "North Carolina"
  },
  {
    metric: "state",
    value: "North Dakota",
    label: "North Dakota"
  },
  {
    metric: "state",
    value: "Ohio",
    label: "Ohio"
  },
  {
    metric: "state",
    value: "Oklahoma",
    label: "Oklahoma"
  },
  {
    metric: "state",
    value: "Oregon",
    label: "Oregon"
  },
  {
    metric: "state",
    value: "Pennsylvania",
    label: "Pennsylvania"
  },
  {
    metric: "state",
    value: "Rhode Island",
    label: "Rhode Island"
  },
  {
    metric: "state",
    value: "South Carolina",
    label: "South Carolina"
  },
  {
    metric: "state",
    value: "South Dakota",
    label: "South Dakota"
  },
  {
    metric: "state",
    value: "Tennessee",
    label: "Tennessee"
  },
  {
    metric: "state",
    value: "Texas",
    label: "Texas"
  },
  {
    metric: "state",
    value: "Utah",
    label: "Utah"
  },
  {
    metric: "state",
    value: "Vermont",
    label: "Vermont"
  },
  {
    metric: "state",
    value: "Virginia",
    label: "Virginia"
  },
  {
    metric: "state",
    value: "Washington",
    label: "Washington"
  },
  {
    metric: "state",
    value: "West Virginia",
    label: "West Virginia"
  },
  {
    metric: "state",
    value: "Wisconsin",
    label: "Wisconsin"
  },
  {
    metric: "state",
    value: "Wyoming",
    label: "Wyoming"
  }
]

export {
  getAverage,
  getPercentage,
  getDateLabelsForChart,
  groupDataByRegion,
  getLinearRegression,
  getQuarter,
  split,
  chartFadedColors,
  chartSolidColors,
  cexFadedColors,
  cexSolidColors,
  pointStyles,
  regressionLineColor,
  rconOptionsList,
  ubprOptionsList,
  peerGroupOptionsList,
  peerGroupStateOptionsList
}