CREATE VIEW banking_app.cex_race AS
SELECT
	"QINTRVYR" ::INTEGER AS year,
	"QINTRVMO" ::INTEGER AS month,
	TO_DATE (CONCAT ("QINTRVYR", "QINTRVMO"), 'YYYYMM') AS date,
	CASE
		WHEN "REGION" IS NOT NULL AND "REGION" != '' THEN "REGION" ::INTEGER
		WHEN "REGION" IS NULL OR "REGION" = '' THEN 0
	END AS region,
	CASE
		WHEN "REGION" = '1' THEN 'Northeast'
		WHEN "REGION" = '2' THEN 'Midwest'
		WHEN "REGION" = '3' THEN 'South'
		WHEN "REGION" = '4' THEN 'West'
		WHEN "REGION" IS NULL OR "REGION" = '' THEN 'none'
	END AS region_name,
	COUNT("NEWID") AS "total_sample",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '1') AS NUMERIC) AS ct_white,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '1')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_white,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '1'), 2) AS inc_white,
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '2') AS NUMERIC) AS ct_black,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '2')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_black,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '2'), 2) AS inc_black,
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '3') AS NUMERIC) AS ct_native_american,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '3')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_native_american,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '3'), 2) AS inc_native_american,
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '4') AS NUMERIC) AS ct_asian,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '4')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_asian,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '4'), 2) AS inc_asian,
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '5') AS NUMERIC) AS ct_pacific_islander,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '5')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_pacific_islander,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '5'), 2) AS inc_pacific_islander,
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '6') AS NUMERIC) AS ct_mixed,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '6')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_mixed,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (WHERE "REF_RACE" = '6'), 2) AS inc_mixed
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region

CREATE TABLE banking_app.ubpr_institution AS
SELECT
  CAST("FED_RSSD" AS INTEGER) AS "BANK_ID",
	CAST("REPDTE" AS DATE) AS "AS_OF",
  "NAME",
  "ADDRESS",
  "CITY",
  "COUNTY",
  "STNAME",
  "ZIP",
  "MSA",
  "WEBADDR",
  "FDICREGN",
  "BKCLASS",
  "CLCODE",
  "DATEUPDT",
  "ASSET",
  "ROAPTX",
  "ROA",
  "DEPDOM",
  "DEP",
  "EQ",
  "ROE",
  "NETINC",
  "SPECGRPN"
FROM data_import.ubpr_institutions
WHERE "ACTIVE" = '1'
ORDER BY "BANK_ID";

CREATE TABLE banking_app.upbr_rcci_rcon AS
SELECT
  CAST("IDRSSD" AS INTEGER) AS "BANK_ID",
  CASE
    WHEN "REPORT_YEAR" = '2021' AND "REPORT_MONTH" = '3' THEN '2021-1'
    WHEN "REPORT_YEAR" = '2021' AND "REPORT_MONTH" = '6' THEN '2021-2'
    WHEN "REPORT_YEAR" = '2022' AND "REPORT_MONTH" = '3' THEN '2022-1'
    WHEN "REPORT_YEAR" = '2022' AND "REPORT_MONTH" = '6' THEN '2022-2'
  END AS "QUARTER",
  "RCON1288",
  "RCON1420",
  "RCON1460",
  "RCON1545",
  "RCON1590",
  "RCON1763",
  "RCON1764",
  "RCON1766",
  "RCON1797",
  "RCON2081",
  "RCON2107",
  "RCON2122",
  "RCON2123",
  "RCON2165",
  "RCON2746",
  "RCON5367",
  "RCON5368",
  "RCON5370",
  "RCONA247",
  "RCONA564",
  "RCONA565",
  "RCONA566",
  "RCONA567",
  "RCONA568",
  "RCONA569",
  "RCONA570",
  "RCONA571",
  "RCONA572",
  "RCONA573",
  "RCONA574",
  "RCONA575",
  "RCONB531",
  "RCONB534",
  "RCONB535",
  "RCONB538",
  "RCONB539",
  "RCONB837",
  "RCONC391",
  "RCONC779",
  "RCONC780",
  "RCONF158",
  "RCONF159",
  "RCONF160",
  "RCONF161",
  "RCONF162",
  "RCONF163",
  "RCONF230",
  "RCONF231",
  "RCONF232",
  "RCONF576",
  "RCONF577",
  "RCONG091",
  "RCONG092",
  "RCONG093",
  "RCONG094",
  "RCONG095",
  "RCONG096",
  "RCONG097",
  "RCONG098",
  "RCONG099",
  "RCONG100",
  "RCONG101",
  "RCONG102",
  "RCONG376",
  "RCONG378",
  "RCONGW45",
  "RCONGW46",
  "RCONGW47",
  "RCONHK25",
  "RCONJ451",
  "RCONJ454",
  "RCONJ464",
  "RCONJ466",
  "RCONJ467",
  "RCONJ468",
  "RCONJ469",
  "RCONJ470",
  "RCONJ471",
  "RCONK098",
  "RCONK137",
  "RCONK158",
  "RCONK159",
  "RCONK160",
  "RCONK161",
  "RCONK162",
  "RCONK163",
  "RCONK164",
  "RCONK165",
  "RCONK166",
  "RCONK168",
  "RCONK203",
  "RCONK204",
  "RCONK207",
  "RCONK256",
  "RCONLE75",
  "RCONLG24",
  "RCONLG25"
FROM data_import.ubpr_rcci;


SELECT
  r."IDRSSD" AS "BANK_ID",
  CASE
    WHEN r."REPORT_YEAR" = '2021' AND r."REPORT_MONTH" = '3' THEN '2021-1'
    WHEN r."REPORT_YEAR" = '2021' AND r."REPORT_MONTH" = '6' THEN '2021-2'
    WHEN r."REPORT_YEAR" = '2022' AND r."REPORT_MONTH" = '3' THEN '2022-1'
    WHEN r."REPORT_YEAR" = '2022' AND r."REPORT_MONTH" = '6' THEN '2022-2'
  END AS "QUARTER",
  r."REPORT_YEAR",
  r."REPORT_MONTH",
  i."NAME",
  i."ADDRESS",
  i."CITY",
  i."COUNTY",
  i."STNAME",
  i."ZIP",
  i."MSA",
  i."WEBADDR",
  i."FDICREGN",
  i."BKCLASS",
  i."CLCODE",
  i."DATEUPDT",
  i."ASSET",
  i."ROAPTX",
  i."ROA",
  i."DEPDOM",
  i."DEP",
  i."EQ",
  i."ROE",
  i."NETINC",
  i."SPECGRPN",
  r."RCON1288",
  r."RCON1420",
  r."RCON1460",
  r."RCON1545",
  r."RCON1590",
  r."RCON1763",
  r."RCON1764",
  r."RCON1766",
  r."RCON1797",
  r."RCON2081",
  r."RCON2107",
  r."RCON2122",
  r."RCON2123",
  r."RCON2165",
  r."RCON2746",
  r."RCON5367",
  r."RCON5368",
  r."RCON5370",
  r."RCONA247",
  r."RCONA564",
  r."RCONA565",
  r."RCONA566",
  r."RCONA567",
  r."RCONA568",
  r."RCONA569",
  r."RCONA570",
  r."RCONA571",
  r."RCONA572",
  r."RCONA573",
  r."RCONA574",
  r."RCONA575",
  r."RCONB531",
  r."RCONB534",
  r."RCONB535",
  r."RCONB538",
  r."RCONB539",
  r."RCONB837",
  r."RCONC391",
  r."RCONC779",
  r."RCONC780",
  r."RCONF158",
  r."RCONF159",
  r."RCONF160",
  r."RCONF161",
  r."RCONF162",
  r."RCONF163",
  r."RCONF230",
  r."RCONF231",
  r."RCONF232",
  r."RCONF576",
  r."RCONF577",
  r."RCONG091",
  r."RCONG092",
  r."RCONG093",
  r."RCONG094",
  r."RCONG095",
  r."RCONG096",
  r."RCONG097",
  r."RCONG098",
  r."RCONG099",
  r."RCONG100",
  r."RCONG101",
  r."RCONG102",
  r."RCONG376",
  r."RCONG378",
  r."RCONGW45",
  r."RCONGW46",
  r."RCONGW47",
  r."RCONHK25",
  r."RCONJ451",
  r."RCONJ454",
  r."RCONJ464",
  r."RCONJ466",
  r."RCONJ467",
  r."RCONJ468",
  r."RCONJ469",
  r."RCONJ470",
  r."RCONJ471",
  r."RCONK098",
  r."RCONK137",
  r."RCONK158",
  r."RCONK159",
  r."RCONK160",
  r."RCONK161",
  r."RCONK162",
  r."RCONK163",
  r."RCONK164",
  r."RCONK165",
  r."RCONK166",
  r."RCONK168",
  r."RCONK203",
  r."RCONK204",
  r."RCONK207",
  r."RCONK256",
  r."RCONLE75",
  r."RCONLG24",
  r."RCONLG25"
FROM data_import.ubpr_rcci r
  JOIN data_import.ubpr_institutions i
		ON r."IDRSSD" = i."FED_RSSD"
WHERE i."ACTIVE" = '1'
ORDER BY "QUARTER"

SELECT
  "ID RSSD" AS "BANK_ID",
  CASE
    WHEN "Reporting Period" LIKE '3/31/2019%' THEN '2019-1'
    WHEN "Reporting Period" LIKE '6/30/2019%' THEN '2019-2'
    WHEN "Reporting Period" LIKE '9/30/2019%' THEN '2019-3'
    WHEN "Reporting Period" LIKE '12/31/2019%' THEN '2019-4'
    WHEN "Reporting Period" LIKE '3/31/2020%' THEN '2020-1'
    WHEN "Reporting Period" LIKE '6/30/2020%' THEN '2020-2'
    WHEN "Reporting Period" LIKE '9/30/2020%' THEN '2020-3'
    WHEN "Reporting Period" LIKE '12/31/2020%' THEN '2020-4'
    WHEN "Reporting Period" LIKE '3/31/2021%' THEN '2021-1'
    WHEN "Reporting Period" LIKE '6/30/2021%' THEN '2021-2'
    WHEN "Reporting Period" LIKE '9/30/2021%' THEN '2021-3'
    WHEN "Reporting Period" LIKE '12/31/2021%' THEN '2021-4'
    WHEN "Reporting Period" LIKE '3/31/2022%' THEN '2022-1'
    WHEN "Reporting Period" LIKE '6/30/2022%' THEN '2022-2'
    WHEN "Reporting Period" LIKE '9/30/2022%' THEN '2022-3'
  END AS "QUARTER"
  "UBPRD490",
  "UBPRD646",
  "UBPRD647",
  "UBPRD648",
  "UBPRD649",
  "UBPRD650",
  "UBPRE392",
  "UBPRE632",
  "UBPRE657",
  "UBPRE658",
  "UBPRE663",
  "UBPRE880",
  "UBPRE881",
  "UBPRE882",
  "UBPRE883",
  "UBPRE884",
  "UBPRE885",
  "UBPRE886",
  "UBPRE887",
  "UBPRE888",
  "UBPRE889",
  "UBPRE890",
  "UBPRE891",
  "UBPRE892",
  "UBPRE893",
  "UBPRE894",
  "UBPRE895",
  "UBPRFB78",
  "UBPRFB79",
  "UBPRFB80",
  "UBPRFB81",
  "UBPRFB82",
  "UBPRFB83",
  "UBPRNL33"
FROM data_import.ubpr_credit_concentrations
ORDER BY "BANK_ID";