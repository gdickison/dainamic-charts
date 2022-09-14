CREATE VIEW banking_app.cex_sample_race AS
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
  COUNT("RACE2") AS "total_spouse",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '1') AS NUMERIC) AS "sample_white",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '1')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_white",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '1') AS NUMERIC) AS "spouse_white",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '1')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_white",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '2') AS NUMERIC) AS "sample_black",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '2')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_black",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '2') AS NUMERIC) AS "spouse_black",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '2')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_black",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '3') AS NUMERIC) AS "sample_native_american",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '3')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_native_american",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '3') AS NUMERIC) AS "spouse_native_american",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '3')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_native_american",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '4') AS NUMERIC) AS "sample_asian",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '4')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_asian",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '4') AS NUMERIC) AS "spouse_asian",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '4')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_asian",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '5') AS NUMERIC) AS "sample_pacific_islander",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '5')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_pacific_islander",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '5') AS NUMERIC) AS "spouse_pacific_islander",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '5')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_pacific_islander",
  CAST(COUNT("NEWID") FILTER (WHERE "REF_RACE" = '6') AS NUMERIC) AS "sample_mixed",
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "REF_RACE" = '6')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS "percent_sample_mixed",
  CAST(COUNT("RACE2") FILTER (WHERE "RACE2" = '6') AS NUMERIC) AS "spouse_mixed",
  ROUND((CAST((COUNT("RACE2") FILTER (WHERE "RACE2" = '6')) AS NUMERIC) / COUNT("RACE2")), 4) * 100 AS "percent_spouse_mixed"
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region