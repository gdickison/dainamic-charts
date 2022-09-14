CREATE VIEW banking_app.cex_sample_education AS
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
  COUNT("EDUCA2") AS total_spouse,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '00') AS NUMERIC) AS sample_none,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '00')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_none,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '00') AS NUMERIC) AS spouse_none,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '00')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_none,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '10') AS NUMERIC) AS sample_less_than_hs,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '10')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_less_than_hs,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '10') AS NUMERIC) AS spouse_less_than_hs,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '10')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_less_than_hs,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '11') AS NUMERIC) AS sample_some_hs,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '11')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_some_hs,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '11') AS NUMERIC) AS spouse_some_hs,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '11')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_some_hs,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '12') AS NUMERIC) AS sample_hs_diploma,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_hs_diploma,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '12') AS NUMERIC) AS spouse_hs_diploma,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '12')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_hs_diploma,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '13') AS NUMERIC) AS sample_some_college,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_some_college,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '13') AS NUMERIC) AS spouse_some_college,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '13')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_some_college,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '14') AS NUMERIC) AS sample_associate,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_associate,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '14') AS NUMERIC) AS spouse_associate,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '14')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_associate,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '15') AS NUMERIC) AS sample_bachelors,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_bachelors,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '15') AS NUMERIC) AS spouse_bachelors,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '15')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_bachelors,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '16') AS NUMERIC) AS sample_post_grad_degree,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS percent_sample_post_grad_degree,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '16') AS NUMERIC) AS spouse_post_grad_degree,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '16')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS percent_spouse_post_grad_degree
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region