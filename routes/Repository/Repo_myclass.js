const models = require('../../models');
module.exports = {
    findClassByStu: findClassByStu
    , findClassByPro: findClassByPro
    , findPlanByAll: findPlanByAll
}

function findClassByStu(userno, callback) {
    models.Student.findAll({
        where: { student_no: userno },
        attributes: [],
        limit: 1,
        include: [{
            model: models.subject,
            attributes: ['subject_no', 'subject_name', 'subject_place', 'subject_credit', 'subject_time', 'sub_pro_name']
            , through: {
                attributes: [],
            },
        }]
    }).then(result => {
        callback(null, result[0]['subjects'])
    }).catch(err => {
        callback(err)
    })
}


function findClassByPro(userno, callback) {
    models.subject.findAll({
        where: { professor_no: userno },
    }).then(result => {
        callback(null, result)
    }).catch(err => {
        callback(err)
    })
}

function findPlanByAll(class_no, callback) {
    models.subject.findAll({
        where: { subject_no: class_no },
        include: [{
            model: models.subjectType
            , attributes: ['subjectType_name'],
        }, {
            model: models.Department
            , attributes: ['department_name'],
        }]
    }).then(result => {
        callback(null, result[0])
    }).catch(err => {
        callback(err)
    })

}



//이거 보존하기
function temp(class_no, callback) {
    models.Student.findAll({
        where: { student_no: 1 },
        attributes: [],
        limit: 1,
        include: [{
            model: models.subject
            , where: { subject_no: class_no }
            , include: [{
                model: models.subjectType
                , attributes: ['subjectType_name'],
            }, {
                model: models.Department
                , attributes: ['department_name'],
            }]
            , through: {
                attributes: [],
            },
        }]
    }).then(result => {
        callback(result[0]['subjects'][0])
    })

}