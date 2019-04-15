import { XTP } from "../../api";
import { Message } from "element-ui";

const RoleDataRule = function() {
  return {
    id: 0,
    roleId: null,
    value: null,
    symbol: null,
    menuId: null,
    fieldName: null
  };
},
RoleDataRuleAPI = {
  roleDataRule: new RoleDataRule(),
  get: () => RoleDataRuleAPI.roleDataRule,
  set: (value) => {
    RoleDataRuleAPI.roleDataRule = Object.assign(RoleDataRuleAPI.roleDataRule, value);
  },
  init: () => new RoleDataRule(),
  getRoleDataRule(params) {
    return new Promise((resolve) => {
      XTP.roleDataRule.getRoleDataRule(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listRoleDataRule(params) {
    return new Promise((resolve) => {
      XTP.roleDataRule.listRoleDataRule(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertRoleDataRule(params) {
    return new Promise((resolve) => {
      XTP.roleDataRule.insertRoleDataRule(params).then(({data, res}) => {
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
  updateRoleDataRule(params) {
    return new Promise((resolve) => {
      XTP.roleDataRule.updateRoleDataRule(params).then(({data, res}) => {
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
  deleteRoleDataRule(params) {
    return new Promise((resolve) => {
      XTP.roleDataRule.deleteRoleDataRule(params).then(({data, res}) => {
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

export { RoleDataRuleAPI };
