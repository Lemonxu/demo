import { XTP } from "../../api";
import { Message } from "element-ui";

const MenuOperation = function() {
  return {
    id: 0,
    code: null,
    name: null,
    menuId: null,
    icon: null
  };
},
MenuOperationAPI = {
  menuOperation: new MenuOperation(),
  get: () => MenuOperationAPI.menuOperation,
  set: (value) => {
    MenuOperationAPI.menuOperation = Object.assign(MenuOperationAPI.menuOperation, value);
  },
  init: () => new MenuOperation(),
  getMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.getMenuOperation(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.listMenuOperation(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.insertMenuOperation(params).then(({data, res}) => {
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
  updateMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.updateMenuOperation(params).then(({data, res}) => {
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
  deleteMenuOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.deleteMenuOperation(params).then(({data, res}) => {
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

export { MenuOperationAPI };
