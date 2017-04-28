/*首页控制器*/
angular.module('app')
    .controller('StructroleController', ['structroleService','toolUtil',function(structroleService,toolUtil){
        var self=this;

        /*模型--操作权限列表*/
        this.powerlist=structroleService.getCurrentPower();


        /*jquery dom缓存:主要是切换路由时，创建的dom缓存引用与现有的dom引用不一致，需要加载视图更新现有dom引用*/
        var jq_dom={
            $admin_struct_submenu:$('#admin_struct_submenu'),
            $admin_rolegroup_dialog:$('#admin_rolegroup_dialog'),
            $admin_role_dialog:$('#admin_role_dialog'),
            $admin_member_dialog:$('#admin_member_dialog'),
            $admin_rolegroup_reset:$('#admin_rolegroup_reset'),
            $admin_role_reset:$('#admin_role_reset'),
            $admin_member_reset:$('#admin_member_reset'),
            $admin_table_checkcolumn:$('#admin_table_checkcolumn'),
            $admin_page_wrap:$('#admin_page_wrap'),
            $admin_list_wrap:$('#admin_list_wrap'),
            $admin_list_colgroup:$('#admin_list_colgroup'),
            $admin_batchlist_wrap:$('#admin_batchlist_wrap'),
            $admin_member_checkall:$('#admin_member_checkall'),
            $admin_member_menu:$('#admin_member_menu')
        };
        /*切换路由时更新dom缓存*/
        structroleService.initJQDom(jq_dom);

        /*模型--表格缓存*/
        this.table={
            list1_page:{
                page:1,
                pageSize:1,
                total:0
            },
            list1_config:{
                hasdata:false,
                config:{
                    processing:true,/*大消耗操作时是否显示处理状态*/
                    deferRender:true,/*是否延迟加载数据*/
                    autoWidth:true,/*是否*/
                    paging:false,
                    ajax:{
                        url:toolUtil.adaptReqUrl('/role/users'),
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
                                    /*toolUtil.loginTips({
                                        clear:true,
                                        reload:true
                                    });*/
                                }
                                self.table.list1_config.hasdata=false;
                                return [];
                            }
                            var result=json.result;
                            if(typeof result==='undefined'){
                                self.table.list1_config.hasdata=false;
                                /*重置分页*/
                                self.table.list1_page.total=0;
                                self.table.list1_page.page=1;
                                jq_dom.$admin_page_wrap.pagination({
                                    pageNumber:self.table.list1_page.page,
                                    pageSize:self.table.list1_page.pageSize,
                                    total:self.table.list1_page.total
                                });
                                return [];
                            }

                            if(result){
                                /*设置分页*/
                                self.table.list1_page.total=result.count;
                                /*分页调用*/
                                jq_dom.$admin_page_wrap.pagination({
                                    pageNumber:self.table.list1_page.page,
                                    pageSize:self.table.list1_page.pageSize,
                                    total:self.table.list1_page.total,
                                    onSelectPage:function(pageNumber,pageSize){
                                        /*再次查询*/
                                        var temp_param=self.table.list1_config.config.ajax.data;
                                        self.table.list1_page.page=pageNumber;
                                        self.table.list1_page.pageSize=pageSize;
                                        temp_param['page']=self.table.list1_page.page;
                                        temp_param['pageSize']=self.table.list1_page.pageSize;
                                        self.table.list1_config.config.ajax.data=temp_param;
                                        structroleService.getColumnData(self.table);
                                    }
                                });

                                var list=result.list;
                                if(list){
                                    list.length===0?self.table.list1_config.hasdata=false:self.table.list1_config.hasdata=true;
                                    return list;
                                }else{
                                    self.table.list1_config.hasdata=false;
                                    return [];
                                }
                            }else{
                                self.table.list1_config.hasdata=false;
                                /*重置分页*/
                                self.table.list1_page.total=0;
                                self.table.list1_page.page=1;
                                jq_dom.$admin_page_wrap.pagination({
                                    pageNumber:self.table.list1_page.page,
                                    pageSize:self.table.list1_page.pageSize,
                                    total:self.table.list1_page.total
                                });
                                return [];
                            }
                        },
                        data:{
                            page:1,
                            pageSize:1
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
                                return '<input value="'+data+'" name="check_memberid" type="checkbox" />';
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
                            "data":"mainFee"
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
                            "data":"remark"
                        }
                    ]
                }
            },
            list_table:null,
            /*列控制*/
            tablecolumn:{
                init_len:8/*数据有多少列*/,
                column_flag:true,
                ischeck:true,/*是否有全选*/
                columnshow:true,
                $column_wrap:jq_dom.$admin_table_checkcolumn/*控制列显示隐藏的容器*/,
                $bodywrap:jq_dom.$admin_batchlist_wrap/*数据展现容器*/,
                hide_list:[2,3,4,7]/*需要隐藏的的列序号*/,
                hide_len:4,
                column_api:{
                    isEmpty:function () {
                        return self.table.list1_config.hasdata;
                    }
                },
                $colgroup:jq_dom.$admin_list_colgroup/*分组模型*/,
                $column_btn:jq_dom.$admin_table_checkcolumn.prev(),
                $column_ul:jq_dom.$admin_table_checkcolumn.find('ul')
            },
            /*全选*/
            tablecheckall:{
                checkall_flag:true,
                $bodywrap:jq_dom.$admin_batchlist_wrap,
                $checkall:jq_dom.$admin_member_checkall,
                checkvalue:0/*默认未选中*/,
                checkid:[]/*默认索引数据为空*/,
                checkitem:[]/*默认node数据为空*/,
                highactive:'item-lightenbatch',
                checkactive:'admin-batchitem-checkactive'
            }
        };


        /*模型--操作记录*/
        this.record={
            layer:0/*当前菜单操作层级*/,
            prev:null/*菜单操作:上一次操作菜单*/,
            current:null/*菜单操作:当前操作菜单*/,
            searchactive:''/*搜索激活状态,激活态为：search-content-active，未激活为空，默认为空*/,
            searchname:''/*搜索关键词*/,
            role:''/*角色id*/,
            rolename:''/*角色名称*/,
            rolegroup:''/*角色组id*/,
            rolegroupname:''/*角色组名称*/
        };


        /*角色组*/
        this.rolegroup={
            id:'',
            type:'add',
            groupName:''
        };

        /*角色*/
        this.role={
            id:'',
            type:'add',
            filter:''/*过滤数据*/,
            roleName:''
        };


        /*模型--tab选项卡*/
        this.tabitem=[{
            name:'运营架构',
            href:'struct',
            power:self.powerlist.structadd,
            active:''
        },{
            name:'角色',
            href:'role',
            power:self.powerlist.roleadd,
            active:'tabactive'
        }];

        /*模型--btn按钮组*/
        this.btnitem=[{
            name:'添加角色组',
            type:'rolegroup',
            power:self.powerlist.rolegroupadd,
            icon:'fa-plus'
        },{
            name:'添加角色',
            type:'role',
            power:self.powerlist.roleadd,
            icon:'fa-plus'
        }];


        /*菜单服务--初始化*/
        this.initSubMenu=function () {
            structroleService.queryRoleGroup({
                record:self.record
            });
        };
        /*菜单服务--查询角色组*/
        this.queryRoleGroup=function () {
            structroleService.queryRoleGroup({
                record:self.record
            });
        };
        /*菜单服务--显示隐藏菜单*/
        this.toggleSubMenu=function (e) {
            structroleService.toggleSubMenu(e,{
                table:self.table,
                record:self.record
            });
        };


        /*角色服务--添加角色或角色组*/
        this.addRole=function (type) {
            structroleService.addRole({
                table:self.table,
                record:self.record,
                rolegroup:self.rolegroup,
                role:self.role
            },type);
        };
        /*角色服务--编辑角色或角色组*/
        this.editRole=function () {
            structroleService.editRole({
                table:self.table,
                record:self.record,
                rolegroup:self.rolegroup,
                role:self.role
            });
        };
        
        
        

        /*弹出层显示隐藏*/
        this.toggleModal=function (config) {
            structroleService.toggleModal(config);
        };


        /*表单服务--提交表单*/
        this.formSubmit=function (type) {
            structroleService.formSubmit({
                role:self.role,
                rolegroup:self.rolegroup,
                table:self.table,
                record:self.record
            },type);
        };
        /*表单服务--重置表单*/
        this.formReset=function (forms,type) {
            /*重置表单模型*/
            structroleService.formReset({
                forms:forms,
                role:self.role,
                rolegroup:self.rolegroup
            },type);
        };



        /*搜索服务--搜索过滤*/
        this.searchAction=function () {
            console.log('search');
        };
        /*搜索服务--清空过滤条件*/
        this.searchClear=function () {
            self.record.searchname='';
            self.record.searchactive='';
        };
        



    }]);