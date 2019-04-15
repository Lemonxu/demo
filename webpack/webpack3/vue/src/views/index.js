import UserInfo from "./user-info/user-info.vue";
import User from "./user/user";
import App from "./app/app";
import Role from "./role/role";
import Menu from "./menu/menu";
import Organize from "./organize/organize";
import Model from "./model/model.vue";
import UserMenu from "./user-menu/user-menu";
//以下后续优化页面代码
import RoleDataRule from "./role-data-rule/role-data-rule";
import UserMenuOperation from "./user-menu-operation/user-menu-operation";
import UserButtonRule from "./user-button-rule/user-button-rule";

export const components = [
	{title: "个人信息设置", name: "UserInfo", component: UserInfo, path: "/userinfo" },
	{title: "用户管理", name: "User", component: User, path: "/user" },
	{title: "应用管理", name: "App", component: App, path: "/app" },
	{title: "角色管理", name: "Role", component: Role, path: "/role" },
	{title: "功能管理", name: "Menu", component: Menu, path: "/menu" },
	{title: "组织架构", name: "Organize", component: Organize, path: "/structure" },
	{title: "功能权限(角色)", name: "RoleDataRule", component: RoleDataRule, path: "/roledatarule" },
	{title: "模板", name: "Model4", component: Model, path: "/model/:modelName/:childModelName/:pageName" },
	{title: "模板", name: "Model3", component: Model, path: "/model/:modelName/:pageName" },
	{title: "模板", name: "Model2", component: Model, path: "/model/:modelName" },
	{title: "功能权限", name: "UserMenuOperation", component: UserMenuOperation, path: "/newmenuoperation" },
	{title: "用户功能管理", name: "UserMenu", component: UserMenu, path: "/usermenu2" },
	{title: "功能权限(用户)", name: "UserButtonRule", component: UserButtonRule, path: "/userbuttonrule" }
];
