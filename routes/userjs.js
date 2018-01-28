let database;

const init = (db) => {
    database = db;
}


const addUser = (id, password, grade, callback) => {
    console.log('addUser 호출됨.');

    database.getConnection( (err, conn) => {
        if(err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }

        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId);
        const data = { userid:id , userpassword:password , usergrade:grade};

        const exec = conn.query('insert into users set ?',data, function(err,result) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);

            if(err) {
                console.log('SQL실행 시 오류방생함.');
                console.dir(err);

                callback(err,null);
                return;
            }
            callback(null,result);
 
        });
    });
}


const authUser = (id,password, callback) => {
    console.log('authUser 호출됨.');

    database.getConnection( (err,conn) => {
        if(err) {
            if(conn) {
                conn.release();
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디' + conn.threadId);

        const columns = ['userid','userpassword'];
        const tablename = 'users';

        const exec = conn.query("select ?? from ?? where userid = ? and userpassword = ? "
        , [columns , tablename , id,password],function(err,result) {
            conn.release();
            console.log('실행 대상 SQL: ' + exec.sql);
            
            if(result.length > 0) {
                console.log("아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.",id,password);
                callback(null,result);
            } else {
                console.log("일치하는 사용자 찾지 못함.");
                callback(null,null);
            }
        });
    });
}

module.exports.addUser = addUser;
module.exports.authUser = authUser;
module.exports.init = init;
