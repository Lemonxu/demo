import { XTP } from "../../api";
import { Message } from "element-ui";

const App = function() {
  return {
    id: 0,
    code: null,
    name: null,
    token: null
  };
},
AppAPI = {
  app: new App(),
  get: () => AppAPI.app,
  set: (value) => {
    AppAPI.app = Object.assign(AppAPI.app, value);
  },
  init: () => new App(),
  getApp(params) {
    return new Promise((resolve) => {
      XTP.app.getApp(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listApp(params) {
    return new Promise((resolve) => {
      XTP.app.listApp(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertApp(params) {
    return new Promise((resolve) => {
      XTP.app.insertApp(params).then(({data, res}) => {
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
  updateApp(params) {
    return new Promise((resolve) => {
      XTP.app.updateApp(params).then(({data, res}) => {
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
  deleteApp(params) {
    return new Promise((resolve) => {
      XTP.app.deleteApp(params).then(({data, res}) => {
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

export { AppAPI };
