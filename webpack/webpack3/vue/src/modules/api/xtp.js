import { _axios } from "./axios.config";
import { GetUrl, HttpRequest } from "./http-request";

const xtpUrl = GetUrl("XTP").url,
    XTP = HttpRequest(xtpUrl, [
      "organize", "user", "userMenuOperation", "menu", "app", "roleMenuOperation", "roleDataRule", "roleMenu", "roleUser", "role", "menuOperation", "userMenu", "menu"
    ]).api;

Object.assign(XTP.userMenu, {
  updateUserMenu: (params) => _axios.post(xtpUrl + "userMenu/updateUserMenu", params)
});

Object.assign(XTP.roleMenuOperation, {
  insertRoleMenuOperation: (params) => _axios.post(xtpUrl + "roleMenuOperation/insertRoleMenuOperation", params),
  refreshPermissions: (params) => _axios.post(xtpUrl + "shiro/refreshPermissions", params)
});

Object.assign(XTP.userMenuOperation, {
  insertUserMenuOperation: (params) => _axios.post(xtpUrl + "userMenuOperation/insertUserMenuOperation", params)
});

Object.assign(XTP.roleUser, {
  updateRoleUser: (params) => _axios.post(xtpUrl + "roleUser/updateRoleUser", params)
});

Object.assign(XTP.organize, {
  listOrganizeWithDetailsTree: (params) => _axios.post(xtpUrl + "organize/listOrganizeWithDetailsTree", params),
  getOrganizeCoding: (params) => _axios.post(xtpUrl + "organize/getOrganizeCoding", params)
});

Object.assign(XTP.user, {
  loginUser: (params) => _axios.post(xtpUrl + "user/loginUser", params),
  updateUserPassword: (params, oldpwd) => _axios.post(`${xtpUrl}user/updateUserPassword`, {data: JSON.stringify(params), password: oldpwd}),
  updateUserResetPassword: (params) => _axios.post(xtpUrl + "user/updateUserResetPassword", params)
});

Object.assign(XTP.menuOperation, {
  listMenuAllOperation: (params) =>
     _axios.post(`${xtpUrl}menuOperation/listMenuAllOperation`, params)//获取一个菜单设置的所有权限

});

Object.assign(XTP.menu, {
  listMenuByUserId: (params) => _axios.post(`${xtpUrl}menu/listMenuByUserId`, params),
  listMenuWithOperationByUserId: (params) => _axios.post(`${xtpUrl}menu/listMenuWithOperationByUserId.json`, params),
  checkExists: (params) => _axios.post(`${xtpUrl}menu/checkExists`, params),
  listMenu: (params) => _axios.post(`${xtpUrl}menu/listMenu`, params),
  listMenuWithChildren: (params) => _axios.post(`${xtpUrl}menu/listMenuWithChildren`, params),
  updateCopy: (params) => _axios.post(xtpUrl + "menu/updateCopy", params)
});

Object.assign(XTP.roleMenu, {
  updateRoleMenu: (params) => _axios.post(`${xtpUrl}roleMenu/updateRoleMenu.json`, params)
});

XTP.organize.listOrganizeTree = (params) => _axios.post(xtpUrl + "organize/listOrganizeTree", params);

XTP.user.loginUser = (params) => _axios.post(xtpUrl + "user/loginUser", params);

export {
    XTP
};
