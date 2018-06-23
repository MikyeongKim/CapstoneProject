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