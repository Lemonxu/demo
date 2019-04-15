import { XTP } from "../../api";
import { Message } from "element-ui";

const Organize = function() {
  return {
    id: 0,
    appId: null,
    code: null,
    parentId: null,
    fullName: null,
    category: null,
    outerPhone: null,
    innerPhone: null,
    fax: null,
    postalcode: null,
    address: null,
    web: null,
    manager: null,
    assistantManager: null,
    innerOrganizeFlag: null,
    sort: null,
    description: null,
    enableFlag: null,
    createUserID: null,
    accountBook: null,
    level: null
  };
},
OrganizeAPI = {
  organize: new Organize(),
  get: () => OrganizeAPI.organize,
  set: (value) => {
    OrganizeAPI.organize = Object.assign(OrganizeAPI.organize, value);
  },
  init: () => new Organize(),
  getOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.getOrganize(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.listOrganize(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.insertOrganize(params).then(({data, res}) => {
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
  updateOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.updateOrganize(params).then(({data, res}) => {
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
  deleteOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.deleteOrganize(params).then(({data, res}) => {
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

export { OrganizeAPI };
