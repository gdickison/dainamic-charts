SELECT
	"QINTRVYR" ::INTEGER AS year,
	CASE
		WHEN "QINTRVMO" IN ('01', '02', '03') THEN 1
		WHEN "QINTRVMO" IN ('04', '05', '06') THEN 2
		WHEN "QINTRVMO" IN ('07', '08', '09') THEN 3
		WHEN "QINTRVMO" IN ('10', '11', '12') THEN 4
	END AS quarter,
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
    COUNT("SEX2") AS total_spouse,
    CAST(COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1') AS NUMERIC) AS "total_sample_male",
    CAST(COUNT("SEX2") FILTER (WHERE "SEX2" = '1') AS NUMERIC) AS "total_spouse_male",
    CAST(COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2') AS NUMERIC) AS "total_sample_female",
    CAST(COUNT("SEX2") FILTER (WHERE "SEX2" = '2') AS NUMERIC) AS "total_spouse_female",
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, month, region