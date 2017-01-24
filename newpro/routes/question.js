var express = require('express');
var router = express.Router();
var checkSession = require('../jsbean/CheckSession');
var questionModel = require('../modols/questionModel');
router.all('/ask', function(req, res) {

    loginbean = checkSession.check(req,res);
    if(!loginbean){
        return;
    }
    /*模块化session
     loginbean = req.session.loginbean;
     if(loginbean==undefined){
     res.send("<script>alert('登录过期,请重新登录');location.href='/';</script>");
     return;
     }
     */
    subflag = req.body['subflag'];
    if(subflag==undefined){
        res.render('ask', {loginbean: loginbean});
    }else{
        //发提问
        questionModel.ask(req,res);
    }
})

module.exports = router;