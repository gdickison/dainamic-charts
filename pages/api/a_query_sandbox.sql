-- household education level (ref and spouse)
CREATE VIEW banking_app.cex_ed_level AS
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
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" <= '12' AND "EDUC_REF" != '') AS NUMERIC) AS ref_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" <= '12' AND "EDUC_REF" != '')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" <= '12' AND "EDUCA2" != '') AS NUMERIC) AS spouse_dipl_or_less,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" <= '12' AND "EDUCA2" != '')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS pct_spouse_dipl_or_less,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '13') AS NUMERIC) AS ref_some_college,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_college,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '13') AS NUMERIC) AS spouse_some_college,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '13')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS pct_spouse_some_college,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '14') AS NUMERIC) AS ref_associate,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_associate,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '14') AS NUMERIC) AS spouse_associate,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '14')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS pct_spouse_associate,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '15') AS NUMERIC) AS ref_bachelors,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bachelors,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '15') AS NUMERIC) AS spouse_bachelors,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '15')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS pct_spouse_bachelors,
  CAST(COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '16') AS NUMERIC) AS ref_post_grad_degree,
  ROUND((CAST((COUNT("NEWID") FILTER (WHERE "EDUC_REF" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_grad_degree,
  CAST(COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '16') AS NUMERIC) AS spouse_post_grad_degree,
  ROUND((CAST((COUNT("EDUCA2") FILTER (WHERE "EDUCA2" = '16')) AS NUMERIC) / COUNT("EDUCA2")), 4) * 100 AS pct_spouse_post_grad_degree
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region



-- total amount of family income before taxes in the last 12 months by ref/spouse education level combination
CREATE VIEW banking_app.cex_inc_by_combined_ed_level AS
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
  ROUND(AVG("FINCBTAX" ::DECIMAL)) AS avg_inc,
  -- REF HAS HS DIPLOMA OR LESS
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" <= '12' AND "EDUCA2" !='') AS ct_ref_dipl_or_less_spouse_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" <= '12' AND "EDUCA2" !='')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" <= '12' AND "EDUCA2" !=''), 2) AS inc_ref_dipl_or_less_spouse_dipl_or_less,
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '12') AS ct_ref_dipl_or_less_spouse_dipl,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_dipl,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '12'), 2) AS inc_ref_dipl_or_less_spouse_dipl,
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '13') AS ct_ref_dipl_or_less_spouse_some_coll,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '13'), 2) AS inc_ref_dipl_or_less_spouse_some_coll,
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '14') AS ct_ref_dipl_or_less_spouse_assoc,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '14'), 2) AS inc_ref_dipl_or_less_spouse_assoc,
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '15') AS ct_ref_dipl_or_less_spouse_bach,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '15'), 2) AS inc_ref_dipl_or_less_spouse_bach,
	COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '16') AS ct_ref_dipl_or_less_spouse_post,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_dipl_or_less_spouse_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '')
      AND "EDUCA2" = '16'), 2) AS inc_ref_dipl_or_less_spouse_post,
  -- REF HAS SOME COLLEGE
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='') AS ct_ref_some_coll_spouse_dipl_or_less,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='')) AS NUMERIC) / COUNT("NEWID")), 4) * 100  AS pct_ref_some_coll_spouse_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" <= '12' AND "EDUCA2" !=''), 2) AS inc_ref_some_coll_spouse_dipl_or_less,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '12') AS ct_ref_some_coll_spouse_dipl,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_coll_spouse_dipl,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '12'), 2) AS inc_ref_some_coll_spouse_dipl,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '13') AS ct_ref_some_coll_spouse_some_coll,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_coll_spouse_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '13'), 2) AS inc_ref_some_coll_spouse_some_coll,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '14') AS ct_ref_some_coll_spouse_assoc,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_coll_spouse_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '14'), 2) AS inc_ref_some_coll_spouse_assoc,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '15') AS ct_ref_some_coll_spouse_bach,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_coll_spouse_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '15'), 2) AS inc_ref_some_coll_spouse_bach,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '16') AS ct_ref_some_coll_spouse_post,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_some_coll_spouse_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '13'
      AND "EDUCA2" = '16'), 2) AS inc_ref_some_coll_spouse_post,
  -- REF HAS ASSOCIATE'S DEGREE
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='') AS ct_ref_assoc_spouse_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='')) AS NUMERIC) / COUNT("NEWID")), 4) * 100  AS pct_ref_assoc_spouse_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" <= '12' AND "EDUCA2" !=''), 2) AS inc_ref_assoc_spouse_dipl_or_less,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '12') AS ct_ref_assoc_spouse_dipl,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_assoc_spouse_dipl,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '12'), 2) AS inc_ref_assoc_spouse_dipl,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '13') AS ct_ref_assoc_spouse_some_coll,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_assoc_spouse_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '13'), 2) AS inc_ref_assoc_spouse_some_coll,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '14') AS ct_ref_assoc_spouse_assoc,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_assoc_spouse_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '14'), 2) AS inc_ref_assoc_spouse_assoc,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '15') AS ct_ref_assoc_spouse_bach,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_assoc_spouse_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '15'), 2) AS inc_ref_assoc_spouse_bach,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '16') AS ct_ref_assoc_spouse_post,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_assoc_spouse_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '14'
      AND "EDUCA2" = '16'), 2) AS inc_ref_assoc_spouse_post,
  -- REF HAS BACHELOR'S DEGREE
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='') AS ct_ref_bach_spouse_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='')) AS NUMERIC) / COUNT("NEWID")), 4) * 100  AS pct_ref_bach_spouse_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" <= '12' AND "EDUCA2" !=''), 2) AS inc_ref_bach_spouse_dipl_or_less,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '12') AS ct_ref_bach_spouse_dipl,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bach_spouse_dipl,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '12'), 2) AS inc_ref_bach_spouse_dipl,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '13') AS ct_ref_bach_spouse_some_coll,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bach_spouse_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '13'), 2) AS inc_ref_bach_spouse_some_coll,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '14') AS ct_ref_bach_spouse_assoc,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bach_spouse_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '14'), 2) AS inc_ref_bach_spouse_assoc,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '15') AS ct_ref_bach_spouse_bach,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bach_spouse_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '15'), 2) AS inc_ref_bach_spouse_bach,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '16') AS ct_ref_bach_spouse_post,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_bach_spouse_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '15'
      AND "EDUCA2" = '16'), 2) AS inc_ref_bach_spouse_post,
  -- REF HAS A POST-GRAD DEGREE
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='') AS ct_ref_post_spouse_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" <= '12' AND "EDUCA2" !='')) AS NUMERIC) / COUNT("NEWID")), 4) * 100  AS pct_ref_post_spouse_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" <= '12' AND "EDUCA2" !=''), 2) AS inc_ref_post_spouse_dipl_or_less,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '12') AS ct_ref_post_spouse_dipl,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '12')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_spouse_dipl,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '12'), 2) AS inc_ref_post_spouse_dipl,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '13') AS ct_ref_post_spouse_some_coll,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_spouse_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '13'), 2) AS inc_ref_post_spouse_some_coll,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '14') AS ct_ref_post_spouse_assoc,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_spouse_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '14'), 2) AS inc_ref_post_spouse_assoc,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '15') AS ct_ref_post_spouse_bach,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_spouse_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '15'), 2) AS inc_ref_post_spouse_bach,
	COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '16') AS ct_ref_post_spouse_post,
	ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_post_spouse_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE "EDUC_REF" = '16'
      AND "EDUCA2" = '16'), 2) AS inc_ref_post_spouse_post
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region


-- total amount of family income before taxes in the last 12 months by education level
-- this view is probably not useful, as it takes no account of what the other spouse's education level is (i.e., not enough info to be useful)
-- SELECT
--   "QINTRVYR" ::INTEGER AS year,
-- 	"QINTRVMO" ::INTEGER AS month,
-- 	TO_DATE (CONCAT ("QINTRVYR", "QINTRVMO"), 'YYYYMM') AS date,
-- 	CASE
-- 		WHEN "REGION" IS NOT NULL AND "REGION" != '' THEN "REGION" ::INTEGER
-- 		WHEN "REGION" IS NULL OR "REGION" = '' THEN 0
-- 	END AS region,
-- 	CASE
-- 		WHEN "REGION" = '1' THEN 'Northeast'
-- 		WHEN "REGION" = '2' THEN 'Midwest'
-- 		WHEN "REGION" = '3' THEN 'South'
-- 		WHEN "REGION" = '4' THEN 'West'
-- 		WHEN "REGION" IS NULL OR "REGION" = '' THEN 'none'
-- 	END AS region_name,
--   ROUND(AVG("FINCBTAX" ::DECIMAL)) AS avg_inc,
--   -- REF OR SPOUSE HAVE HS DIPLOMA OR LESS
-- 	COUNT("NEWID") FILTER (
--     WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("EDUCA2" <= '12' AND "EDUCA2" != '')
--     ) AS ct_ref_or_spouse_dipl_or_less,
--   ROUND((CAST((COUNT("NEWID") FILTER (
--     WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("EDUCA2" <= '12' AND "EDUCA2" != '')
--     )) AS NUMERIC) / COUNT("NEWID")), 4) * 100 AS pct_ref_or_spouse_dipl_or_less,
-- 	ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
--     WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("EDUCA2" <= '12' AND "EDUCA2" != '')
--     ), 2) AS avg_inc_ref_or_spouse_dipl_or_less,
--   -- REF OR SPOUSE HAVE SOME COLLEGE
--   COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '13'
--       OR "EDUCA2" = '13') AS ct_ref_or_spouse_some_coll,
--   ROUND((CAST((COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '13'
--       OR "EDUCA2" = '13')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_ref_or_spouse_some_coll,
--   ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
--     WHERE "EDUC_REF" = '13'
--       OR "EDUCA2" = '13'), 2) AS inc_ref_or_spouse_some_coll,
--   -- REF OR SPOUSE HAVE AN ASSOCIATE'S DEGREE
--   COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '14'
--       OR "EDUCA2" = '14') AS ct_ref_or_spouse_assoc,
--   ROUND((CAST((COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '14'
--       OR "EDUCA2" = '14')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_ref_or_spouse_assoc,
--   ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
--     WHERE "EDUC_REF" = '14'
--       OR "EDUCA2" = '14'), 2) AS inc_ref_or_spouse_assoc,
--   -- REF OR SPOUSE HAVE A BACHELOR'S DEGREE
--   COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '15'
--       OR "EDUCA2" = '15') AS ct_ref_or_spouse_bach,
--   ROUND((CAST((COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '15'
--       OR "EDUCA2" = '15')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_ref_or_spouse_bach,
--   ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
--     WHERE "EDUC_REF" = '15'
--       OR "EDUCA2" = '15'), 2) AS inc_ref_or_spouse_bach,
--   -- REF OR SPOUSE HAVE A POST-GRAD DEGREE
--   COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '16'
--       OR "EDUCA2" = '16') AS ct_ref_or_spouse_post,
--   ROUND((CAST((COUNT("NEWID") FILTER (
--     WHERE "EDUC_REF" = '16'
--       OR "EDUCA2" = '16')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_ref_or_spouse_post,
--   ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
--     WHERE "EDUC_REF" = '16'
--       OR "EDUCA2" = '16'), 2) AS inc_ref_or_spouse_post
-- FROM data_import.cex_pumd_fmli
-- GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
-- ORDER BY year, date, region

-- total amount of family income before taxes in the last 12 months by sex and education level
CREATE VIEW banking_app.cex_ed_level_sex_inc AS
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
  ROUND(AVG("FINCBTAX" ::DECIMAL)) AS avg_inc,
  -- DIPLOMA OR LESS
  -- male with dipl or less
	COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '1' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    ) AS ct_male_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '1' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1' OR "SEX2" = '1')), 4) * 100 AS pct_male_dipl_or_less,
	ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '1' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    ), 2) AS avg_inc_male_dipl_or_less,
  -- female with dipl or less
	COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '2' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '2' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    ) AS ct_female_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '2' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '2' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2' OR "SEX2" = '2')), 4) * 100 AS pct_female_dipl_or_less,
	ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '2' AND "EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("SEX2" = '2' AND "EDUCA2" <= '12' AND "EDUCA2" != ''))
    ), 2) AS avg_inc_female_dipl_or_less,
  -- SOME COLLEGE
  -- male has some college
  COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '13') OR ("SEX2" = '1' AND "EDUCA2" = '13'))) AS ct_male_some_coll,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '13') OR ("SEX2" = '1' AND "EDUCA2" = '13')))) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1' OR "SEX2" = '1')), 4) *100 AS pct_male_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '13') OR ("SEX2" = '1' AND "EDUCA2" = '13'))), 2) AS inc_male_some_coll,
  -- female has some college
  COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '13' OR "SEX2" = '2' AND "EDUCA2" = '13')
    ) AS ct_female_some_coll,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '13' OR "SEX2" = '2' AND "EDUCA2" = '13')
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2' OR "SEX2" = '2')), 4) *100 AS pct_female_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '13' OR "SEX2" = '2' AND "EDUCA2" = '13')
    ), 2) AS inc_female_some_coll,
  -- ASSOC DEGREE
  -- male has assoc degree
  COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '14') OR ("SEX2" = '1' AND "EDUCA2" = '14'))
    ) AS ct_male_assoc,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '14') OR ("SEX2" = '1' AND "EDUCA2" = '14'))
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1' OR "SEX2" = '1')), 4) *100 AS pct_male_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '14') OR ("SEX2" = '1' AND "EDUCA2" = '14'))
    ), 2) AS inc_male_assoc,
  -- female has assoc degree
  COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '14' OR "SEX2" = '2' AND "EDUCA2" = '14')
    ) AS ct_female_assoc,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '14' OR "SEX2" = '2' AND "EDUCA2" = '14')
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2' OR "SEX2" = '2')), 4) *100 AS pct_female_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '14' OR "SEX2" = '2' AND "EDUCA2" = '14')
    ), 2) AS inc_female_assoc,
  -- BACHELOR'S DEGREE
  -- male has bachelor's degree
  COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '15') OR ("SEX2" = '1' AND "EDUCA2" = '15'))
    ) AS ct_male_bach,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '15') OR ("SEX2" = '1' AND "EDUCA2" = '15'))
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1' OR "SEX2" = '1')), 4) *100 AS pct_male_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '15') OR ("SEX2" = '1' AND "EDUCA2" = '15'))
    ), 2) AS inc_male_bach,
  -- female has bachelor's degree
  COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '15' OR "SEX2" = '2' AND "EDUCA2" = '15')
    ) AS ct_female_bach,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '15' OR "SEX2" = '2' AND "EDUCA2" = '15')
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2' OR "SEX2" = '2')), 4) *100 AS pct_female_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '15' OR "SEX2" = '2' AND "EDUCA2" = '15')
    ), 2) AS inc_female_bach,
  -- POST GRAD DEGREE
  -- male has post grad degree
  COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '16') OR ("SEX2" = '1' AND "EDUCA2" = '16'))
    ) AS ct_male_post,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '16') OR ("SEX2" = '1' AND "EDUCA2" = '16'))
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '1' OR "SEX2" = '1')), 4) *100 AS pct_male_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE (("SEX_REF" = '1' AND "EDUC_REF" = '16') OR ("SEX2" = '1' AND "EDUCA2" = '16'))
    ), 2) AS inc_male_post,
  -- female has post grad degree
  COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '16' OR "SEX2" = '2' AND "EDUCA2" = '16')
    ) AS ct_female_post,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '16' OR "SEX2" = '2' AND "EDUCA2" = '16')
    )) AS NUMERIC) / COUNT("NEWID") FILTER (WHERE "SEX_REF" = '2' OR "SEX2" = '2')), 4) *100 AS pct_female_post,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE ("SEX_REF" = '2' AND "EDUC_REF" = '16' OR "SEX2" = '2' AND "EDUCA2" = '16')
    ), 2) AS inc_female_post
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region



-- total amount of family income before taxes in the last 12 months by highest education level in household
CREATE VIEW banking_app.cex_inc_by_hi_ed_level AS
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
  ROUND(AVG("FINCBTAX" ::DECIMAL)) AS avg_inc,
  -- DIPLOMA OR LESS
	COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") IN ('00', '10', '11', '12')) AS ct_hi_dipl_or_less,
  COUNT("NEWID") FILTER (
    WHERE ("EDUC_REF" <= '12' AND "EDUC_REF" != '') OR ("EDUCA2" <= '12' AND "EDUCA2" != '')
    ) AS ct_ref_or_spouse_dipl_or_less,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") IN ('00', '10', '11', '12'))) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_hi_dipl_or_less,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") IN ('00', '10', '11', '12')), 2) AS inc_hi_dipl_or_less,
  -- SOME COLLEGE
  COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '13') AS ct_hi_some_coll,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '13')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_hi_some_coll,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '13'), 2) AS inc_hi_some_coll,
  -- ASSOC DEGREE
  COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '14') AS ct_hi_assoc,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '14')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_hi_assoc,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '14'), 2) AS inc_hi_assoc,
  -- BACHELOR'S DEGREE
  COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '15') AS ct_hi_bach,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '15')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_hi_bach,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '15'), 2) AS inc_hi_bach,
  -- POST GRAD DEGREE
  COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '16') AS ct_hi_post_grad,
  ROUND((CAST((COUNT("NEWID") FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '16')) AS NUMERIC) / COUNT("NEWID")), 4) *100 AS pct_hi_post_grad,
  ROUND(AVG("FINCBTAX" ::DECIMAL) FILTER (
    WHERE GREATEST("EDUC_REF", "EDUCA2") = '16'), 2) AS inc_hi_post_grad
FROM data_import.cex_pumd_fmli
GROUP BY "QINTRVYR", "QINTRVMO", "REGION"
ORDER BY year, date, region
