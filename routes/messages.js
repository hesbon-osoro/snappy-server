const { addMessage, getMessages } = require('../controllers/message');
const router = require('express').Router();

router.post('/addmsg', addMessage);
router.post('/getmsg', getMessages);

module.exports = router;
