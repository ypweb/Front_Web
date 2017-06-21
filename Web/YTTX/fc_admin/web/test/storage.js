var menu = {
    "cacheMap": {
        "menuload": true,
        "powerload": true
    },
    "routeMap": {
        "prev": "",
        "current": "",
        "setting": false
    },
    "moduleMap": {
        "0": {
            "id": 0,
            "code": "app",
            "name": "首页",
            "module": "app"
        },
        "10": {
            "id": 10,
            "code": "yttx-oragnization",
            "name": "机构",
            "module": "struct"
        },
        "30": {
            "id": 30,
            "code": "yttx-order-manager",
            "name": "订单管理",
            "module": "order"
        },
        "50": {
            "id": 50,
            "code": "yttx-finance-manager",
            "name": "财务管理",
            "module": "finance"
        },
        "70": {
            "id": 70,
            "code": "yttx-device-manager",
            "name": "设备管理",
            "module": "equipment"
        },
        "90": {
            "id": 90,
            "code": "yttx-setting",
            "name": "设置",
            "module": "setting"
        }
    },
    "menuMap": {
        "0": {
            "id": 0,
            "code": "app",
            "name": "首页",
            "href": "app",
            "module": "app"
        },
        "10": {
            "id": 10,
            "code": "yttx-oragnization",
            "name": "机构",
            "href": "struct",
            "module": "struct"
        },
        "30": {
            "id": 30,
            "code": "yttx-order-manager",
            "name": "订单管理",
            "href": "order",
            "module": "order"
        },
        "50": {
            "id": 50,
            "code": "yttx-finance-manager",
            "name": "财务管理",
            "href": "finance",
            "module": "finance"
        },
        "70": {
            "id": 70,
            "code": "yttx-device-manager",
            "name": "设备管理",
            "href": "equipment",
            "module": "equipment"
        },
        "90": {
            "id": 90,
            "code": "yttx-setting",
            "name": "设置",
            "href": "setting",
            "module": "setting",
            "sub": [
                {
                    "modClass": "yttx-pwd-update",
                    "modCode": "yttx-pwd-update",
                    "modId": 90,
                    "modLink": "yttx-pwd-update",
                    "modName": "更改密码"
                },
                {
                    "modClass": "yttx-setting-profit",
                    "modCode": "yttx-setting-profit",
                    "modId": 90,
                    "modLink": "yttx-setting-profit",
                    "modName": "分润设置"
                }
            ]
        }
    },
    "powerMap": {
        "0": {
            "id": 0,
            "code": "app",
            "name": "首页",
            "module": "app",
            "power": 0
        },
        "10": {
            "id": 10,
            "code": "yttx-oragnization",
            "name": "机构",
            "module": "struct",
            "power": [
                {
                    "funcCode": "yttx-organization-add",
                    "funcName": "添加子机构",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 1
                },
                {
                    "funcCode": "yttx-user-add",
                    "funcName": "添加用户",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 2
                },
                {
                    "funcCode": "yttx-user-view",
                    "funcName": "查看用户",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 3
                },
                {
                    "funcCode": "yttx-user-update",
                    "funcName": "修改用户",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 4
                },
                {
                    "funcCode": "yttx-member-add",
                    "funcName": "添加成员",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 5
                },
                {
                    "funcCode": "yttx-member-delete",
                    "funcName": "移除成员",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 6
                },
                {
                    "funcCode": "yttx-role-edit",
                    "funcName": "角色编辑",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 7
                },
                {
                    "funcCode": "yttx-role-add",
                    "funcName": "添加角色",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 8
                },
                {
                    "funcCode": "yttx-rolegroup-add",
                    "funcName": "添加角色组",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 9
                },
                {
                    "funcCode": "yttx-organization-edit",
                    "funcName": "机构编辑",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 10
                },
                {
                    "funcCode": "yttx-organization-delete",
                    "funcName": "删除机构",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 11
                },
                {
                    "funcCode": "yttx-operator-adjustment",
                    "funcName": "调整运营商",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 12
                },
                {
                    "funcCode": "yttx-batch-delete",
                    "funcName": "批量删除",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 13
                },
                {
                    "funcCode": "yttx-batch-ie",
                    "funcName": "批量导入/导出",
                    "isPermit": 1,
                    "modId": 10,
                    "prid": 14
                }
            ]
        },
        "30": {
            "id": 30,
            "code": "yttx-order-manager",
            "name": "订单管理",
            "module": "order",
            "power": [
                {
                    "funcCode": "yttx-order-print",
                    "funcName": "打印",
                    "isPermit": 1,
                    "modId": 30,
                    "prid": 17
                },
                {
                    "funcCode": "yttx-order-export",
                    "funcName": "导出",
                    "isPermit": 1,
                    "modId": 30,
                    "prid": 16
                },
                {
                    "funcCode": "yttx-order-details",
                    "funcName": "详情",
                    "isPermit": 1,
                    "modId": 30,
                    "prid": 15
                }
            ]
        },
        "50": {
            "id": 50,
            "code": "yttx-finance-manager",
            "name": "财务管理",
            "module": "finance",
            "power": [
                {
                    "funcCode": "yttx-profit-details",
                    "funcName": "分润明细",
                    "isPermit": 1,
                    "modId": 50,
                    "prid": 18
                },
                {
                    "funcCode": "yttx-profit-clear",
                    "funcName": "分润清算",
                    "isPermit": 1,
                    "modId": 50,
                    "prid": 19
                }
            ]
        },
        "70": {
            "id": 70,
            "code": "yttx-device-manager",
            "name": "设备管理",
            "module": "equipment",
            "power": [
                {
                    "funcCode": "yttx-device-add",
                    "funcName": "添加发货信息",
                    "isPermit": 1,
                    "modId": 70,
                    "prid": 20
                },
                {
                    "funcCode": "yttx-iemi-add",
                    "funcName": "手动添加IEMI",
                    "isPermit": 1,
                    "modId": 70,
                    "prid": 21
                },
                {
                    "funcCode": "yttx-delivery-add",
                    "funcName": "详情",
                    "isPermit": 1,
                    "modId": 70,
                    "prid": 22
                }
            ]
        },
        "90": {
            "id": 90,
            "code": "yttx-setting",
            "name": "设置",
            "module": "setting",
            "power": [
                {
                    "funcCode": "yttx-organization-info",
                    "funcName": "机构信息",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 23
                },
                {
                    "funcCode": "yttx-pwd-update",
                    "funcName": "更改密码",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 24
                },
                {
                    "funcCode": "yttx-child-add",
                    "funcName": "添加子管理",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 25
                },
                {
                    "funcCode": "yttx-child-edit",
                    "funcName": "编辑子管理",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 26
                },
                {
                    "funcCode": "yttx-child-delete",
                    "funcName": "删除子管理",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 27
                },
                {
                    "funcCode": "yttx-setting-profit",
                    "funcName": "分润设置",
                    "isPermit": 1,
                    "modId": 90,
                    "prid": 28
                }
            ]
        }
    },
    "loginMap": {
        "isLogin": true,
        "datetime": "2017-05-22|09:06:03",
        "reqdomain": "http://10.0.5.226:8882",
        "username": "admin",
        "param": {
            "adminId": "1",
            "token": "f356ae86-771f-491a-92f5-ce04c5c47535",
            "organizationId": "8"
        }
    },
    "settingMap": {}
}