const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const static = require('serve-static');
const session = require('express-session');
const models = require('./models');
const app = express();

app.use(
  session({
    key: 'codit',
    secret: 'codit class',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 10
    }
  })
);

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(static('public'));

app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/editor', require('./routes/editor'));
app.use('/myinfo', require('./routes/myinfo'));
app.use('/community', require('./routes/community'));
app.use('/myclass', require('./routes/myclass'));
app.use('/reply', require('./routes/reply'));
app.use('/file', require('./routes/file'));
app.use('/download', require('./routes/download'));

app.use((req, res) => {
  res.status(404).send('<h2>Codit class 404 Page Not Found</h2>');
});

models.sequelize
  .sync()
  .then(() => {
    console.log(' DB 연결 성공');
  })
  .catch(err => {
    console.log('연결 실패');
    console.log(err);
  });

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
