CREATE OR REPLACE FUNCTION get_fines_trend(days_limit INT)
RETURNS TABLE(name TEXT, fines BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(d.day, 'Mon DD') AS name,
    COUNT(f.id) AS fines
  FROM
    GENERATE_SERIES(
      DATE_TRUNC('day', NOW() - (days_limit - 1) * INTERVAL '1 day'),
      DATE_TRUNC('day', NOW()),
      '1 day'
    ) AS d(day)
  LEFT JOIN
    fines f ON DATE_TRUNC('day', f.created_at) = d.day
  GROUP BY
    d.day
  ORDER BY
    d.day;
END;
$$ LANGUAGE plpgsql;