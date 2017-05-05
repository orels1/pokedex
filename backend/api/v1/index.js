const express = require('express');
const search = require('./search');

const router = express.Router();

router.use('/search', search.router);

module.exports = router;
