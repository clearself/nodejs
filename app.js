/*
 * 应用程序的启动（入口）文件
 * */
//加载express模块
var express = require('express');


//加载模板处理模块
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
//创建App
var app = express();

//设置静态文件托管
app.use('/public',express.static(__dirname + '/public'));

var User = require('./models/User');

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
//在开发过程中 需要取消模板缓存
swig.setDefaults({cache:false});
//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));
//设置cookies
app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);
	//解析登录用户的cookies信息
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前登录用户信息是否为管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){
			next();
		}
	}else{
		next();
	}
	
})
/*
 * 根据不同的功能划分模块*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/myBlog',function(err){
	if(err){
		console.log('数据库连接失败')
	}else{
		console.log('数据库连接成功')
		//监听请求
		app.listen(8081)
	}
});

