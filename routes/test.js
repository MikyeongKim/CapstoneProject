const express = require('express')
    , router = express.Router()
    , models = require('../models');
const fs = require('fs');

router.route('/').get((req, res) => {
    fs.writeFile('removefile.txt', '하하호호호', 'utf-8', err => {
        if (err) {
            console.log("error발생");
        }
    })
    res.send('파일생성공');
})

router.route('/remove').get((req, res) => {
    try {
        fs.unlinkSync('removefile.txt');
        console.log('파일삭제성공 ')
    } catch (e) {
        console.log(`파일삭제 실패 ${e}`)
    }
})




module.exports = router;