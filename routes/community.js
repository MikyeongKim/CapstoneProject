const express = require('express');
const router = express.Router();
const service = require('./service/communityService');

router
  .route('/')
  .get(service.listAllCommunity)
  .post(service.createCommunity);

router.get('/new', (req, res) => {
  if (!req.session.userinfo) {
    res.status(401).redirect('/');
  }
  res.render('common/boardinsert');
});

router
  .route('/:id')
  .get(service.readCommunity)
  .put(service.updateCommunity)
  .delete(service.deleteCommunity);

router.get('/:id/edit', service.updateFormCommunity);

module.exports = router;
