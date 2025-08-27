CREATE OR REPLACE FUNCTION get_violations_summary()
RETURNS TABLE(name TEXT, value BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    violation_type AS name,
    COUNT(*) AS value
  FROM
    fines
  GROUP BY
    violation_type
  ORDER BY
    value DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;