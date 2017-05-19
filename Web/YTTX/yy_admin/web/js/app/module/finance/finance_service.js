angular.module('app')
    .service('financeService',['toolUtil','toolDialog','BASE_CONFIG','loginService','powerService','dataTableColumnService','dataTableItemActionService','$timeout',function(toolUtil,toolDialog,BASE_CONFIG,loginService,powerService,dataTableColumnService,dataTableItemActionService,$timeout){

        /*获取缓存数据*/
        var self=this,
            module_id=50/*模块id*/,
            cache=loginService.getCache();

        var powermap=powerService.getCurrentPower(module_id);

        /*初始化权限*/
        var init_power={
            profit_details:toolUtil.isPower('profit-details',powermap,true)/*分润明细*/,
            profit_clear:toolUtil.isPower('profit-clear',powermap,true)/*分润清算*/
        };


        /*扩展服务--初始化jquery dom节点*/
        this.initJQDom=function (dom) {
            if(dom){
                /*复制dom引用*/
                for(var i in dom){
                    self[i]=dom[i];
                }
            }
        };
        /*扩展服务--查询操作权限*/
        this.getCurrentPower=function () {
            return init_power;
        };
        /*扩展服务--根据条件判断视图状态:返回一个代表类型，数字或者字符*/
        this.changeView=function (record) {
            /*1-4种状态
            1:分润统计(默认为1)
            2:分润历史
            3:清算统计
            4:清算历史
            * */
            if(record.theme!=='' && record.tab!==''){
                if(record.theme==='profit'){
                    if(record.tab==='stats'){
                        record.action=1;
                        return 1;
                    }else if(record.tab==='history'){
                        record.action=2;
                        return 2;
                    }
                }else if(record.theme==='clear'){
                    if(record.tab==='stats'){
                        record.action=3;
                        return 3;
                    }else if(record.tab==='history'){
                        record.action=4;
                        return 4;
                    }
                }
            }
            record.action=1;
            return 1;
        };


        /*发货查询服务--请求数据--获取表格数据*/
        this.getColumnData=function (table,record){
            if(cache===null){
                return false;
            }else if(!table && !record){
                return false;
            }

            /*如果存在模型*/
            var temp_config='list_config'+record.action,
                data= $.extend(true,{},table[temp_config].config.ajax.data),
                temp_param;

            /*适配参数*/
            if(record['organizationId']===''){
                if(record['currentId']===''){
                    return false;
                }
                data['organizationId']=record['currentId'];
            }else{
                data['organizationId']=record['organizationId'];
            }
            if(record['searchWord']===''){
                delete data['searchWord'];
            }else{
                data['searchWord']=record['searchWord'];
            }
            if(record['type']===''){
                record['type']=1;
            }
            data['type']=record['type'];

            var temp_table='list_table'+record.action,
                temp_column='tablecolumn'+record.action,
                temp_action='tableitemaction'+record.action;

            /*参数赋值*/
            table[temp_config].config.ajax.data=data;
            if(table[temp_table]===null){
                temp_param=cache.loginMap.param;
                table[temp_config].config.ajax.data['adminId']=temp_param.adminId;
                table[temp_config].config.ajax.data['token']=temp_param.token;
                /*初始请求*/
                table[temp_table]=self['$admin_list_wrap'+record.action].DataTable(table[temp_config].config);
                /*调用列控制*/
                dataTableColumnService.initColumn(table[temp_column],table[temp_table]);
                /*调用按钮操作*/
                dataTableItemActionService.initItemAction(table[temp_action]);
            }else {
                table[temp_table].ajax.config(table[temp_config].config.ajax).load();
            }
        };
        /*发货查询服务--过滤表格数据*/
        this.filterDataTable=function (table,record) {
            if(!table && !record){
               return false;
            }
            var temp_table='list_table'+record.action;
            if(table[temp_table]===null){
                return false;
            }
            table[temp_table].search(record.filter).columns().draw();
        };
        /*发货查询服务--时间查询*/
        this.datePicker=function (record) {
            datePicker97Service.datePickerRange(record,{
                $node1:self.$search_startTime,
                $node2:self.$search_endTime,
                format:'%y-%M-%d',
                position:{
                    left:0,
                    top:2
                }
            });
        };
        /*发货查询服务--操作按钮*/
        this.doItemAction=function (mode,config) {
            var id=config.id,
                action=config.action;

            if(action==='detail'){
                self.queryDetail(id);
            }
        };
        /*发货查询服务--查询详情*/
        this.queryDetail=function (id) {
            if(cache===null){
                return false;
            }
            if(typeof id==='undefined'){
                return false;
            }

            var param=$.extend(true,{},cache.loginMap.param);
            /*判断参数*/
            param['id']=id;


            toolUtil
                .requestHttp({
                    url:'/device/delivery/view',
                    method:'post',
                    set:true,
                    data:param
                })
                .then(function(resp){
                        var data=resp.data,
                            status=parseInt(resp.status,10);

                        if(status===200){
                            var code=parseInt(data.code,10),
                                message=data.message;
                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('请求数据失败');
                                }

                                if(code===999){
                                    /*退出系统*/
                                    cache=null;
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                            }else{
                                /*加载数据*/
                                var result=data.result;
                                if(typeof result!=='undefined'){
                                    var delivery=result.delivery,
                                        deviceImeis=result.deviceImeis,
                                        str='',
                                        detail_map={
                                            'deviceType':'设备类型',
                                            'deliveryQuantity':'发货数量',
                                            'logistics':'物流',
                                            'consigneeName':'收货人',
                                            'deviceImeis':'设置机器码列表',
                                            'remark':'备注',
                                            'deviceImei':'机器码',
                                            'status':'状态'
                                        },
                                        statusmap={
                                            0:"<span class='g-c-gray6'>正常</span>",
                                            1:"<span class='g-c-gray12'>已用</span>"
                                        },
                                        typemap={
                                            1:"S67",
                                            2:"T6",
                                            3:"其他"
                                        };
                                    if(delivery){
                                        /*查看*/
                                        for(var j in delivery){
                                            if(typeof detail_map[j]!=='undefined'){
                                                if(j==='deviceType'){
                                                    var temptype=parseInt(delivery[j],10);
                                                    str+='<tr><td colspan="2" class="g-t-r">'+detail_map[j]+':</td><td colspan="3" class="g-t-l g-c-blue3">'+typemap[temptype]+'</td></tr>';
                                                }else if(j==='status'){
                                                    var tempstatus=parseInt(delivery[j],10);
                                                    str+='<tr><td colspan="2" class="g-t-r">'+detail_map[j]+':</td><td colspan="3" class="g-t-l">'+statusmap[tempstatus]+'</td></tr>';
                                                }else{
                                                    str+='<tr><td colspan="2" class="g-t-r">'+detail_map[j]+':</td><td colspan="3" class="g-t-l">'+delivery[j]+'</td></tr>';
                                                }
                                            }
                                        }
                                    }
                                    if(deviceImeis){
                                        var len=deviceImeis.length;
                                        if(len!==0){
                                            var i=0,
                                                tempimei;
                                            str+='<tr><th colspan="5" class="g-t-c">'+detail_map["deviceImeis"]+'</th></tr>';
                                            for(i;i<len;i++){
                                                tempimei=deviceImeis[i];
                                                str+='<tr><td class="g-t-r">'+(i + 1)+'</td><td class="g-t-r">'+detail_map["deviceImei"]+':</td><td class="g-t-l">'+tempimei["deviceImei"]+'</td><td class="g-t-r">'+detail_map["status"]+':</td><td class="g-t-l">'+statusmap[tempimei["status"]]+'</td></tr>';
                                            }
                                        }
                                    }
                                    if(str!==''){
                                        $(str).appendTo(self.$admin_senddetail_show.html(''));
                                        /*显示弹窗*/
                                        self.toggleModal({
                                            display:'show',
                                            area:'senddetail'
                                        });
                                    }
                                }
                            }
                        }
                    },
                    function(resp){
                        var message=resp.data.message;
                        if(typeof message !=='undefined'&&message!==''){
                            console.log(message);
                        }else{
                            console.log('查看发货失败');
                        }
                    });
        };

        /*弹出层服务*/
        this.toggleModal=function (config,fn) {
            var temp_timer=null,
                type_map={
                    'orderdetail':self.$admin_orderdetail_dialog
                };
            if(config.display==='show'){
                if(typeof config.delay!=='undefined'){
                    temp_timer=setTimeout(function () {
                        type_map[config.area].modal('show',{backdrop:'static'});
                        clearTimeout(temp_timer);
                        temp_timer=null;
                    },config.delay);
                    if(fn&&typeof fn==='function'){
                        fn.call(null);
                    }
                }else{
                    type_map[config.area].modal('show',{backdrop:'static'});
                    if(fn&&typeof fn==='function'){
                        fn.call(null);
                    }
                }
            }else if(config.display==='hide'){
                if(typeof config.delay!=='undefined'){
                    temp_timer=setTimeout(function () {
                        type_map[config.area].modal('hide');
                        clearTimeout(temp_timer);
                        temp_timer=null;
                    },config.delay);
                }else{
                    type_map[config.area].modal('hide');
                }
            }
        };



        /*导航服务--获取虚拟挂载点*/
        this.getRoot=function (record) {
            if(cache===null){
                toolUtil.loginTips({
                    clear:true,
                    reload:true
                });
                record['currentId']='';
                record['currentName']='';
                return false;
            }
            var islogin=loginService.isLogin(cache);
            if(islogin){
                var logininfo=cache.loginMap;
                record['currentId']=logininfo.param.organizationId;
                record['currentName']=logininfo.username;
            }else{
                /*退出系统*/
                cache=null;
                toolUtil.loginTips({
                    clear:true,
                    reload:true
                });
                record['currentId']='';
                record['currentName']='';
            }
        };
        /*导航服务--获取导航*/
        this.getSubMenu=function (config) {
            if(cache){
                var param=$.extend(true,{},cache.loginMap.param);
                param['isShowSelf']=0;
                var layer,
                    id,
                    $wrap;

                /*初始化加载*/
                if(!config.$reqstate){
                    layer=0;
                    /*根目录则获取新配置参数*/
                    id=param['organizationId'];
                    $wrap=self.$admin_finance_submenu;
                    var record=config.record;
                    record.organizationId=id;
                    record.organizationName=cache.loginMap.username;
                    if(config.table && config.table['list_table'+record.action]===null){
                        self.getColumnData(config.table,record);
                    }
                }else{
                    /*非根目录则获取新请求参数*/
                    layer=config.$reqstate.attr('data-layer');
                    $wrap=config.$reqstate.next();
                    id=config.$reqstate.attr('data-id');

                    /*判断是否是合法的节点*/
                    if(layer>=BASE_CONFIG.submenulimit){
                        return false;
                    }
                    param['organizationId']=id;
                }

                toolUtil
                    .requestHttp({
                        url:'/organization/lowers/search',
                        method:'post',
                        set:true,
                        data:param
                    })
                    .then(function(resp){
                            var data=resp.data,
                                status=parseInt(resp.status,10);

                            if(status===200){
                                var code=parseInt(data.code,10),
                                    message=data.message;
                                if(code!==0){
                                    if(typeof message !=='undefined'&&message!==''){
                                        console.log(message);
                                    }

                                    if(code===999){
                                        /*退出系统*/
                                        cache=null;
                                        toolUtil.loginTips({
                                            clear:true,
                                            reload:true
                                        });
                                    }
                                }else{
                                    /*加载数据*/
                                    var result=data.result;
                                    if(typeof result!=='undefined'){
                                        var list=result.list,
                                            str='';
                                        if(list){
                                            var len=list.length;
                                            if(len===0){
                                                $wrap.html('');
                                                /*清除显示下级菜单导航图标*/
                                                if(config.$reqstate){
                                                    config.$reqstate.attr({
                                                        'data-isrequest':true
                                                    }).removeClass('sub-menu-title sub-menu-titleactive');
                                                }
                                            }else{
                                                /*数据集合，最多嵌套层次*/
                                                str=self.resolveSubMenu(list,BASE_CONFIG.submenulimit,{
                                                    layer:layer,
                                                    id:id
                                                });
                                                if(str!==''){
                                                    $(str).appendTo($wrap.html(''));
                                                }
                                                if(layer!==0 && config.$reqstate){
                                                    config.$reqstate.attr({
                                                        'data-isrequest':true
                                                    });
                                                }
                                            }
                                        }else{
                                            $wrap.html('');
                                        }
                                    }else{
                                        if(layer===0){
                                            $wrap.html('');
                                        }
                                    }
                                }
                            }
                        },
                        function(resp){
                            var message=resp.data.message;
                            if(typeof message !=='undefined'&&message!==''){
                                console.log(message);
                            }else{
                                console.log('请求菜单失败');
                            }
                            $wrap.html('');
                        });
            }else{
                /*退出系统*/
                cache=null;
                toolUtil.loginTips({
                    clear:true,
                    reload:true
                });
            }
        };
        /*导航服务--解析导航--开始解析*/
        this.resolveSubMenu=function (obj,limit,config) {
            if(!obj||typeof obj==='undefined'){
                return false;
            }
            if(typeof limit==='undefined'||limit<=0){
                limit=1;
            }
            var menulist=obj,
                str='',
                i=0,
                len=menulist.length,
                layer=config.layer;

            layer++;

            if(limit>=1&&layer>limit){
                /*如果层级达到设置的极限清除相关*/
                return false;
            }

            if(len!==0){
                for(i;i<len;i++){
                    var curitem=menulist[i];
                    /*到达极限的前一项则不创建子菜单容器*/
                    if(limit>=1&&layer>=limit){
                        str+=self.doItemSubMenu(curitem,{
                                flag:false,
                                limit:limit,
                                layer:layer,
                                parentid:config.id
                            })+'</li>';
                    }else{
                        str+=self.doItemSubMenu(curitem,{
                                flag:true,
                                limit:limit,
                                layer:layer,
                                parentid:config.id
                            })+'<ul></ul></li>';
                    }
                }
                return str;
            }else{
                return false;
            }
        };
        /*导航服务--解析导航--公共解析*/
        this.doItemSubMenu=function (obj,config) {
            var curitem=obj,
                id=curitem["id"],
                label=curitem["fullName"],
                str='',
                flag=config.flag,
                layer=config.layer,
                parentid=config.parentid;

            if(flag){
                str='<li><a data-isrequest="false" data-parentid="'+parentid+'" data-layer="'+layer+'" data-id="'+id+'" class="sub-menu-title" href="#" title="">'+label+'</a>';
            }else{
                str='<li><a data-parentid="'+parentid+'" data-layer="'+layer+'" data-id="'+id+'" href="#" title="">'+label+'</a></li>';
            }
            return str;
        };
        /*导航服务--显示隐藏机构*/
        this.toggleSubMenu=function (e,config) {
            /*阻止冒泡和默认行为*/
            e.preventDefault();
            e.stopPropagation();

            /*过滤对象*/
            var target=e.target,
                node=target.nodeName.toLowerCase();
            if(node==='ul'||node==='li'){
                return false;
            }
            var $this=$(target),
                haschild,
                $child,
                isrequest=false,
                temp_id=$this.attr('data-id'),
                temp_label=$this.html();


            /*模型缓存*/
            var record=config.record;

            /*变更操作记录模型--激活高亮*/
            record.organizationId=temp_id;
            record.organizationName=temp_label;

            /*变更操作记录模型--激活高亮*/
            if(record.current===null){
                record.current=$this;
            }else{
                record.prev=record.current;
                record.current=$this;
                record.prev.removeClass('sub-menuactive');
            }
            record.current.addClass('sub-menuactive');

            self.getColumnData(config.table,config.record);

            /*查询子集*/
            haschild=$this.hasClass('sub-menu-title');
            if(haschild){
                $child=$this.next();
                /*是否已经加载过数据*/
                isrequest=$this.attr('data-isrequest');
                if(isrequest==='false'){
                    /*重新加载*/
                    config['$reqstate']=$this;
                    self.getSubMenu(config);
                    /*切换显示隐藏*/
                    if($child.hasClass('g-d-showi')){
                        $child.removeClass('g-d-showi');
                        $this.removeClass('sub-menu-titleactive');
                    }else{
                        $child.addClass('g-d-showi');
                        $this.addClass('sub-menu-titleactive');
                    }
                }else{
                    /*切换显示隐藏*/
                    if($child.hasClass('g-d-showi')){
                        $child.removeClass('g-d-showi');
                        $this.removeClass('sub-menu-titleactive');
                    }else{
                        $child.addClass('g-d-showi');
                        $this.addClass('sub-menu-titleactive');
                    }
                }
            }
        };


        /*测试服务--获取订单列表*/
        this.testGetOrderList=function () {
            return {
                message:'ok',
                code:0,
                result:Mock.mock({
                    'list|5-20':[{
                        "id":/[0-9]{1,2}/,
                        "merchantName":/(周一|杨二|张三|李四|王五|赵六|马七|朱八|陈九){1}/,
                        "merchantPhone":/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|170)[0-9]{8}$){1}/,
                        "orderTime":moment().format('YYYY-MM-DD HH:mm:ss'),
                        "orderNumber":/[0-9a-zA-Z]{18}/,
                        "orderState":/(0|1|6|9|20|21|[2-5]){1}/,
                        "totalMoney":/(^(([1-9]{1}\d{0,8})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$){1}/,
                        "paymentType":/[1-3]{1}/
                    }]
                })
            };
            /*return {
             status:200,
             data:{
             message:'ok',
             code:0,
             result:Mock.mock({
             'list|5-50':[{
             "id":/[0-9]{1,2}/,
             "merchantName":/[0-9a-zA-Z]{2,10}/,
             "merchantPhone":/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|170)[0-9]{8}$){1}/,
             "orderTime":moment().format('YYYY-MM-DD HH:mm:ss'),
             "orderNumber":/[0-9a-zA-Z]{18}/,
             "orderState":/[0|1|6|9|20|21|2-5]{1}/,
             "totalMoney":/(^(([1-9]{1}\d{0,8})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$){1}/,
             "paymentType":/[1-3]{1}/
             }]
             })
             }
             };*/
        };
        /*测试服务--获取订单列表*/
        this.testGetOrderDetail=function () {
            return {
                status:200,
                data:{
                    message:'ok',
                    code:0,
                    result:Mock.mock({
                        'order|1':[{
                            "id":/[0-9]{1,2}/,
                            "merchantName":/[0-9a-zA-Z]{2,10}/,
                            "merchantPhone":/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|170)[0-9]{8}$){1}/,
                            "orderTime":moment().format('YYYY-MM-DD HH:mm:ss'),
                            "orderNumber":/[0-9a-zA-Z]{18}/,
                            "orderState":/(0|1|6|9|20|21|[2-5]){1}/,
                            "totalMoney":/(^(([1-9]{1}\d{0,8})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$){1}/,
                            "paymentType":/[1-3]{1}/
                        }],
                        'details|1-10':[{
                            "id":/[0-9]{1,2}/,
                            "goodsName":/[0-9a-zA-Z]{2,10}/,
                            "goodsPrice":/(^(([1-9]{1}\d{0,8})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$){1}/,
                            "quantlity":/[0-9]{1,2}/
                        }]
                    })
                }
            };
        };


    }]);