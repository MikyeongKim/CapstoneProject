const express = require('express')
    , router = express.Router()
    , models = require('../models');
const fs = require('fs');

router.route('/').get((req, res) => {
    const temp = testG();
    let result;

    do {
        try {
            result = temp.next();
            console.log(result)
        } catch(e) {
            console.log("에러발생");
            console.log(e)
            break;
        }
    } while (!result.done)

})



function test() {
    fs.writeFile(`abcd1.txt`, "텍스트1", 'utf-8', err => {
        if (err) {
            throw err
        }
    });
    return true;
}

function test2() {
    fs.writeFile(`abcd2.txt`, "텍스트2", 'utf-8', err => {
        if (err) {
            throw err
        }

    });
    throw "에러당";
    
}

function test3() {
    fs.writeFile(`abcd3.txt`, "텍스트3", 'utf-8', err => {
        if (err) {
            throw err
        }
    });
    return true;
}

function* testG() {
    yield test();
    yield test2();
    yield test3();

}

module.exports = router;