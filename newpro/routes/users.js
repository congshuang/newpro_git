var express = require('express');
var router = express.Router();
var userModel = require('../modols/UserModels');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.all('/login', function(req, res) {
    subflag = req.body['subflag'];
    if(subflag==undefined){
        res.render('login');
    }else{
        userModel.login(req,res);
    }
});
router.post('/zhuce', function(req, res) {
    subflag=req.body['subflag'];
    if(subflag!=undefined){
        userModel.zhuce(req,res);
    }else{
        res.send("表单提交错误");
    }
});
module.exports = router;
