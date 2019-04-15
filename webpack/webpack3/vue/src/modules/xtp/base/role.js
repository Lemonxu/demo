import { XTP } from "../../api";
import { Message } from "element-ui";

const Role = function() {
  return {
    id: 0,
    code: null,
    name: null,
    appId: null
  };
},
RoleAPI = {
  role: new Role(),
  get: () => RoleAPI.role,
  set: (value) => {
    RoleAPI.role = Object.assign(RoleAPI.role, value);
  },
  init: () => new Role(),
  getRole(params) {
    return new Promise((resolve) => {
      XTP.role.getRole(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listRole(params) {
    return new Promise((resolve) => {
      XTP.role.listRole(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertRole(params) {
    return new Promise((resolve) => {
      XTP.role.insertRole(params).then(({data, res}) => {
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
  updateRole(params) {
    return new Promise((resolve) => {
      XTP.role.updateRole(params).then(({data, res}) => {
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
  deleteRole(params) {
    return new Promise((resolve) => {
      XTP.role.deleteRole(params).then(({data, res}) => {
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

export { RoleAPI };
