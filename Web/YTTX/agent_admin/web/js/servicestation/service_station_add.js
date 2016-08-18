/*admin_member:成员设置*/
(function($){
	'use strict';
	$(function(){


		/*初始化数据*/
		if(public_tool.initMap.isrender){
			/*菜单调用*/
			var logininfo=public_tool.initMap.loginMap;
			public_tool.loadSideMenu(public_vars.$mainmenu,public_vars.$main_menu_wrap,{
				url:'http://120.24.226.70:8081/yttx-agentbms-api/module/menu',
				async:false,
				type:'post',
				param:{
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					token:decodeURIComponent(logininfo.param.token)
				},
				datatype:'json'
			});


			/*权限调用*/
			var powermap=public_tool.getPower(),
				stationdelete_power=public_tool.getKeyPower('删除',powermap),
				stationupdate_power=public_tool.getKeyPower('修改',powermap),
				stationdetail_power=public_tool.getKeyPower('查看',powermap),
				stationadd_power=public_tool.getKeyPower('添加',powermap);


			/*dom引用和相关变量定义*/
			var $station_wrap=$('#station_wrap')/*表格*/,
				module_id='station_add'/*模块id，主要用于本地存储传值*/,
				$data_wrap=$('#data_wrap')/*数据展现面板*/,
				$add_wrap=$('#add_wrap')/*发货容器面板*/,
				$update_wrap=$('#update_wrap')/*返修容器面板*/,
				table=null/*数据展现*/,
				$station_add_btn=$('#station_add_btn')/*添加*/,
				$add_title=$('#add_title')/*编辑标题*/,
				$update_title=$('#update_title')/*编辑标题*/,
				dia=dialog({
					title:'温馨提示',
					okValue:'确定',
					width:300,
					ok:function(){
						this.close();
						return false;
					},
					cancel:false
				})/*一般提示对象*/,
				dialogObj=public_tool.dialog()/*回调提示对象*/,
				$show_detail_wrap=$('#show_detail_wrap')/*详情容器*/,
				$show_detail_title=$('#show_detail_title')/*详情标题*/,
				$show_detail_content=$('#show_detail_content')/*详情内容*/,
				detail_map={
					fullName:'服务站全称',
					shortName:"服务站简称",
					name:"负责人姓名",
					phone:"负责人手机号码",
					address:"地址",
					sales:"销售",
					inventory:"库存",
					repairs:"返修",
					agentShortName:"所属代理",
					superShortName:"上级代理"
				}/*详情映射*/;



			/*查询对象*/
			var $search_shortName=$('#search_shortName'),
				$search_name=$('#search_name'),
				$search_phone=$('#search_phone'),
				$search_agentShortName=$('#search_agentShortName'),
				$search_superShortName=$('#search_superShortName'),
				$admin_search_btn=$('#admin_search_btn'),
				$admin_search_clear=$('#admin_search_clear');



			/*表单对象*/
			var add_form=document.getElementById('station_add_form')/*表单dom*/,
				update_form=document.getElementById('station_update_form')/*表单dom*/,
				$station_add_form=$(add_form)/*编辑表单*/,
				$station_update_form=$(update_form)/*编辑表单*/,
				$update_id=$('#update_id'),/*返修id*/
				$add_cance_btn=$('#add_cance_btn')/*编辑取消按钮*/,
				$update_cance_btn=$('#update_cance_btn')/*编辑取消按钮*/,
				$add_fullname=$('#add_fullname'),/*快递单号*/
				$add_shortname=$('#add_shortname'),
				$add_name=$('#add_name')/*发货经手人*/,
				$add_phone=$('#add_phone'),
				$add_tel=$('#add_tel')/*发货时间*/,
				$province=$('#province'),
				$city=$('#city'),
				$area=$('#area'),
				$province_value=$('#province_value'),
				$city_value=$('#city_value'),
				$area_value=$('#area_value'),
				$add_address=$('#add_address'),
				$add_agentid=$('#add_agentid'),
				$add_remark=$('#add_remark');


			/*分润设置*/
			var	$add_becomeagent=$('#add_becomeagent'),
				$add_agentwrap=$('#add_agentwrap'),
				$add_salescheck=$('#add_salescheck'),
				$add_saleswrap=$('#add_saleswrap'),
				$add_salessetting=$('#add_salessetting'),
				$add_salesprofit=$add_salessetting.find('input'),
				$add_salesself=$('#add_salesself'),
				$add_acqcheck=$('#add_acqcheck'),
				$add_acqwrap=$('#add_acqwrap'),
				$add_acqsetting=$('#add_acqsetting'),
				$add_acqprofit=$add_acqsetting.find('input'),
				$add_acqself=$('#add_acqself'),
				profit_data={};





			/*数据加载*/
			var station_config={
				url:"http://120.24.226.70:8081/yttx-agentbms-api/servicestations/related",
				dataType:'JSON',
				method:'post',
				dataSrc:function ( json ) {
					var code=parseInt(json.code,10);
					if(code!==0){
						if(code===999){
							/*清空缓存*/
							public_tool.clear();
							public_tool.loginTips();
						}
						console.log(json.message);
						return null;
					}
					return json.result.list;
				},
				data:{
					roleId:decodeURIComponent(logininfo.param.roleId),
					adminId:decodeURIComponent(logininfo.param.adminId),
					token:decodeURIComponent(logininfo.param.token)
				}
			};
			table=$station_wrap.DataTable({
				deferRender:true,/*是否延迟加载数据*/
				//serverSide:true,/*是否服务端处理*/
				searching:true,/*是否搜索*/
				ordering:false,/*是否排序*/
				//order:[[1,'asc']],/*默认排序*/
				paging:true,/*是否开启本地分页*/
				pagingType:'simple_numbers',/*分页按钮排列*/
				autoWidth:true,/*是否*/
				info:true,/*显示分页信息*/
				stateSave:false,/*是否保存重新加载的状态*/
				processing:true,/*大消耗操作时是否显示处理状态*/
				ajax:station_config,/*异步请求地址及相关配置*/
				columns: [
					{"data":"shortName"},
					{"data":"name"},
					{
						"data":"phone",
						"render":function(data, type, full, meta ){
							return public_tool.phoneFormat(data);
						}
					},
					{
						"data":"address",
						"render":function(data, type, full, meta ){
							return data.toString().slice(0,20)+'...';
						}
					},
					{
						"data":"agentShortName"
					},
					{
						"data":"supershortName"
					},
					{
						"data":"id",
						"render":function(data, type, full, meta ){
							var btns='';


							if(stationdetail_power){
								/*查看*/
								btns+='<span data-id="'+data+'" data-action="select" class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
									 <i class="fa-file-text-o"></i>\
									 <span>查看</span>\
									 </span>';
							}
							if(stationupdate_power){
								/*修改*/
								btns+='<span  data-id="'+data+'" data-action="update" class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
									<i class="fa-pencil"></i>\
									<span>修改</span>\
									</span>';
							}
							if(stationdelete_power){
								/*删除*/
								btns+='<span  data-id="'+data+'" data-action="delete" class="btn btn-white btn-icon btn-xs g-br2 g-c-gray8">\
									<i class="fa-trash"></i>\
									<span>删除</span>\
									</span>';
							}
							return btns;
						}
					}
				],/*控制分页数*/
				aLengthMenu: [
					[5,10,20,30],
					[5,10,20,30]
				],
				lengthChange:true/*是否可改变长度*/
			});




			/*
			 * 初始化
			 * */
			(function(){
				/*重置表单*/
				add_form.reset();
				update_form.reset();
				$admin_search_clear.trigger('click');
				/*地址调用*/
				new public_tool.areaSelect().areaSelect({
					$province:$province,
					$city:$city,
					$area:$area,
					$provinceinput:$province_value,
					$cityinput:$city_value,
					$areainput:$area_value
				});
			}());


			/*清空查询条件*/
			$admin_search_clear.on('click',function(){
				$.each([$search_shortName,$search_name,$search_phone,$search_agentShortName,$search_superShortName],function(){
					this.val('');
				});
			});


			/*联合查询*/
			$admin_search_btn.on('click',function(){
				var data= $.extend(true,{},station_config.data);

				$.each([$search_shortName,$search_name,$search_phone,$search_agentShortName,$search_superShortName],function(){
					var text=this.val(),
						selector=this.selector.slice(1),
						key=selector.split('_');



					if(text===""){
						if(typeof data[key[1]]!=='undefined'){
							delete data[key[1]];
						}
					}else{
						if(key[1].indexOf('phone')!==-1){
							text=text.replace(/\s*/g,'');
						}
						data[key[1]]=text;
					}

				});
				station_config.data= $.extend(true,{},data);
				table.ajax.config(station_config).load(false);
			});


			/*事件绑定*/
			/*绑定查看，修改操作*/
			$station_wrap.delegate('span','click',function(e){
				e.stopPropagation();
				e.preventDefault();

				var target= e.target,
					$this,
					id,
					action,
					$tr;

				//适配对象
				if(target.className.indexOf('btn')!==-1){
					$this=$(target);
				}else{
					$this=$(target).parent();
				}
				$tr=$this.closest('tr');
				id=$this.attr('data-id');
				action=$this.attr('data-action');

				/*修改操作*/
				if(action==='update'){

					/*调整布局*/
					$data_wrap.addClass('collapsed');
					$update_wrap.removeClass('collapsed');
					$add_wrap.addClass('collapsed');

					//重置信息
					add_form.reset();

					$("html,body").animate({scrollTop:380},200);
					//重置信息

					var datas=table.row($tr).data();
					for(var i in datas) {
						switch (i) {
							case "id":
								$update_id.val(id);
								break;
							case "nickName":
								$user_nickname.val(datas[i]);
								break;
							case "phone":
								$user_phone.val(datas[i]);
								break;
							case "machineCode":
								$user_machinecode.val(datas[i]);
								break;
							case "agentName":
								$user_agentname.val(datas[i]);
								break;
							case "serviceStationName":
								$user_servicestationname.val(datas[i]);
								break;
						}
					}
				}else if(action==='delete'){
					/*判断是否可以上下架*/
					dia.content('<span class="g-c-bs-warning g-btips-warn">目前暂未开放此功能</span>').show();
					setTimeout(function(){
						dia.close();
					},2000);
					return false;
				}else if(action==='select'){
					/*查看*/
					$.ajax({
							url:"http://120.24.226.70:8081/yttx-agentbms-api/servicestation/detail",
							method: 'POST',
							dataType: 'json',
							data:{
								"serviceStationId":id,
								"adminId":decodeURIComponent(logininfo.param.adminId),
								"token":decodeURIComponent(logininfo.param.token)
							}
						})
						.done(function(resp){
							var code=parseInt(resp.code,10);
							if(code!==0){
								/*回滚状态*/
								console.log(resp.message);
								return false;
							}
							/*是否是正确的返回数据*/
							var list=resp.result,
								str='',
								istitle=false;

							if(!$.isEmptyObject(list)){
								for(var j in list){
									if(typeof detail_map[j]!=='undefined'){
										if(j==='name'||j==='Name'){
											istitle=true;
											$show_detail_title.html(list[j]+'服务站详情信息');
										}else{
											str+='<tr><th>'+detail_map[j]+':</th><td>'+list[j]+'</td></tr>';
										}
									}
								};
								if(!istitle){
									$show_detail_title.html('服务站详情信息');
								}
								$show_detail_content.html(str);
								$show_detail_wrap.modal('show',{backdrop:'static'});
							}else{
								$show_detail_content.html('');
								$show_detail_title.html('');
							}

						})
						.fail(function(resp){
							console.log(resp.message);
						});
				}



			});



			/*添加服务站*/
			$station_add_btn.on('click',function(e){
				e.preventDefault();
				/*调整布局*/
				$data_wrap.addClass('collapsed');
				$update_wrap.addClass('collapsed');
				$add_wrap.removeClass('collapsed');
				$("html,body").animate({scrollTop:300},200);
				//重置信息
				update_form.reset();
				//第一行获取焦点
				//$user_nickname.focus();
			});
			if(stationadd_power){
				$station_add_btn.removeClass('g-d-hidei');
				$add_wrap.removeClass('g-d-hidei');
			};


			/*取消发货，返修*/
			$.each([$add_cance_btn,$update_cance_btn],function(){
				var selector=this.selector,
					issend=selector.indexOf('send')!==-1?true:false;

				this.on('click',function(e){
					/*调整布局*/
					if(issend){
						add_form.reset();
					}else{
						update_form.reset();
					}
					$data_wrap.removeClass('collapsed');
					$add_wrap.addClass('collapsed');
					$update_wrap.addClass('collapsed');
					if(!$data_wrap.hasClass('collapsed')){
						$("html,body").animate({scrollTop:200},200);
					}
				});

			});


			/*手机格式化*/
			/*格式化手机号码*/
			$.each([$search_phone,$add_phone],function(){
				this.on('keyup',function(){
					var phoneno=this.value.replace(/\D*/g,'');
					if(phoneno==''){
						this.value='';
						return false;
					}
					this.value=public_tool.phoneFormat(this.value);
				});
			});


			/*设置代理*/
			/*切换代理*/
			$add_becomeagent.on('click',function(){
				var $this=$(this),
					ischeck=$this.is(':checked'),
					name=$this.attr('name'),
					$radio=$add_agentwrap.find('input'),
					becomeagent=$this.val(),
					gradecheck=$radio.eq(0);

				if(ischeck){
					$add_agentwrap.removeClass('g-d-hidei');
					profit_data[name]=$this.val();
					gradecheck.prop({
						'checked':true
					});
					profit_data['grade']=gradecheck.val();
				}else{
					$add_agentwrap.addClass('g-d-hidei');
					$radio.each(function(){
						$(this).prop({
							'checked':false
						});
					});
					/*设置数据*/
					if(typeof profit_data[name]!=='undefined'){
						delete profit_data[name];
					}
					if(typeof profit_data['grade']!=='undefined'){
						delete profit_data[name];
					}
				}
			});
			/*选择代理*/
			$add_agentwrap.on('click','input',function(){
				profit_data['grade']=this.value;
			});


			/*设置分润*/
			$.each([$add_salescheck,$add_acqcheck],function(index){
				var selector=this.selector,
					issale=selector.indexOf('sales')!==-1?true:false,
					$radio=this.find('input');



				/*绑定设置显示隐藏和初始化*/
				$radio.each(function(){
					var $this=$(this),
						value=parseInt($this.val(),10);

					/*设置默认值为系统设置*//*初始化*/
					if(value===0){
						$this.prop({
							'checked':true
						});
						if(issale){
							profit_data['isCustomSalesProfit']=value;
						}else{
							profit_data['isCustomAcquiringProfit']=value;
						}
					}

					/*绑定事件*/
					$this.on('click',function(){
						if(value===1){
							/*自定义*/
							if(issale){
								$add_saleswrap.removeClass('g-d-hidei');
								$add_salessetting.addClass('need-valid');
								profit_data['isCustomSalesProfit']=value;
								/*设置了的三级分润默认值*/
								profit_data['distributorP1ForSales']='';
								profit_data['distributorP2ForSales']='';
								profit_data['distributorP3ForSales']='';

							}else{
								$add_acqwrap.removeClass('g-d-hidei');
								$add_acqsetting.addClass('need-valid');
								profit_data['isCustomAcquiringProfit']=value;
								/*设置了的三级分润默认值*/
								profit_data['distributorP1ForAcquiring']='';
								profit_data['distributorP2ForAcquiring']='';
								profit_data['distributorP3ForAcquiring']='';
							}
						}else if(value===0){
							/*系统默认*/
							if(issale){
								$add_saleswrap.addClass('g-d-hidei');
								$add_salessetting.removeClass('need-valid');
								profit_data['isCustomSalesProfit']=value;
								/*删除已经设置了的三级分润*/
								if(typeof profit_data['distributorP1ForSales']!=='undefined'){
									delete profit_data['distributorP1ForSales'];
								}
								if(typeof profit_data['distributorP2ForSales']!=='undefined'){
									delete profit_data['distributorP2ForSales'];
								}
								if(typeof profit_data['distributorP3ForSales']!=='undefined'){
									delete profit_data['distributorP3ForSales'];
								}
							}else{
								$add_acqwrap.addClass('g-d-hidei');
								$add_acqsetting.removeClass('need-valid');
								profit_data['isCustomAcquiringProfit']=value;
								/*删除已经设置了的三级分润*/
								if(typeof profit_data['distributorP1ForAcquiring']!=='undefined'){
									delete profit_data['distributorP1ForAcquiring'];
								}
								if(typeof profit_data['distributorP2ForAcquiring']!=='undefined'){
									delete profit_data['distributorP2ForAcquiring'];
								}
								if(typeof profit_data['distributorP3ForAcquiring']!=='undefined'){
									delete profit_data['distributorP3ForAcquiring'];
								}
							}
						}
					});
				});
			});


			/*绑定分润输入限制*/
			$.each([$add_salesprofit,$add_acqprofit],function(){
				this.each(function () {
					$(this).on('keyup',function(){
						var val=this.value.replace(/[^0-9*\-*^\.]/g,'');
						if(val.indexOf('.')!==-1){
							val=val.split('.');
							if(val.length>=3){
								val.length=2;
								val=val[0]+'.'+val[1];
							}else{
								val=val.join('.');
							}
						}
						this.value=val;
					});
				});
			});

			/*最小化窗口*/
			$.each([$add_title,$update_title], function () {
				var selector=this.selector,
					isadd=selector.indexOf('add')!==-1?true:false;

				this.next().on('click',function(e){
					if($data_wrap.hasClass('collapsed')){
						e.stopPropagation();
						e.preventDefault();
						isadd?$add_cance_btn.trigger('click'):$update_cance_btn.trigger('click');
					}
				});
			});



			/*表单验证*/
			if($.isFunction($.fn.validate)) {
				/*配置信息*/
				var form_opt0={},
					form_opt1={},
					formcache=public_tool.cache;

				if(formcache.form_opt_0 && formcache.form_opt_1){
					$.each([formcache.form_opt_0,formcache.form_opt_1], function (index) {
						var isadd=index===0?true:false;
						$.extend(true,(function () {
							return isadd?form_opt0:form_opt1;
						}()),(function () {
							return isadd?formcache.form_opt_0:formcache.form_opt_1;
						}()),{
							submitHandler: function(form){
								if(isadd){
									/*添加*/
									/*校验分润对象*/
									var isvalid1=false,
											isvalid2=false;

									if($add_salesself.is(':checked')){
										/*自定义*/
										isvalid1=validProfit($add_salesprofit,dia,profit_data,true);
									}else {
										isvalid1=true;
									}
									if($add_acqself.is(':checked')){
										isvalid2=validProfit($add_acqprofit,dia,profit_data,false);
									}else{
										isvalid2=true;
									}

									if(!isvalid1&&!isvalid2){
										return false;
									}

									var config={
										url:"http://120.24.226.70:8081/yttx-agentbms-api/servicestation/addupdate",
										dataType:'JSON',
										method:'post',
										data:{
											roleId:decodeURIComponent(logininfo.param.roleId),
											adminId:decodeURIComponent(logininfo.param.adminId),
											token:decodeURIComponent(logininfo.param.token),
											fullName:$add_fullname.val(),
											shortName:$add_shortname.val(),
											name:$add_name.val(),
											province:$province_value.val(),
											city:$city_value.val(),
											country:$area_value.val(),
											address:$add_address.val(),
											phone:$add_phone.val().replace(/\s*/g,''),
											tel:$add_tel.val(),
											agentId:$add_agentid.val(),
											Remark:$add_remark.val()
										}
									};

									console.log(config.data);
									$.extend(true,config.data,profit_data);
									console.log(profit_data);
									console.log(config.data);

								}else{
									/*更新*/
									var id=$update_id.val();
									if(!isadd&&id===''){
										$update_cance_btn.trigger('click');
										dia.content('<span class="g-c-bs-warning g-btips-warn">请选择需要操作的服务站</span>').show();
										setTimeout(function(){
											dia.close();
										},3000);
										return false;
									}
									var config={
										url:"http://120.24.226.70:8081/yttx-agentbms-api/servicestation/update",
										dataType:'JSON',
										method:'post',
										data:{
											serviceStationId:id,
											adminId:decodeURIComponent(logininfo.param.adminId),
											token:decodeURIComponent(logininfo.param.token)
										}
									};
								}


								$.ajax(config)
									.done(function(resp){
										var code=parseInt(resp.code,10);
										if(code!==0){
											console.log(resp.message);
											setTimeout(function(){
												isadd?dia.content('<span class="g-c-bs-warning g-btips-warn">添加服务站失败</span>').show():dia.content('<span class="g-c-bs-warning g-btips-warn">修改服务站失败</span>').show();
											},300);
											setTimeout(function () {
												dia.close();
											},2000);
											return false;
										}
										//重绘表格
										table.ajax.reload(null,false);
										//重置表单
										isadd?$add_cance_btn.trigger('click'):$update_cance_btn.trigger('click');
										setTimeout(function(){
											isadd?dia.content('<span class="g-c-bs-success g-btips-succ">添加服务站成功</span>').show():dia.content('<span class="g-c-bs-success g-btips-succ">修改服务站成功</span>').show();
										},300);
										setTimeout(function () {
											dia.close();
										},2000);
									})
									.fail(function(resp){
										console.log(resp.message);
									});
								return false;
							}
						});

					});
				}
				/*提交验证*/
				$station_add_form.validate(form_opt0);
				$station_update_form.validate(form_opt1);
			}
		}


		/*校验分润设置数据合法性*/
		function validProfit(input,dia,data,type){
			if(!input){
					return false;
			}

			if(!data){
				return false;
			}

			var isvalid=false,
				ele_a=input.eq(0).val(),
				ele_aa=input.eq(1).val(),
				ele_aaa=input.eq(2).val(),
				temp_a=parseInt(ele_a * 10000,10) / 10000,
				temp_aa=parseInt(ele_aa * 10000,10) / 10000,
				temp_aaa=parseInt(ele_aaa * 10000,10) / 10000;

			/*设置分润规则*/
			if(isNaN(temp_a)||isNaN(temp_aa)||isNaN(temp_aaa)){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置数据非法值</span>').show();
				isvalid=false;
				return isvalid;
			}
			if((temp_a===0||temp_a>=100)||(temp_aa===0||temp_aa>=100)||(temp_aaa===0||temp_aaa>=100)){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置数据不能大于100或为0</span>').show();
				isvalid=false;
				return isvalid;
			}else if((temp_a+temp_aa+temp_aaa)>100){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置总和不能大于100</span>').show();
				isvalid=false;
				return isvalid;
			}else if((temp_a+temp_aa+temp_aaa)<100){
				dia.content('<span class="g-c-bs-warning g-btips-warn">分润设置总和应为100</span>').show();
				isvalid=false;
				return isvalid;
			}

			/*校验*/
			isvalid=true;

			/*设置值*/
			if(type){
				data['distributorP1ForSales']=ele_a;
				data['distributorP2ForSales']=ele_aa;
				data['distributorP3ForSales']=ele_aa;
			}else{
				data['distributorP1ForAcquiring']=ele_a;
				data['distributorP2ForAcquiring']=ele_aa;
				data['distributorP3ForAcquiring']=ele_aaa;
			}

			return isvalid;
		}

	});



})(jQuery);