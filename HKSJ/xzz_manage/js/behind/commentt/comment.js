var select; //选择行数据	
$(function() {
	tb = $('#div_table03').table({
		'class': 'table1',
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		events: {
			loaded: function() { // loaded事件,当数据加载成功后触发,这里更新的是分页信息
				$('#spanpage', tb).empty().html('第' + tb.currentpage() + '页/共' + tb.pagecount() + '页  共' + tb.total + "条数据");
				if (tb.currentpage() == 1) {
					$('#span_first', tb).addClass('First');
					$('#span_prev', tb).addClass('First');
				} else {
					$('#span_first', tb).removeClass('First');
					$('#span_prev', tb).removeClass('First');
				}
				if (tb.currentpage() == tb.pagecount()) {
					$('#span_first', tb).addClass('Last');
					$('#span_prev', tb).addClass('First');
				} else {
					$('#span_first', tb).removeClass('Last');
					$('#span_prev', tb).removeClass('First');
				}
				initTableLimit();
			}
		},
		rm: {
			evenclass: 'rowEven',
			oddclass: 'rowOdd',
			headclass: 'cssth'
		},
		//evenclass指定奇数行样式,oddclass指定偶数行样式,headclass指定表格头样式
		cm: [

		{
			dataindex: 'id',
			// 显示数据在行中的属性
			headtext: 'ID'
		}, {
			dataindex: 'commentContent',
			// 显示数据在行中的属性
			headtext: '评论内容'
		}, {
			dataindex: 'nickname',
			// 显示数据在行中的属性
			headtext: '评论人'
		}, {
			dataindex: 'commentTime',
			// 显示数据在行中的属性
			headtext: '评论时间',
			render:function(i,j,c,r){
		 		return getFormatDate(c); 
			}
		}, {
		 	dataindex:'askLeaveId',
		 	headtext:'操作',render:function(i,j,c,r){
		 		 return [
					$.jsonToControl(
					 {tag:'a',style:'cursor: pointer', child:{tag:'span',child:'删除'},events:{click:function(){
						 var data = confirm("确定要删除吗?");
						 if(data==true){
							 $.post('comment/commentDelete.do',{id:r.id},function(result){
							 		if(result==true){
							 			$.messager.alert("提示","删除成功","info");
							 			tb.load();
							 		}
							 		else{
							 			$.messager.alert("提示","删除失败","info");
							 			tb.load();
							 		}
							 });
						 }else{
							 tb.load();
						 }
						 return false;}}}
					 )
				] ;
			}
		}],
		url: 'comment/commentlist.do',
		autoload: true,
		total: 'totalCount',
		root: 'items',
		footbar: {
			tag: 'div',
			'class': 'pageBox pre',
			child: [ //{tag:'a','class':'excelDoload pab',title:'导出Excel',child:'Excel'},
			{
				tag: 'div',
				'class': 'pages',
				child: [{
					tag: 'span',
					child: '第1页/共0页',
					id: 'spanpage'
				}, {
					tag: 'span',
					'class': 'number',
					child: [{
						tag: 'span',
						id: 'span_first',
						'class': 'First Page',
						child: ' 首页 ',
						events: {
							click: function() {
								tb.firstpage();
							}
						}
					}, {
						tag: 'span',
						id: 'span_prev',
						'class': 'Prev  Page',
						child: '上页',
						events: {
							click: function() {
								tb.prevpage();
							}
						}
					}, {
						tag: 'span',
						id: 'span_next',
						'class': 'First Page',
						child: ' 下页 ',
						events: {
							click: function() {
								tb.nextpage();
							}
						}
					}, {
						tag: 'span',
						id: 'span_last',
						'class': 'First Page',
						child: '尾页 ',
						events: {
							click: function() {
								tb.lastpage();
							}
						}
					}]
				}, {
					tag: 'input',
					type: 'text',
					title: '请输入正确页数',
					'class': 'itext',
					id: 'pageInput2'
				}, {
					tag: 'span',
					'class': 'numAll',
					id: 'spanpagecount',
					child: '页'
				}, {
					tag: 'a',
					'class': 'ibutton',
					child: '跳转 ',
					events: {
						click: function() {
							var pn = tb.pagecount();
							if (isNaN($('#pageInput2').val()) || pn < $('#pageInput2').val()) {
								$.messager.alert("提示", '输入错误,最大只能输入' + pn, "info");
								$('#pageInput2').val("");
								return;
							}
							tb.gopage($('#pageInput2').val());
						}
					}
				}, '每页',
				{
					tag: 'select',
					child: [{
						tag: 'option',
						value: '10',
						child: '10'
					}, {
						tag: 'option',
						value: '20',
						child: '20'
					}, {
						tag: 'option',
						value: '30',
						child: '30'
					}, {
						tag: 'option',
						value: '40',
						child: '40'
					}],
					events: {
						change: function(e) {
							tb.load({
								start: 0,
								limit: $(e.target).val()
							});
						}
					}
				}, '条']
			}]
		}
	});
});

//查询
function query()
{
	tb.load({start:0,commentContent:$('#commentContent').val(),nickname:$("#nickname").val()});
}