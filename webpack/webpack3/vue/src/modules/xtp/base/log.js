import { XTP } from "../../api";
import { Message } from "element-ui";

const Log = function() {
  return {
    id: 0,
    type: null,
    centent: null,
    userId: null,
    userName: null,
    iP: null
  };
},
LogAPI = {
  log: new Log(),
  get: () => LogAPI.log,
  set: (value) => {
    LogAPI.log = Object.assign(LogAPI.log, value);
  },
  init: () => new Log(),
  getLog(params) {
    return new Promise((resolve) => {
      XTP.log.getLog(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listLog(params) {
    return new Promise((resolve) => {
      XTP.log.listLog(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertLog(params) {
    return new Promise((resolve) => {
      XTP.log.insertLog(params).then(({data, res}) => {
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
  updateLog(params) {
    return new Promise((resolve) => {
      XTP.log.updateLog(params).then(({data, res}) => {
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
  deleteLog(params) {
    return new Promise((resolve) => {
      XTP.log.deleteLog(params).then(({data, res}) => {
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

export { LogAPI };
