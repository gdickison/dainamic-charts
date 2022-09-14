CREATE VIEW banking_app.cex_sample_earners AS
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
	COUNT("NEWID") AS total_sample,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '1') AS ref_only,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '1') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_ref_only,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '1') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '1') AS avg_family_pretax_income_ref_only,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '2') AS ref_and_spouse,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '2') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_ref_and_spouse,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '2') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '2') AS avg_family_pretax_income_ref_and_spouse,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '3') AS ref_and_spouse_and_others,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '3') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_ref_and_spouse_and_others,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '3') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '3') AS avg_family_pretax_income_ref_spouse_and_others,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '4') AS ref_and_others,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '4') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_ref_and_others,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '4') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '4') AS avg_family_pretax_income_ref_and_others,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '5') AS spouse_only,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '5') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_spouse_only,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '5') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '5') AS avg_family_pretax_income_spouse_only,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '6') AS spouse_and_others,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '6') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_spouse_and_others,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '6') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '6') AS avg_family_pretax_income_spouse_and_others,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '7') AS others_only,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '7') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_others_only,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '7') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '7') AS avg_family_pretax_income_others_only,
  COUNT("NEWID") FILTER(WHERE "EARNCOMP" = '8') AS no_earners,
  ROUND(CAST(COUNT("NEWID") FILTER (WHERE "EARNCOMP" = '8') AS NUMERIC)/COUNT("NEWID"), 4) * 100 AS percent_no_earners,
  SUM("FINCBTAX" ::DECIMAL) FILTER (WHERE "EARNCOMP" = '8') / COUNT("FINCBTAX") FILTER (WHERE "EARNCOMP" = '8') AS avg_family_pretax_income_no_earners
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region