import { XTP } from "../../api";
import { Message } from "element-ui";

const Menuoperation = function() {
  return {
    id: 0,
    code: null,
    name: null,
    menuId: null,
    icon: null
  };
},
MenuoperationAPI = {
  menuoperation: new Menuoperation(),
  get: () => MenuoperationAPI.menuoperation,
  set: (value) => {
    MenuoperationAPI.menuoperation = Object.assign(MenuoperationAPI.menuoperation, value);
  },
  init: () => new Menuoperation(),
  getMenuoperation(params) {
    return new Promise((resolve) => {
      XTP.menuoperation.getMenuoperation(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listMenuoperation(params) {
    return new Promise((resolve) => {
      XTP.menuoperation.listMenuoperation(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertMenuoperation(params) {
    return new Promise((resolve) => {
      XTP.menuoperation.insertMenuoperation(params).then(({data, res}) => {
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
  updateMenuoperation(params) {
    return new Promise((resolve) => {
      XTP.menuoperation.updateMenuoperation(params).then(({data, res}) => {
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
  deleteMenuoperation(params) {
    return new Promise((resolve) => {
      XTP.menuoperation.deleteMenuoperation(params).then(({data, res}) => {
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

export { MenuoperationAPI };
