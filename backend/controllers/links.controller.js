const { nanoid } = require('nanoid');
const { createLink, findLinkByShortCode, getUserLinks, trackClick, getAnalytics, getDeviceStats, getTopLinks } = require('../queries/links.queries');

const createShortLink = async (req, res) => {
  try {
    const { original_url } = req.body;
    const userId = req.userId; // from middleware
    const shortCode = nanoid(7);
    const link = await createLink(userId, original_url, shortCode);
    res.status(201).json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const redirectLink = async (req, res) => {
  try {
    const { short_code } = req.params;
    const link = await findLinkByShortCode(short_code);
    if (!link) return res.status(404).json({ error: 'Not found' });

    await trackClick(link.id, {
      browser: req.headers['user-agent'],
      referrer: req.headers['referer'] || null,
      device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
    });

    res.redirect(link.original_url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLinksByUser = async (req, res) => {
  try {
    const links = await getUserLinks(req.userId);
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const analyticsDaily = async (req, res) => {
  try {
    const data = await getAnalytics(req.params.link_id, req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const analyticsDevices = async (req, res) => {
  try {
    const data = await getDeviceStats(req.params.link_id, req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const topLinks = async (req, res) => {
  try {
    const data = await getTopLinks(req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createShortLink, redirectLink, getLinksByUser, analyticsDaily, analyticsDevices, topLinks };