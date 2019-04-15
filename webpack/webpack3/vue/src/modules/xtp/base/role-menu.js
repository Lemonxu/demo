import { XTP } from "../../api";
import { Message } from "element-ui";

const RoleMenu = function() {
  return {
    id: 0,
    roleId: null,
    menuId: null
  };
},
RoleMenuAPI = {
  roleMenu: new RoleMenu(),
  get: () => RoleMenuAPI.roleMenu,
  set: (value) => {
    RoleMenuAPI.roleMenu = Object.assign(RoleMenuAPI.roleMenu, value);
  },
  init: () => new RoleMenu(),
  getRoleMenu(params) {
    return new Promise((resolve) => {
      XTP.roleMenu.getRoleMenu(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listRoleMenu(params) {
    return new Promise((resolve) => {
      XTP.roleMenu.listRoleMenu(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertRoleMenu(params) {
    return new Promise((resolve) => {
      XTP.roleMenu.insertRoleMenu(params).then(({data, res}) => {
        if (data.code === 1) {
          Message({
            message: "新增成功",
            type: "success"
          });
        }
        resolve({data, res});
        });
    });
  },
  updateRoleMenu(params) {
    return new Promise((resolve) => {
      XTP.roleMenu.updateRoleMenu(params).then(({data, res}) => {
        if (data.code === 1) {
          Message({
            message: "修改成功",
            type: "success"
          });
        }
        resolve({data, res});
        });
    });
  },
  deleteRoleMenu(params) {
    return new Promise((resolve) => {
      XTP.roleMenu.deleteRoleMenu(params).then(({data, res}) => {
        if (data.code === 1) {
          Message({
            message: "删除成功",
            type: "success"
          });
        }
        resolve({data, res});
        });
    });
  }
};

export { RoleMenuAPI };
