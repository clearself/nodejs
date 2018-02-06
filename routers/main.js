var express = require('express');
var router = express.Router();
//用户模型
var User = require('../models/User');
//分类模型
var Category = require('../models/Category');
//内容模型
var Content = require('../models/Content');
router.get('/',function(req,res,next){
	var page = Number(req.query.page||1);	//当前页 需要客户端传递参数
	var limit = 2; //一页条数
	var totalPage = 0;
	Category.find().then(function(categories){
		Content.count().then(function(count){
			//保证获取数据总条数之后
			totalPage = Math.ceil(count/limit);
			page = Math.min(page,totalPage);
			page = Math.max(page,1);
			var skip = (page-1)*limit;
		
			Content.find().sort({_id:-1}).limit(limit).skip(skip).populate('category user').then(function(contentData){
				console.log(contentData)
				res.render('main/index',{
						userInfo:req.userInfo,
						categories:categories,
						contentData:contentData,
						page:page,
						totalPage:totalPage,
						limit:limit,
						count:count,
						urlname:'/'
					})
				})
		})
	})
})
module.exports = router;