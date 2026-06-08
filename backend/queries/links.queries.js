const pool = require('../db');

const createLink = async (userId, originalUrl, shortCode) => {
    const result = await pool.query(
        `INSERT INTO links (user_id, short_code, original_url) VALUES ($1, $2, $3) RETURNING *`,
        [userId, originalUrl, shortCode]
    );
    return result.rows[0];
};

const findLinkByShortCode = async (shortCode) => {
  const result = await pool.query(
    'SELECT * FROM links WHERE short_code = $1 AND is_active = true',
    [shortCode]
  );
  return result.rows[0] || null;
};

const getUserLinks = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const trackClick = async (linkId, metadata) => {
  await pool.query(
    'INSERT INTO clicks (link_id, metadata) VALUES ($1, $2)',
    [linkId, JSON.stringify(metadata)]
  );
};

const getAnalytics = async (linkId) => {
  const result = await pool.query(`
    WITH daily_clicks AS (
      SELECT DATE(clicked_at) as date, COUNT(*) as clicks
      FROM clicks WHERE link_id = $1
      GROUP BY DATE(clicked_at) ORDER BY date
    )
    SELECT date, clicks, SUM(clicks) OVER (ORDER BY date) as running_total
    FROM daily_clicks
  `, [linkId]);
  return result.rows;
};

const getDeviceStats = async (linkId) => {
  const result = await pool.query(`
    SELECT metadata->>'device' as device, COUNT(*) as count
    FROM clicks WHERE link_id = $1
    GROUP BY metadata->>'device'
  `, [linkId]);
  return result.rows;
};

const getTopLinks = async (userId) => {
  const result = await pool.query(`
    WITH top_links AS (
      SELECT link_id, COUNT(*) as clicks
      FROM clicks GROUP BY link_id
      ORDER BY clicks DESC LIMIT 5
    )
    SELECT l.short_code, l.original_url, t.clicks
    FROM top_links t JOIN links l ON l.id = t.link_id
    WHERE l.user_id = $1
  `, [userId]);
  return result.rows;
};

module.exports = { createLink, findLinkByShortCode, getUserLinks, trackClick, getAnalytics, getDeviceStats, getTopLinks };