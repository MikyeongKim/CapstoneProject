const express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , static = require('serve-static')
  , app = express()
  , session = require('express-session');
const models = require("./models");

const index = require("./routes/index");
const editor = require("./routes/editor");
const myinfo = require("./routes/myinfo");
const community = require("./routes/community");
const myclass = require("./routes/myclass");

app.use(session({
  key: 'codit',
  secret: 'codit class',
  resave : false,
  saveUninitialized: true,
  cookie: {
    maxAge : 60 * 1000 * 10
  }
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(static('public'));


app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use('/',index);
app.use('/editor', editor);
app.use('/myinfo', myinfo);
app.use('/community', community);
app.use('/myclass', myclass);

models.sequelize.sync().then(() => {
  console.log(" DB 연결 성공")
}).catch(err => {
  console.log("연결 실패")
  console.log(err)
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});