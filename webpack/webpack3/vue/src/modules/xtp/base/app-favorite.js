import { XTP } from "../../api";
import { Message } from "element-ui";

const AppFavorite = function() {
  return {
    id: 0,
    appId: null,
    menuId: null
  };
},
AppFavoriteAPI = {
  appFavorite: new AppFavorite(),
  get: () => AppFavoriteAPI.appFavorite,
  set: (value) => {
    AppFavoriteAPI.appFavorite = Object.assign(AppFavoriteAPI.appFavorite, value);
  },
  init: () => new AppFavorite(),
  getAppFavorite(params) {
    return new Promise((resolve) => {
      XTP.appFavorite.getAppFavorite(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listAppFavorite(params) {
    return new Promise((resolve) => {
      XTP.appFavorite.listAppFavorite(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertAppFavorite(params) {
    return new Promise((resolve) => {
      XTP.appFavorite.insertAppFavorite(params).then(({data, res}) => {
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
  updateAppFavorite(params) {
    return new Promise((resolve) => {
      XTP.appFavorite.updateAppFavorite(params).then(({data, res}) => {
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
  deleteAppFavorite(params) {
    return new Promise((resolve) => {
      XTP.appFavorite.deleteAppFavorite(params).then(({data, res}) => {
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

export { AppFavoriteAPI };
