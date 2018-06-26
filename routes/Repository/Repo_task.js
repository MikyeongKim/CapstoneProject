const models = require('../../models');

const NOTICE = 5
    , QNA = 6
    , PPT = 7
    , TASK = 8;

module.exports = {
    createTask: createTask        // 5task
    , findAllTask: findAllTask
    , readTaskPro: readTaskPro
    , readTaskStu: readTaskStu
    , createFileTask: createFileTask
    , taskSubmit: taskSubmit
    , taskSubmitFile: taskSubmitFile
    , delTaskSubmit: delTaskSubmit

}


// task 글작성
function createTask(body, user_name, time, time_sec, callback) {
    return models.sequelize.transaction(function (t) {
        return models.blog.create({
            blog_title: body.title,
            blog_content: body.content,
            blog_writer: user_name,
            blog_user_no: body.user_no,
            blog_category: TASK,
            subject_no: body.subject_no,
        }, { transaction: t })
            .then(result => {
                return models.taskinfo.create({
                    taskinfo_method: body.how,
                    taskinfo_name: body.taskName,
                    taskinfo_period: time,
                    taskinfo_seconds: time_sec,
                    blog_no: result.blog_no
                }, { transaction: t })
            })
    }).then(result => {
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

function createFileTask(body, user_name, time, time_sec, files, callback) {
    return models.sequelize.transaction(function (t) {
        return models.blog.create({
            blog_title: body.title,
            blog_content: body.content,
            blog_writer: user_name,
            blog_user_no: body.user_no,
            blog_category: TASK,
            subject_no: body.subject_no,
        }, { transaction: t })
            .then(result => {
                models.sequelize.Promise.all([
                    models.taskinfo.create({
                        taskinfo_method: body.how,
                        taskinfo_name: body.taskName,
                        taskinfo_period: time,
                        taskinfo_seconds: time_sec,
                        blog_no: result.blog_no
                    }),
                    models.file.create({
                        file_origin_name: files.originalname,
                        file_save_name: files.filename,
                        file_path: files.path,
                        blog_no: result.blog_no
                    })
                ], { transaction: t })
            })
    }).then(result => {
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

// task 게시글나열
function findAllTask(subject_no, callback) {
    models.blog.findAll({
        where: {
            blog_category: TASK,
            subject_no: subject_no
        },
        include: [{
            model: models.taskinfo,
        }],
        //limit: 5,
        order: [['created_at', 'DESC']]
    }).then(result => {
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    });
}
// task 글읽기
function readTaskPro(blog_no, callback) {
    models.sequelize.Promise.all([
        models.blog.find({
            where: {
                blog_category: TASK,
                blog_no: blog_no
            },
            include: [{
                model: models.taskinfo
            }, { model: models.file }],
        }),
        models.task_submit.findAll({
            where: {
                blog_no: blog_no
            },
            attributes: ['task_submit_content', 'task_submit_score'],
            include: [{
                model: models.User
            }, {
                model: models.submit_file,
                where: {
                    submit_file_isdelete: '0'
                }
            }],

        })

    ]).spread((blogResult, taskResult) => {

        let result = { 'blogResult': blogResult, 'taskResult': taskResult }
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

function readTaskStu(user_no, blog_no, callback) {
    models.sequelize.Promise.all([
        models.blog.find({
            where: {
                blog_category: TASK,
                blog_no: blog_no
            },
            include: [{
                model: models.taskinfo
            }, {
                model: models.file,
                where: {
                    file_isdelete: '0'
                }
            }],
        }),
        models.task_submit.findOne({
            where: {
                blog_no: blog_no,
                user_no: user_no,
            },
            attributes: ['task_submit_no', 'task_submit_content', 'task_submit_score', 'created_at'],
            include: [{
                model: models.submit_file,
                where: {
                    submit_file_isdelete: '0'
                }
            }],
        })
    ]).spread((blogResult, taskResult) => {
        let result = { 'blogResult': blogResult, 'taskResult': taskResult }
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

function taskSubmit(body, blog_no, callback) {

    models.task_submit.create({
        task_submit_content: body.content,
        blog_no: blog_no,
        user_no: body.user_no
    }).then(result => {
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}


function taskSubmitFile(body, blog_no, files,lang, callback) {
    return models.sequelize.transaction(function (t) {
        return models.task_submit.create({
            task_submit_content: body.content,
            blog_no: blog_no,
            user_no: body.user_no
        }, { transaction: t })
            .then(result => {
                return models.submit_file.create({
                    submit_file_origin_name: files.originalname,
                    submit_file_save_name: files.filename,
                    submit_file_path: files.path,
                    submit_file_lang : lang,
                    task_submit_no: result.task_submit_no
                }, { transaction: t })
            })
    }).then(result => {
        return callback(null, result)
    }).catch(err => {
        return callback(err)
    })
}

function delTaskSubmit(submit_no, callback) {
    return models.sequelize.transaction(function (t) {
        return models.task_submit.destroy({
            where: {
                task_submit_no: submit_no
            }
        }, { transaction: t })
            .then(result => {
                models.submit_file.update({
                    submit_file_isdelete: '1'
                }, {
                        where: {
                            task_submit_no: submit_no
                        }
                    })
            }, { transaction: t })
    }).then(result => {
        callback(null, result)
    }).catch(err => {
        callback(err)
    })
}