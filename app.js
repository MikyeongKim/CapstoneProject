const express = require('express')
  , path = require('path')
  , bodyParser = require('body-parser')
  , static = require('serve-static')
  , session = require('express-session')
  , models = require("./models")
  , app = express()

const index = require("./routes/index")
  , editor = require("./routes/editor")
  , myinfo = require("./routes/myinfo")
  , community = require("./routes/community")
  , myclass = require("./routes/myclass")
  , reply = require("./routes/reply")

app.use(session({
  key: 'codit',
  secret: 'codit class',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 * 10
  }
}))


app.use(bodyParser.urlencoded({limit: '50mb', extended: false }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(static('public'))


app.set('port', process.env.PORT || '3000')
app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'ejs')

app.use('/', index)
app.use('/editor', editor)
app.use('/myinfo', myinfo)
app.use('/community', community)
app.use('/myclass', myclass)
app.use('/reply', reply)

app.use((req, res) => {
  res.status(404).send('<h2>Codit class 404 Page Not Found</h2>')
})

models.sequelize.sync().then(() => {
  console.log(" DB 연결 성공")
}).catch(err => {
  console.log("연결 실패")
  console.log(err)
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
})