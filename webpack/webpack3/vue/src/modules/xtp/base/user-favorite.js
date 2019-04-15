import { XTP } from "../../api";
import { Message } from "element-ui";

const UserFavorite = function() {
  return {
    id: 0,
    userId: null,
    menuId: null,
    type: null
  };
},
UserFavoriteAPI = {
  userFavorite: new UserFavorite(),
  get: () => UserFavoriteAPI.userFavorite,
  set: (value) => {
    UserFavoriteAPI.userFavorite = Object.assign(UserFavoriteAPI.userFavorite, value);
  },
  init: () => new UserFavorite(),
  getUserFavorite(params) {
    return new Promise((resolve) => {
      XTP.userFavorite.getUserFavorite(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listUserFavorite(params) {
    return new Promise((resolve) => {
      XTP.userFavorite.listUserFavorite(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertUserFavorite(params) {
    return new Promise((resolve) => {
      XTP.userFavorite.insertUserFavorite(params).then(({data, res}) => {
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
  updateUserFavorite(params) {
    return new Promise((resolve) => {
      XTP.userFavorite.updateUserFavorite(params).then(({data, res}) => {
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
  deleteUserFavorite(params) {
    return new Promise((resolve) => {
      XTP.userFavorite.deleteUserFavorite(params).then(({data, res}) => {
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

export { UserFavoriteAPI };
