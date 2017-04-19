/*表格服务*/
'use strict';
angular.module('app')
	.service('dataTableColumnService',['dataTableCacheService','$sce',function (dataTableCacheService,$sce) {
		/*初始化配置*/
		var self=this,
			temp_cache=null,
			temp_init=null,
			temp_count=0;

		/*初始化*/
		this.initColumn=function (key,table,$scope) {
			/*检验数据合法性*/
			if(!table){
				return;
			}
			if(!$scope){
				return;
			}
			/*判断是否存在缓存*/
			if(dataTableCacheService.isKey(key)){
				
				/*重置临时数据*/
				temp_cache=null;

				/*如果不存在缓存则创建缓存*/
				if(!dataTableCacheService.isColumn(key)){
					/*初始化数据*/
					self.init(key,table,$scope);
				}
			}else{
				/*重新启动初始化,启动监听*/
				temp_init=setTimeout(function () {
					temp_count++;
					clearTimeout(temp_init);
					temp_init=null;
					/*设置时间限制，超过这个限制则停止初始化:6s*/
					if(temp_count<=120){
						self.initColumn(key,table,$scope);
					}
				},50);
			}
		};

		/*初始化配置*/
		this.init=function (key,table,$scope) {
			/*创建缓存*/
			var $column_wrap=$(table.column_wrap);

			/*复制临时缓存*/
			temp_cache={
				init_hidelist:table.hide_list.slice(0).sort(function (a,b) {
					return a - b;
				}),
				ischeck:table.ischeck,
				init_len:table.init_len,
				hide_len:table.hide_list.length,
				api:table.api,
				$column_wrap:$column_wrap,
				$bodywrap:$(table.bodywrap),
				$column_btn:$column_wrap.prev(),
				$column_ul:$column_wrap.find('ul')
			};

			/*初始化组件*/
			self.initWidget(key,table,$scope);
			/*绑定相关事件*/
			self.bind(key,table,$scope);
		};
		

		/*初始化组件*/
		this.initWidget=function (key,table,$scope) {
			/*隐藏*/
			var tempid,
				str='',
				i=0;

			temp_cache['tablecache']=dataTableCacheService.getTable(key);

			for(i;i<temp_cache.hide_len;i++){
				tempid=temp_cache.init_hidelist[i];
				str+='<li data-value="'+tempid+'">第'+(tempid + 1)+'列</li>';
				temp_cache.tablecache.column(tempid).visible(false);
			}
			if(str!==''){
				/*赋值控制下拉选项*/
				$(str).appendTo(temp_cache.$column_ul.html(''));
			}
			/*设置分组和表头模型*/
			/*更新模型*/
			$scope.$apply(function () {
				table.colgroup=$sce.trustAsHtml(self.createColgroup(temp_cache.hide_len));
			});
		};
		
		/*绑定相关事件*/
		this.bind=function (key,table,$scope) {
			/*绑定切换列控制按钮*/
			temp_cache.$column_btn.on('click',function () {
				temp_cache.$column_wrap.toggleClass('g-d-hidei');
			});
			/*绑定操作列数据*/
			temp_cache.$column_ul.on('click','li',function () {
				/*切换显示相关列*/
				var $this=$(this),
					active=$this.hasClass('action-list-active'),
					index=$this.attr('data-value');

				if(active){
					$this.removeClass('action-list-active');
					temp_cache.tablecache.column(index).visible(false);
				}else{
					$this.addClass('action-list-active');
					temp_cache.tablecache.column(index).visible(true);
				}

				var count=temp_cache.$column_ul.find('.action-list-active').size();

				/*更新模型*/
				$scope.$apply(function () {
					table.colgroup=$sce.trustAsHtml(self.createColgroup(temp_cache.hide_len - count));
				});
			});
			/*复制数据,并设置缓存*/
			dataTableCacheService.setKey(key,temp_cache,true);
		};

		/*重新生成分组*/
		this.createColgroup=function (glen) {
			var str='';
			/*部分隐藏*/
			var j=0,
				len,
				colitem,
				tempcol=0;

			if(temp_cache.ischeck){
				len=temp_cache.init_len - glen - 1;
				tempcol=45 % len;
				if(tempcol!==0){
					colitem=parseInt((45 - tempcol)/len,10);
				}else{
					colitem=parseInt(45/len,10);
				}
				/*解析分组*/
				if(colitem * len<=(45 - len)){
					colitem=len + 1;
				}
				/*设置主体值*/
				self.emptyColSpan(len + 1);
			}else{
				len=temp_cache.init_len - glen;
				tempcol=50 % len;
				if(tempcol!==0){
					colitem=parseInt((50 - tempcol)/len,10);
				}else{
					colitem=parseInt(50/len,10);
				}
				/*解析分组*/
				if(colitem * len<=(50 - len)){
					colitem=len + 1;
				}
				/*设置主体值*/
				self.emptyColSpan(len);
			}
			for(j;j<len;j++){
				str+='<col class="g-w-percent'+colitem+'" />';
			}
			return temp_cache.ischeck?'<col class="g-w-percent5" />'+str:str;
		};

		/*数据为空时判断主体合并值*/
		this.emptyColSpan=function (len) {
			var isdata=temp_cache.api.isEmpty();
			if(!isdata){
				temp_cache.$bodywrap.find('td').attr({
					'colspan':len
				});
			}
		};
	}]);
