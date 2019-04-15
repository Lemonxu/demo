import { XTP } from "../../api";
import { Message } from "element-ui";

const UserMenu = function() {
  return {
    id: 0,
    userId: null,
    menuId: null,
    type: null
  };
},
UserMenuAPI = {
  userMenu: new UserMenu(),
  get: () => UserMenuAPI.userMenu,
  set: (value) => {
    UserMenuAPI.userMenu = Object.assign(UserMenuAPI.userMenu, value);
  },
  init: () => new UserMenu(),
  getUserMenu(params) {
    return new Promise((resolve) => {
      XTP.userMenu.getUserMenu(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listUserMenu(params) {
    return new Promise((resolve) => {
      XTP.userMenu.listUserMenu(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertUserMenu(params) {
    return new Promise((resolve) => {
      XTP.userMenu.insertUserMenu(params).then(({data, res}) => {
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
  updateUserMenu(params) {
    return new Promise((resolve) => {
      XTP.userMenu.updateUserMenu(params).then(({data, res}) => {
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
  deleteUserMenu(params) {
    return new Promise((resolve) => {
      XTP.userMenu.deleteUserMenu(params).then(({data, res}) => {
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

export { UserMenuAPI };
