const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { createShortLink, getLinksByUser, analyticsDaily, analyticsDevices, topLinks } = require('../controllers/links.controller');

router.post('/', authenticate, createShortLink);
router.get('/my', authenticate, getLinksByUser);
router.get('/analytics/:link_id', authenticate, analyticsDaily);
router.get('/analytics/:link_id/devices', authenticate, analyticsDevices);
router.get('/top/:user_id', authenticate, topLinks);

module.exports = router;