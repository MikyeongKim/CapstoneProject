var express = require('express')
    , http = require('http')
    , path = require('path')
    , bodyParser = require('body-parser')
    , static = require('serve-static')
    , mysql = require('mysql')
    , app = express()
    , router = express.Router()
    , expressErrorHandler = require('express-error-handler');

var user = require('./routes/userjs');
var config = require('./config/config');


var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: config.db_pw,
    database: 'codit',
    debug: false
});

user.init(pool);

app.set('port', process.env.PORT || config.server_port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(static('public'));

app.set('views', __dirname+'/views');
app.set('view engine', config.view_engine);

router.route('/').get(function(req,res) {
    res.render('index');
});
router.route('/login').get(function(req,res) {
    res.render('login');
});
router.route('/signup').get(function(req,res) {
    res.render('signup');
});

router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramgrade = req.body.usergrade || req.query.usergrade;

    if(pool) {
        user.addUser(paramId , paramPassword , paramgrade, function(err,adduser) {
            if(err) {
                console.error('사용자 추가 중 오류발생 : ' + err.stack);

                res.writeHead('200' , {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생<h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(adduser) {
                console.dir(adduser);
                console.log('inserted '+ adduser.affectedRows + 'rows');

                var insertId = adduser.insertId;

                res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

router.route('/process/login').post(function(req,res) {
    console.log('/process/login 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword);

    if(pool) {
        user.authUser(paramId , paramPassword , function(err, result) {
            if(err) {
                console.error('사용자 로그인 중 오류발생 : ' + err.stack);

                res.writeHead('200' , {'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 중 오류 발생<h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }

            if(result) {
                console.dir(result);

                res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 성공</h2>');
                res.write('<div><p>사용자 아이디:' + paramId + '</p></dev>');
                res.write('<div><p>사용자 비밀번호:' + paramPassword + '</p></dev>');
                res.end();
            } else {
                res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
                res.write('<h2>사용자 로그인 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200',{'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
})


app.use('/', router);

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.all('*', function (req, res) {
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

