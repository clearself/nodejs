var express = require('express');
var router = express.Router();
//用户模型
var User = require('../models/User');
//分类模型
var Category = require('../models/Category');
//内容模型
var Content = require('../models/Content');
router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('对不起，您不是管理员没有权限进入后台管理页面');
		return;
	}
	next();
})
router.get('/',function(req,res,next){
	res.render('admin/index',{
		userInfo:req.userInfo
	});
})
router.get('/user',function(req,res,next){
	//从数据库中读取所有管理员数据
	//数据分页 limit(number) 
	//skip()：忽略数据条数
	var page = Number(req.query.page||1);	//当前页 需要客户端传递参数
	var limit = 2; //一页条数
	var totalPage = 0;
	User.count().then(function(count){
		//保证获取数据总条数之后
		totalPage = Math.ceil(count/limit);
		page = Math.min(page,totalPage);
		page = Math.max(page,1);
		var skip = (page-1)*limit;
		User.find().limit(limit).skip(skip).then(function(userData){
			res.render('admin/user_index',{
				userData:userData,
				page:page,
				totalPage:totalPage,
				limit:limit,
				count:count,
				urlname:'user'
			});
		})
	})
})
/*
 * 分类首页
 * */
router.get('/category',function(req,res,next){
	//从数据库中读取所有管理员数据
	//数据分页 limit(number) 
	//skip()：忽略数据条数
	var page = Number(req.query.page||1);	//当前页 需要客户端传递参数
	var limit = 2; //一页条数
	var totalPage = 0;
	Category.count().then(function(count){
		//保证获取数据总条数之后
		totalPage = Math.ceil(count/limit);
		page = Math.min(page,totalPage);
		page = Math.max(page,1);
		var skip = (page-1)*limit;
		Category.find().limit(limit).skip(skip).then(function(categoryData){
			res.render('admin/category_index',{
				categoryData:categoryData,
				page:page,
				totalPage:totalPage,
				limit:limit,
				count:count,
				urlname:'category'
			});
		})
	})
})
//修改分类
router.get('/category/edit',function(req,res,next){
	var id = req.query.id||'';
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				message:'分类信息不存在'
			});
		}else{
			res.render('admin/category_edit',{
				category:category
			});
		}
		
	})
})

//修改分类后提交
router.post('/category/edit',function(req,res,next){
	var id = req.body.categoryid||'';
	var name = req.body.name||'';
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				message:'分类信息不存在'
			});
			return Promise().reject();
		}else{
			//判断用户有没有做修改
			
			if(name === category.name){
				res.render('admin/success',{
					message:'修改分类成功',
					url:'/admin//category'
				});
				return Promise().reject();
			}else{
				//如果存在需要验证修改后的名称是否已经在数据库中存在
				return Category.findOne({
						_id:{$ne:id},
						name:name
					})
			}
			
		}
		
	}).then(function(category){
		if(category){
			res.render('admin/error',{
				message:'该分类已存在'
			});
			return Promise().reject();
		}else{
			 return Category.update({
						_id:id
					},{
						name:name
				})
		}
	}).then(function(category){
			res.render('admin/success',{
				message:'修改分类成功',
				url:'/admin//category'
			});
	})
})
//删除分类
router.get('/category/delete',function(req,res,next){
	var id = req.query.id||'';
	Category.find({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/error',{
				message:'该分类已不存在'
			});
			return Promise().reject();
		}else{
			return Category.remove({
				_id:id
			})
		}
	}).then(function(){
		res.render('admin/success',{
			message:'删除分类成功',
			url:'/admin/category'
		});
	})
})


/*
 * 分类添加
 * */
router.get('/category/add',function(req,res,next){
	res.render('admin/add_category_index');
})

/*
 * 分类添加提交
 * */
router.post('/category/add',function(req,res,next){
	var name = req.body.name||'';
	if(name === ''){
		res.render('admin/error',{
			message:'分类名称不能为空'
		});
		return;
	}
	//验证数据库中是否已经有相同名称的分类
	
	Category.findOne({
		name:name
	}).then(function(nameInfo){
		if(nameInfo){
			res.render('admin/error',{
				message:'分类名称已存在'
			});
			return Promise().reject();
		}
		//用户名可用保存到数据库中
		var category = new Category({
			name:name
		});
		return category.save();
	}).then(function(nameInfo){
		res.render('admin/success',{
				message:'提交分类成功',
				url:'/admin/category'
		});
	})
})

/*
 
 * 内容首页
 * */
router.get('/content',function(req,res,nex){
	//从数据库中读取所有管理员数据
	//数据分页 limit(number) 
	//skip()：忽略数据条数
	var page = Number(req.query.page||1);	//当前页 需要客户端传递参数
	var limit = 2; //一页条数
	var totalPage = 0;
	Content.count().then(function(count){
		//保证获取数据总条数之后
		totalPage = Math.ceil(count/limit);
		page = Math.min(page,totalPage);
		page = Math.max(page,1);
		var skip = (page-1)*limit;
		Content.find().sort({_id:-1}).limit(limit).skip(skip).populate('category user').then(function(contentData){
			console.log(contentData)
			res.render('admin/content_index',{
				contentData:contentData,
				page:page,
				totalPage:totalPage,
				limit:limit,
				count:count,
				urlname:'content'
			});
		})
	})
})	
/*
 
 * 内容添加页面
 * */
router.get('/content/add',function(req,res,nex){
	Category.find().sort({_id:-1}).then(function(categories){
		if(!categories){
			res.render('admin/error',{
				message:'请先添加分类栏目再添加内容',
				url:'/category/add'
			});
			return Promise().reject();
		}
		res.render('admin/add_content_index',{
			userInfo:req.userinfo,
			categories:categories
		})
		
	})
	
})
////内容添加请求
router.post('/content/add',function(req,res,nex){
	var category = req.body.category;
	var title = req.body.title||'';
	var description = req.body.description||'';
	var content = req.body.content||'';
	if(category === ''){
		res.render('admin/error',{
			message:'请选择内容所属类型'
		});
		return;
	}
	if(title === ''){
		res.render('admin/error',{
			message:'请输入内容标题'
		});
		return;
	}
	if(description === ''){
		res.render('admin/error',{
			message:'请输入内容简介'
		});
		return;
	}
	if(content === ''){
		res.render('admin/error',{
			message:'请输入内容'
		});
		return;
	}
	//保存内容到数据库
	new Content({
		category:category,
		title:title,
		user:req.userInfo._id.toString(),
		description:description,
		content:content
	}).save().then(function(){
		res.render('admin/success',{
				userInfo:req.userInfo,
				message:'内容保存成功',
				url:'/admin/content'
		});
	})
})
//修改内容页面回显
router.get('/content/edit',function(req,res,next){
	var id = req.query.id||'';
	Category.find().then(function(categories){
		console.log(categories)
		Content.findOne({
			_id :id
		}).populate('category').then(function(content){
			console.log(content)
			if(!content){
				res.render('admin/error',{
					message:'内容信息不存在'
				});
			}else{
				res.render('admin/content_edit',{
					content:content,
					categories:categories
				});
			}
			
		})
	})
	
})



//修改内容后提交
router.post('/content/edit',function(req,res,next){
	var id = req.query.id||''
	var category = req.body.category||'';
	var title = req.body.title||'';
	var description = req.body.description||'';
	var content = req.body.content||'';
	if(category === ''){
		res.render('admin/error',{
			message:'请选择内容所属类型'
		});
		return;
	}
	if(title === ''){
		res.render('admin/error',{
			message:'请输入内容标题'
		});
		return;
	}
	if(description === ''){
		res.render('admin/error',{
			message:'请输入内容简介'
		});
		return;
	}
	if(content === ''){
		res.render('admin/error',{
			message:'请输入内容'
		});
		return;
	}
	Content.update({
				_id:id
			},{
				category:category,
				title:title,
				description:description,
				content:content
		}).then(function(content){
			res.render('admin/success',{
				message:'修改内容成功',
				url:'/admin/content/edit?id='+id
			});
		})

})
//删除内容页接口
router.get('/content/delete',function(req,res,next){
	var id = req.query.id||'';
	Content.remove({
				_id:id
			}).then(function(){
				res.render('admin/success',{
					message:'删除内容成功',
					url:'/admin/content'
				});
			})
		
})
module.exports = router;