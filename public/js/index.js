$(function(){
	var $loginBox = $('#loginBox');
	var $registerBox = $('#registerBox');
	var $userInfo = $('#userInfo');
	//切换到注册面板
	$loginBox.find('a.colMint').on('click',function(){
		console.log(1)
		$registerBox.show();
		$loginBox.hide();
	})
	//切换到登陆面板
	$registerBox.find('a.colMint').on('click',function(){
		$loginBox.show();
		$registerBox.hide();
	})
	//注册请求
	$registerBox.find('button').on('click',function(){
		//通过ajax提交请求
		var username = $registerBox.find('input[name=username]').val();
		var password = $registerBox.find('input[name=password]').val();
		var repassword = $registerBox.find('input[name=repassword]').val();
		$.ajax({
			type:'post',
			url:'api/user/register',
			data:{
				username:username,
				password:password,
				repassword:repassword
			},
			dataType:'json',
			success:function(data){
				$registerBox.find('.colWarning').html(data.message)
				if(!data.code){
					setTimeout(function(){
						$loginBox.show();
						$registerBox.hide();
					},500)
				}
			}
		})
	})
	//登录请求
	$loginBox.find('button').on('click',function(){
		//通过ajax提交请求
		var username = $loginBox.find('input[name=username]').val();
		var password = $loginBox.find('input[name=password]').val();
		$.ajax({
			type:'post',
			url:'api/user/login',
			data:{
				username:username,
				password:password
			},
			dataType:'json',
			success:function(data){
				$loginBox.find('.colWarning').html(data.message)
				if(!data.code){
					setTimeout(function(){
						$userInfo.find('.username').html(data.userInfo.username)
						window.location.reload();
					},500)
				}
			}
		})
	})
	//退出请求
	$userInfo.find('.logoutBtn').on('click',function(){
		//通过ajax提交请求
		
		$.ajax({
			type:'post',
			url:'api/user/logout',
			data:{},
			dataType:'json',
			success:function(data){
				if(!data.code){
					window.location.reload();
				}
			}
		})
	})
})
