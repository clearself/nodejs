var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	//关联字段-分类
	category:{
		//类型-分类的id
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Category'
	},
	//内容标题
	title: String,
	//关联字段 -用户
	user:{
		//类型-分类的id
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'User'
	},
	//文章创建时间
	addTime:{
		type:Date,
		default:new Date()
	},
	// 阅读数
	views:{
		type:Number,
		default:0
	},
	//简介
	description: {
		type:String,
		default:''
	},
	//内容
	content: {
		type:String,
		default:''
	}
})