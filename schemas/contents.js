var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	//关联字段
	category:{
		//类型-分类的id
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Category'
	},
	//内容标题
	title: String,
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