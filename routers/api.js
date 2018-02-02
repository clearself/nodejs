var express = require('express');
var router = express.Router();
var User = require('../models/User');
//统一返回格式
var responseData;
router.use(function(req,res,next){
	responseData = {
		code:0,
		message:''
	}
	next();
})
/*
 用户注册
 注册逻辑
 1、用户名不能为空
 2、密码不能为空
 3、两次输入密码必须一致
 4、用户是否已经祖册（数据库查询）
* */
router.post('/user/register',function(req,res,next){
	//通过res.body来获取post求情传的参数
	//console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;
	//用户名是否为空
	if(username === ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}
	//密码是否为空
	if(password === ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	//两次输入密码是否一致
	if(password !== repassword){
		responseData.code = 3;
		responseData.message = '两次输入密码不一致';
		res.json(responseData);
		return;
	}
	//用户名是否存在已经被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			//表示用户名已经存在
			responseData.code = 4;
			responseData.message = '该用户名已经被注册';
			res.json(responseData);
			return;
		}
		//用户名可用保存到数据库中
		var user = new User({
			username:username,
			password:password
		});
		return user.save()
	}).then(function(userInfo){
		responseData.message = '注册成功';
		res.json(responseData);
	})
	
})
router.post('/user/login',function(req , res, next){
	var username = req.body.username;
	var password = req.body.password;
	//用户名是否为空
	if(username === ''||password === ''){
		responseData.code = 1;
		responseData.message = '用户名或密码不能为空';
		res.json(responseData);
		return;
	}
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if(!userInfo){
			responseData.code = 2;
			responseData.message = '用户名或密码不正确';
			res.json(responseData);
			return;
		}
		responseData.message = '登陆成功';
		responseData.userInfo = {
			_id:userInfo._id,
			username:userInfo.username
		};
		console.log(typeof str_userInfo)
		req.cookies.set('userInfo', JSON.stringify({
			_id:userInfo._id,
			username:userInfo.username
		}));
		console.log('hrhrhr')
		res.json(responseData);
		return;
	})
	
})
router.post('/user/logout',function(req , res, next){
	req.cookies.set('userInfo',null);
	responseData.message = '退出成功';
	res.json(responseData);
	return;
})
module.exports = router;