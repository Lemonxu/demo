import { XTP } from "../../api";
import { Message } from "element-ui";

const Ext = function() {
  return {
    id: 0,
    tableName: null,
    columnName: null,
    type: null
  };
},
ExtAPI = {
  ext: new Ext(),
  get: () => ExtAPI.ext,
  set: (value) => {
    ExtAPI.ext = Object.assign(ExtAPI.ext, value);
  },
  init: () => new Ext(),
  getExt(params) {
    return new Promise((resolve) => {
      XTP.ext.getExt(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listExt(params) {
    return new Promise((resolve) => {
      XTP.ext.listExt(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertExt(params) {
    return new Promise((resolve) => {
      XTP.ext.insertExt(params).then(({data, res}) => {
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
  updateExt(params) {
    return new Promise((resolve) => {
      XTP.ext.updateExt(params).then(({data, res}) => {
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
  deleteExt(params) {
    return new Promise((resolve) => {
      XTP.ext.deleteExt(params).then(({data, res}) => {
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

export { ExtAPI };
