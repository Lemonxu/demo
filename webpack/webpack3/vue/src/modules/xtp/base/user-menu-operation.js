import { XTP } from "../../api";
import { Message } from "element-ui";

const UserMenuOperation = function() {
  return {
    id: 0,
    userId: null,
    menuOperationId: null,
    code: null,
    type: null,
    menuId: null
  };
},
UserMenuOperationAPI = {
  userMenuOperation: new UserMenuOperation(),
  get: () => UserMenuOperationAPI.userMenuOperation,
  set: (value) => {
    UserMenuOperationAPI.userMenuOperation = Object.assign(UserMenuOperationAPI.userMenuOperation, value);
  },
  init: () => new UserMenuOperation(),
  getUserMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.userMenuOperation.getUserMenuOperation(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listUserMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.userMenuOperation.listUserMenuOperation(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertUserMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.userMenuOperation.insertUserMenuOperation(params).then(({data, res}) => {
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
  updateUserMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.userMenuOperation.updateUserMenuOperation(params).then(({data, res}) => {
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
  deleteUserMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.userMenuOperation.deleteUserMenuOperation(params).then(({data, res}) => {
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

export { UserMenuOperationAPI };
