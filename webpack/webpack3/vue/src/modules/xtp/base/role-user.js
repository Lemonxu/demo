import { XTP } from "../../api";
import { Message } from "element-ui";

const RoleUser = function() {
  return {
    id: 0,
    userId: null,
    roleId: null
  };
},
RoleUserAPI = {
  roleUser: new RoleUser(),
  get: () => RoleUserAPI.roleUser,
  set: (value) => {
    RoleUserAPI.roleUser = Object.assign(RoleUserAPI.roleUser, value);
  },
  init: () => new RoleUser(),
  getRoleUser(params) {
    return new Promise((resolve) => {
      XTP.roleUser.getRoleUser(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listRoleUser(params) {
    return new Promise((resolve) => {
      XTP.roleUser.listRoleUser(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertRoleUser(params) {
    return new Promise((resolve) => {
      XTP.roleUser.insertRoleUser(params).then(({data, res}) => {
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
  updateRoleUser(params) {
    return new Promise((resolve) => {
      XTP.roleUser.updateRoleUser(params).then(({data, res}) => {
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
  deleteRoleUser(params) {
    return new Promise((resolve) => {
      XTP.roleUser.deleteRoleUser(params).then(({data, res}) => {
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

export { RoleUserAPI };
