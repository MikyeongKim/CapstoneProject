const express = require('express')
    , router = express.Router()
    , models = require('../models');


router.route('/').get((req, res) => {

    models.Editlog.findAll({
        limit: 10,
        order: [['created_at', 'DESC']]
    }).then(result => {
        res.render('common/complielog' , {result : result})
    }).catch(err => {
        console.log(err)
    });


})

module.exports = router;