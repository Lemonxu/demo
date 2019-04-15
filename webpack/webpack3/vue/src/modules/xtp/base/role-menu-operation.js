import { XTP } from "../../api";
import { Message } from "element-ui";

const RoleMenuOperation = function() {
  return {
    id: 0,
    roleId: null,
    menuOperationId: null,
    menuId: null,
    code: null
  };
},
RoleMenuOperationAPI = {
  roleMenuOperation: new RoleMenuOperation(),
  get: () => RoleMenuOperationAPI.roleMenuOperation,
  set: (value) => {
    RoleMenuOperationAPI.roleMenuOperation = Object.assign(RoleMenuOperationAPI.roleMenuOperation, value);
  },
  init: () => new RoleMenuOperation(),
  getRoleMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.getRoleMenuOperation(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listRoleMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.listRoleMenuOperation(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertRoleMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.insertRoleMenuOperation(params).then(({data, res}) => {
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
  updateRoleMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.updateRoleMenuOperation(params).then(({data, res}) => {
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
  deleteRoleMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.deleteRoleMenuOperation(params).then(({data, res}) => {
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

export { RoleMenuOperationAPI };
