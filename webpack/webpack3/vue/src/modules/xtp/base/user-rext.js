import { XTP } from "../../api";
import { Message } from "element-ui";

const UserRext = function() {
  return {
    id: 0,
    appUserId: null,
    appId: null,
    organizeId: null,
    organizeIdName: null,
    account: null,
    password: null,
    name: null,
    mail: null,
    phone: null,
    qQ: null,
    groupId: null,
    birth: null,
    educationId: null,
    departmentId: null,
    postId: null,
    quality: null,
    workTypeId: null
  };
},
UserRextAPI = {
  userRext: new UserRext(),
  get: () => UserRextAPI.userRext,
  set: (value) => {
    UserRextAPI.userRext = Object.assign(UserRextAPI.userRext, value);
  },
  init: () => new UserRext(),
  getUserRext(params) {
    return new Promise((resolve) => {
      XTP.userRext.getUserRext(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listUserRext(params) {
    return new Promise((resolve) => {
      XTP.userRext.listUserRext(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertUserRext(params) {
    return new Promise((resolve) => {
      XTP.userRext.insertUserRext(params).then(({data, res}) => {
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
  updateUserRext(params) {
    return new Promise((resolve) => {
      XTP.userRext.updateUserRext(params).then(({data, res}) => {
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
  deleteUserRext(params) {
    return new Promise((resolve) => {
      XTP.userRext.deleteUserRext(params).then(({data, res}) => {
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

export { UserRextAPI };
