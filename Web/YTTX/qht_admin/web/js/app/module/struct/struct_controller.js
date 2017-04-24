/*首页控制器*/
angular.module('app')
    .controller('StructController', ['structService','powerService','toolUtil','$scope',function(structService,powerService,toolUtil,$scope){
        var self=this;

        /*jquery dom缓存:主要是切换路由时，创建的dom缓存引用与现有的dom引用不一致，需要加载视图更新现有dom引用*/
        var jq_dom={
            $admin_struct_submenu:$('#admin_struct_submenu'),
            $admin_struct_list:$('#admin_struct_list'),
            $struct_setting_dialog:$('#struct_setting_dialog'),
            $struct_user_dialog:$('#struct_user_dialog'),
            $struct_userdetail_dialog:$('#struct_userdetail_dialog'),
            $admin_struct_reset:$('#admin_struct_reset'),
            $admin_user_reset:$('#admin_user_reset'),
            $admin_userdetail_show:$('#admin_userdetail_show'),
            $admin_page_wrap:$('#admin_page_wrap'),
            $admin_list_wrap:$('#admin_list_wrap'),
            $admin_batchlist_wrap:$('#admin_batchlist_wrap'),
            $admin_struct_checkcolumn:$('#admin_struct_checkcolumn'),
            $admin_struct_colgroup:$('#admin_struct_colgroup'),
            $admin_struct_checkall:$('#admin_struct_checkall')
        };
        /*切换路由时更新dom缓存*/
        structService.initJQDom(jq_dom);


        /*模型--表格缓存*/
        this.table={
            list1_page:{
            page:1,
            pageSize:10,
            total:0
        },
            list1_config:{
                $admin_list_wrap:self.$admin_list_wrap,
                $admin_page_wrap:self.$admin_page_wrap,
                hasdata:false,
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/organization/users'),
                        dataType:'JSON',
                        method:'post',
                        dataSrc:function ( json ) {
                            var code=parseInt(json.code,10),
                                message=json.message;

                            if(code!==0){
                                if(typeof message !=='undefined'&&message!==''){
                                    console.log(message);
                                }else{
                                    console.log('获取用户失败');
                                }
                                if(code===999){
                                    /*退出系统*/
                                    cache=null;
                                    toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });
                                }
                                list1_config.hasdata=false;
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                list1_config.hasdata=false;
                                /*重置分页*/
                                list1_page.total=0;
                                list1_page.page=1;
                                self.$admin_page_wrap.pagination({
                                    pageNumber:list1_page.page,
                                    pageSize:list1_page.pageSize,
                                    total:list1_page.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                list1_page.total=result.count;
                                /*分页调用*/
                                self.$admin_page_wrap.pagination({
                                    pageNumber:list1_page.page,
                                    pageSize:list1_page.pageSize,
                                    total:list1_page.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=list1_config.config.ajax.data;
                                        list1_page.page=pageNumber;
                                        list1_page.pageSize=pageSize;
                                        temp_param['page']=list1_page.page;
                                        temp_param['pageSize']=list1_page.pageSize;
                                        list1_config.config.ajax.data=temp_param;
                                        self.getColumnData();
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    list.length===0?list1_config.hasdata=false:list1_config.hasdata=true;
                                    return list;
                                }else{
                                    list1_config.hasdata=false;
                                    return [];
                                }
                            }else{
                                list1_config.hasdata=false;
                                /*重置分页*/
                                list1_page.total=0;
                                list1_page.page=1;
                                self.$admin_page_wrap.pagination({
                                    pageNumber:list1_page.page,
                                    pageSize:list1_page.pageSize,
                                    total:list1_page.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:list1_page.page,
                            pageSize:list1_page.pageSize
                        }
                    },
                    info:false,
                    dom:'<"g-d-hidei" s>',
                    searching:true,
                    order:[[1, "desc" ]],
                    columns: [
                        {
                            "data":"id",
                            "orderable" :false,
                            "searchable" :false,
                            "render":function(data, type, full, meta ){
                                return '<input value="'+data+'" name="check_userid" type="checkbox" />';
                            }
                        },
                        {
                            "data":"phone",
                            "render":function(data, type, full, meta ){
                                return toolUtil.phoneFormat(data);
                            }
                        },
                        {
                            "data":"address"
                        },
                        {
                            "data":"nickName"
                        },
                        {
                            "data":"machineCode"
                        },
                        {
                            "data":"identityState",
                            "render":function(data, type, full, meta ){
                                var stauts=parseInt(data,10),
                                    statusmap={
                                        0:"未验证",
                                        1:"正在验证",
                                        2:"验证通过",
                                        3:"验证不通过"
                                    },
                                    str='';

                                if(stauts===0){
                                    str='<div class="g-c-warn">'+statusmap[stauts]+'</div>';
                                }else if(stauts===1){
                                    str='<div class="g-c-gray9">'+statusmap[stauts]+'</div>';
                                }else if(stauts===2){
                                    str='<div class="g-c-blue1">'+statusmap[stauts]+'</div>';
                                }else if(stauts===3){
                                    str='<div class="g-c-red1">'+statusmap[stauts]+'</div>';
                                }else{
                                    str='<div class="g-c-gray6">其他</div>';
                                }
                                return str;
                            }
                        },
                        {
                            "data":"createTime"
                        },
                        {
                            "data":"status"
                        },
                        {
                            "data":"remark"
                        },
                        {
                            "data":"id",
                            "render":function(data, type, full, meta ){
                                var btns='',
                                    addUserId=full.addUserId,
                                    organizationId=full.organizationId;

                                /*查看用户*/
                                if(init_power.userdetail){
                                    btns+='<span data-action="detail" data-addUserId="'+addUserId+'" data-id="'+data+'"  data-organizationId="'+organizationId+'"  class="btn-operate">查看</span>';
                                }
                                /*编辑用户*/
                                if(init_power.userupdate){
                                    btns+='<span data-addUserId="'+addUserId+'"  data-action="update" data-id="'+data+'" data-organizationId="'+organizationId+'" class="btn-operate">编辑</span>';
                                }
                                /*删除用户*/
                                if(init_power.userdelete){
                                    btns+='<span data-addUserId="'+addUserId+'"  data-action="delete" data-id="'+data+'" data-organizationId="'+organizationId+'" class="btn-operate">删除</span>';
                                }
                                return btns;
                            }
                        }
                    ]
                }
            },
            list_table:null
        };


        /*配置文件*/
        var tablecolumn={
                init_len:10/*数据有多少列*/,
                ischeck:true,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_struct_checkcolumn/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap/*数据展现容器*/,
                hide_list:[4,5,6,7,8]/*需要隐藏的的列序号*/,
                column_api:{
                    isEmpty:function () {
                        return self.table.list1_config.hasdata;
                    }
                },
                $colgroup:jq_dom.$admin_struct_colgroup/*分组模型*/
            },/*全选*/
            tablecheckall={
                $bodywrap:jq_dom.$admin_batchlist_wrap,
                $checkall:jq_dom.$admin_struct_checkall
            },/*单项操作*/
            tableitemaction={
                $bodywrap:jq_dom.$admin_batchlist_wrap,
                itemaction_api:{
                    doItemAction:structService.doItemAction
                }
            };







        /*模型--tab选项卡*/
        this.tabitem=[{
            name:'运营架构',
            href:'struct',
            active:'tabactive'
        },{
            name:'角色',
            href:'role',
            active:''
        }];


        /*模型--虚拟挂载点*/
        this.root=structService.getRoot();

        /*模型--权限*/
        this.power={
            colgroup:'',
            thead:'',
            tbody:''
        };

        /*模型--操作权限列表*/
        this.powerlist=structService.getCurrentPower();
        
        /*模型--搜索*/
        this.search={
            searchactive:'',
            orgname:''
        };

        /*模型--编辑设置*/
        this.edit={
            editstate:false,
            id:'',
            layer:'',
            orgname:''
        };

        /*模型--调整位置*/
        this.structpos={
            up:{
                id:'',
                $node:null,
                active:'',
                layer:'',
                parentid:''
            },
            down:{
                id:'',
                $node:null,
                active:'',
                layer:'',
                parentid:''
            }
        };

        /*模型--机构设置*/
        this.setting={
            add_substruct_state:false,
            adjust_pos_state:false,
            id:'',/*父级id*/
            orgname:'',/*父级orgname*/
            c_id:'',/*当前id*/
            c_orgname:''/*当前orgname*/
        };

        /*模型--机构数据*/
        this.struct={
            type:'add'/*表单类型：新增，编辑；默认为新增*/,
            orgname:''/*机构名称*/,
            comname:''/*公司名称*/,
            linkman:''/*负责人*/,
            cellphone:''/*手机号码*/,
            address:''/*联系地址*/,
            operatingArea:''/*运营地区*/,
            remark:''/*备注*/,
            isSettingLogin:''/*是否设置登陆名及密码1 :是*/,
            username:''/*设置登录名*/,
            password:''/*设置登录密码*/,
            isDesignatedPermit:''/*是否指定权限,1:指定*/,
            checkedFunctionIds:''/*选中权限Ids*/,
            sysUserId:''/*编辑时相关参数*/,
            id:''/*编辑时相关参数*/,
            parentId:''/*编辑时相关参数*/
        };


        /*模型--用户*/
        this.user={
            type:'add'/*表单类型：新增，编辑；默认为新增*/,
            filter:''/*表格过滤关键词*/,
            id:''/*用户ID*/,
            nickName:''/*姓名*/,
            phone:''/*手机号码*/,
            address:''/*地址*/,
            mainFee:''/*费率*/,
            machineCode:''/*机器码*/,
            remark:''/*备注*/,
            roleId:''/*角色id*/
        };
        

        /*模型--菜单加载*/
        this.menuitem={
            prev:null,
            current:null
        };


        /*初始化加载，事件绑定*/
        if(this.root){
            /*初始化模型*/
            powerService.createThead({
                flag:true
            },this.power);

            this.setting.id=this.root.id;
            this.setting.orgname=this.root.orgname;

            /*搜索过滤*/
            this.searchAction=function (e) {
                var kcode=window.event?e.keyCode:e.which;

                if(self.search.orgname===''){
                    self.search.searchactive='';
                }else{
                    self.search.searchactive='search-content-active';
                }
                if(kcode===13){
                    structService.getMenuList({
                        search:self.search.orgname,
                        setting:self.setting,
                        type:'search'
                    });
                }
            };
            /*清空过滤条件*/
            this.searchClear=function () {
                self.search.orgname='';
                self.search.searchactive='';
            };


            /*初始化子菜单加载*/
            this.initSubMenu=function () {
                structService.getMenuList({
                    search:self.search.orgname,
                    setting:self.setting
                });
            };

            /*初始化数据表格列控制*/
            structService.initColumn(tablecolumn);

            /*初始化数据表格全选与取消全选*/
            structService.initCheckAll(tablecheckall);

            /*初始化数据表格单项操作*/
            structService.initItemAction(tableitemaction,self);


            /*子菜单展开*/
            this.toggleSubMenu=function (e) {
                e.preventDefault();
                e.stopPropagation();

                var target=e.target,
                    node=target.nodeName.toLowerCase();
                if(node==='ul'||node==='li'){
                    return false;
                }
                var $this=$(target),
                    haschild=$this.hasClass('sub-menu-title'),
                    $child,
                    isrequest=false,
                    temp_layer,
                    temp_id,
                    islayer;

                /*激活高亮*/
                if(self.menuitem.current===null){
                    self.menuitem.current=$this;
                }else{
                    self.menuitem.prev=self.menuitem.current;
                    self.menuitem.current=$this;
                    self.menuitem.prev.removeClass('sub-menuactive');
                }
                self.menuitem.current.addClass('sub-menuactive');

                /*变更模型*/
                temp_layer=$this.attr('data-layer');
                temp_id=$this.attr('data-id');
                self.edit.layer=temp_layer;
                self.edit.id=temp_id;
                self.edit.editstate=true;
                self.edit.orgname=$this.attr('data-label');

                /*查询子集*/
                if(haschild){
                    $child=$this.next();
                    if($child.hasClass('g-d-showi')){
                        /*隐藏*/
                        $child.removeClass('g-d-showi');
                        $this.removeClass('sub-menu-titleactive');
                        /*是否已经加载过数据*/
                        isrequest=$this.attr('data-isrequest');
                        if(isrequest){
                            /*清空隐藏节点数据*/
                            structService.initOperate({
                                data:'',
                                id:temp_id,
                                setting:self.setting,
                                table:self.table
                            });
                        }
                    }else{
                        /*显示*/
                        isrequest=$this.attr('data-isrequest');
                        if(isrequest==='false'){
                            /*重新加载*/
                            /*获取非根目录数据*/
                            structService.getMenuList({
                                search:self.search.orgname,
                                $reqstate:$this,
                                setting:self.setting
                            });
                        }else if(isrequest==='true'){
                            /*已加载的直接遍历存入操作区域*/
                            if(haschild){
                                var data=$child.find('>li >a'),
                                    list=[],
                                    len=data.size();
                                if(len!==0){
                                    /*有数据节点*/
                                    data.each(function () {
                                        var citem=$(this),
                                            orgname=citem.attr('data-label'),
                                            id=citem.attr('data-id');
                                        list.push({
                                            orgname:orgname,
                                            id:id
                                        });
                                    });
                                    structService.initOperate({
                                        data:list,
                                        layer:temp_layer,
                                        id:temp_id,
                                        setting:self.setting,
                                        table:self.table
                                    });
                                }else{
                                    /*无数据节点*/
                                    temp_layer=$this.attr('layer');
                                    islayer=structService.validSubMenuLayer(temp_layer);
                                    if(islayer){
                                        /*其他节点*/
                                        structService.initOperate({
                                            data:'',
                                            id:temp_id,
                                            setting:self.setting,
                                            table:self.table
                                        });
                                    }else{
                                        /*错误节点*/
                                        structService.initOperate({
                                            data:null,
                                            setting:self.setting,
                                            table:self.table
                                        });
                                    }
                                }
                            }
                        }
                        $child.addClass('g-d-showi');
                        $this.addClass('sub-menu-titleactive');
                    }
                }else{
                    /*没有子节点，同时节点层次未达到极限值*/
                    temp_layer=$this.attr('data-layer');
                    islayer=structService.validSubMenuLayer(temp_layer);
                    if(islayer){
                        /*其他节点*/
                        structService.initOperate({
                            data:'',
                            id:temp_id,
                            setting:self.setting,
                            table:self.table
                        });
                    }else{
                        /*错误节点*/
                        structService.initOperate({
                            data:null,
                            setting:self.setting,
                            table:self.table
                        });
                    }
                }


                setTimeout(function () {
                    console.log(self.setting);
                },100);
            };


            /*跳转到虚拟挂载点*/
            this.rootSubMenu=function (e) {
                var $this=$(e.target),
                    $child=$this.next();

                var data=$child.find('>li >a'),
                    list=[],
                    len=data.size();
                if(len!==0){
                    data.each(function () {
                        var citem=$(this),
                            orgname=citem.attr('data-label'),
                            id=citem.attr('data-id');
                        list.push({
                            orgname:orgname,
                            id:id
                        });
                    });
                    structService.initOperate({
                        data:list,
                        layer:0,
                        id:self.root.id,
                        orgname:self.root.orgname,
                        setting:self.setting,
                        table:self.table
                    });
                }

                /*清除高亮模型*/
                if(this.menuitem.prev!==null){
                    this.menuitem.prev.removeClass('sub-menuactive');
                    this.menuitem.prev=null;
                }
                if(this.menuitem.current!==null){
                    this.menuitem.current.removeClass('sub-menuactive');
                    this.menuitem.current=null;
                }

                /*更新编辑模型*/
                this.edit.editstate=false;
                this.edit.id=this.root.id;
                this.edit.layer=0;
                this.edit.orgname=this.root.orgname;
            };


            /*机构列表--展开*/
            this.toggleStructList=function (e) {
                e.preventDefault();

                var target=e.target,
                    node=target.nodeName.toLowerCase(),
                    isreload=true;
                if(node==='span'){
                    var $span=$(target),
                        $item=$span.parent(),
                        $ul,
                        haschild='',
                        isrequest=false;

                    /*数据状态*/
                    isreload=$item.hasClass('ts-reload');
                    if(isreload){
                        var id=$span.attr('data-id'),
                            layer=$item.attr('data-layer');
                        /*显示*/
                        isrequest=$span.attr('data-isrequest');
                        if(isrequest==='false'){
                            /*重新加载*/
                            $ul=$item.find('ul');
                            /*获取非根目录数据*/
                            structService.getOperateList({
                                search:self.search.orgname,
                                $reqstate:$span,
                                $li:$item,
                                layer:layer,
                                id:id,
                                $wrap:$ul,
                                table:self.table
                            });
                        }
                    }else{
                        haschild=$item.hasClass('ts-child');
                        if(haschild){
                            if($item.hasClass('ts-active')){
                                /*隐藏*/
                                $item.removeClass('ts-active');
                            }else{
                                /*显示*/
                                $item.addClass('ts-active');
                            }
                        }
                    }
                    return false;
                }else if(node==='li'){
                    var $li=$(target);
                    structService.setStructPos($li,self.structpos,self.setting);
                }
            };
            /*操作机构表单*/
            this.actionStruct=function (config) {
                if(config.type){
                    /*调用编辑机构服务类*/
                    structService.actionStruct({
                        modal:config,
                        setting:self.setting,
                        struct:self.struct,
                        power:self.power
                    });
                }
            };
            /*调整位置*/
            this.adjustStructPos=function () {
                structService.adjustStructPos(self.structpos,function () {
                    /*成功后，重新加载数据*/
                    self.initSubMenu();
                });
            };
            /*选择登录用户名和密码*/
            this.changeLogin=function () {
                /*设置登录名和密码*/
                self.struct.username='';
                self.struct.password='';
            };
            /*表单重置*/
            this.structReset=function (forms){
                /*重置表单模型*/
                structService.clearFormData(self.struct,'struct');
                /*重置权限信息*/
                this.clearSelectPower();
                /*重置验证提示信息*/
                structService.clearFormValid(forms);
            };
            /*提交表单*/
            this.structSubmit=function () {
                /*提交服务*/
                structService.structSubmit(self.struct,self.setting,self.search);

            };



            /*用户服务--操作用户表单*/
            this.actionUser=function (config) {
                if(config.type){
                    /*调用编辑机构服务类*/
                    structService.actionUser({
                        modal:config,
                        setting:self.setting,
                        user:self.user
                    });
                }
            };
            /*用户服务--过滤表格数据*/
            this.filterDataTable=function () {
              structService.filterDataTable(self.user);
            };
            /*用户服务--提交表单*/
            this.userSubmit=function () {
                /*提交服务*/
                structService.userSubmit(self.user,self.setting,self.table);

            };
            /*用户服务--重置表单*/
            this.userReset=function (forms){
                /*重置表单模型*/
                structService.clearFormData(self.user,'user');
                /*重置验证提示信息*/
                structService.clearFormValid(forms);
            };
            /*用户服务--批量删除*/
            this.batchDeleteUser=function () {
                structService.batchDeleteUser(self.setting);
            };



            /*弹出层显示隐藏*/
            this.toggleModal=function (config) {
                structService.toggleModal({
                    display:config.display,
                    area:config.area
                });
            };

            
            /*全选权限*/
            this.selectAllPower=function (e) {
                powerService.selectAllPower(e);
            };
            /*确定所选权限*/
            this.getSelectPower=function () {
                var temppower=powerService.getSelectPower();
                if(temppower){
                    this.struct.checkedFunctionIds=temppower.join();
                }else{
                   this.struct.checkedFunctionIds='';
                }
            };
            /*取消所选权限*/
            this.clearSelectPower=function () {
                self.struct.checkedFunctionIds='';
                powerService.clearSelectPower();
            };




        }




    }]);