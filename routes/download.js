const express = require('express');
const router = express.Router();

router.route('/').get((req, res) => {
  return res.status(200).send('다운로드당');
});

router.route('/submit/:id').get((req, res) => {
  return res.download(`${__dirname}/../uploads/submit/${req.params.id}`);
});

router.route('/:id').get((req, res) => {
  return res.download(`${__dirname}/../uploads/task/${req.params.id}`);
});

module.exports = router;
