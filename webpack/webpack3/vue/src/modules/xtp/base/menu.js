import { XTP } from "../../api";
import { Message } from "element-ui";

const Menu = function() {
  return {
    id: 0,
    appId: null,
    code: null,
    name: null,
    uRL: null,
    type: null,
    parentId: null,
    icon: null,
    parentFlag: null,
    displayFlag: null,
    sort: null
  };
},
MenuAPI = {
  menu: new Menu(),
  get: () => MenuAPI.menu,
  set: (value) => {
    MenuAPI.menu = Object.assign(MenuAPI.menu, value);
  },
  init: () => new Menu(),
  getMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.getMenu(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.listMenu(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.insertMenu(params).then(({data, res}) => {
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
  updateMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.updateMenu(params).then(({data, res}) => {
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
  deleteMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.deleteMenu(params).then(({data, res}) => {
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

export { MenuAPI };
