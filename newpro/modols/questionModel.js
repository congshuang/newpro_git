/**
 * Created by 丛双 on 2017/1/20.
 */
var connPool = require("./ConnPool");
var async = require("async");
module.exports={
    ask:function(req,res){
        loginbean = req.session.loginbean;
        pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function(err,conn){
            var userAddSql = 'insert into question (typeid,title,content,uid,createtime) values(?,?,?,?,current_timestamp)';
            var param = [req.body['typeid'],req.body['title'],req.body['content'],loginbean.id];
            conn.query(userAddSql,param,function(err,rs){
                if(err){
                    //console.log('insert err:',err.message);
                    //res.send("数据库错误,错误原因:"+err.message);
                    return;
                }
                //res.send('提问成功');
                res.send('<script>alert("提问成功");location.href="../";</script>');
            })
            conn.release();
        });
    },
    queList:function(req,res,loginbean){

        pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function(err,conn)
        {
            if(err)
            {
                //console.log('insert err:',err.message);
                res.send("获取连接错误,错误原因:"+err.message);
                return;
            }
            page = 1;
            if(req.query['page']!=undefined){
                page = parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize = 2;
            pointStart = (page-1)*pageSize;
            count=0;
            countPage=0;
            var countSql = 'select count(*) as count from question';
            var listSql = 'select qid,title,looknum,renum,finished,updtime,createtime from question order by qid desc limit ?,?';
            var param = [pointStart,pageSize];

            async.series({
                one: function(callback){
                    conn.query(countSql,[],function(err,rs){
                        count=rs[0]["count"];
                        countPage = Math.ceil(count/pageSize);
                        if(page>countPage){
                            page=countPage;
                            pointStart = (page-1)*pageSize;
                            param = [pointStart,pageSize];
                        }
                        callback(null, rs);
                    })
                },
                two: function(callback){
                    conn.query(listSql,param,function(err,rs){
                        callback(null, rs);
                    })
                }
            },function(err, results) {
                //console.log(results);

                rs=results['two'];
                res.render('index', {loginbean:loginbean,page:page,rs:rs,count:count,countPage:countPage});
                //res.send('查完');
            });
            conn.release();
        });
    },


    }