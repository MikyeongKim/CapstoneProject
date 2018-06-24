const express = require('express')
    , router = express.Router()


router.route('/').get((req, res) => {
    return res.status(200).send('다운로드당')
})

router.route('/:id').get((req, res) => {
module.exports = router
    return res.download(`${__dirname}/../uploads/notice/${req.params.id}`)
})


module.exports = router