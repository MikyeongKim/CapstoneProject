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



/*
function listAllBlog(req, res, path, category){
  const subject_no = req.params.id

  service.listAllBlog(subject_no, category, (err, result) => {
    if (err) {
      return res.send(`listAllNotice Error\n ${err}`)
    }
    return res.render(`professor/${path}/index`, { subject_no: subject_no, board: result })
  })
}

function readBlog(req, res, path){
  const subject_no = req.params.id;
  const blog_no = req.params.no;

  service.readBlog(subject_no, blog_no, (err, result) => {
    if (err) {
      return res.send(`readNotice error \n ${err}`)
    }
    return res.render(`professor/${path}/read`, { subject_no: subject_no , board: result})
  })
}

function createBlog(req, res, path, category){
  let subject_no = req.params.id;
  req.body.subject_no = subject_no
  req.body.user_no = req.session.userinfo[0]

  service.createBlog(req.body, category, (err, result) => {
    if (err) {
      return res.send(err)
    }
    return res.redirect(`/myclass/${subject_no}/${path}`)
  })
  //return res.render('professor/2notice/index' , {subject_no:subject_no})
}
*/