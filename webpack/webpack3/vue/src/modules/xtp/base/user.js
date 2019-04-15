import { XTP } from "../../api";
import { Message } from "element-ui";

const User = function() {
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
UserAPI = {
  user: new User(),
  get: () => UserAPI.user,
  set: (value) => {
    UserAPI.user = Object.assign(UserAPI.user, value);
  },
  init: () => new User(),
  getUser(params) {
    return new Promise((resolve) => {
      XTP.user.getUser(params).then(({data, res}) => {
        let item = {};
        if (data.code === 1) {item = data.data;}
        resolve({ data, item, res });
        });
    });
  },
  listUser(params) {
    return new Promise((resolve) => {
      XTP.user.listUser(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        resolve({ data, list, res });
        });
    });
  },
  insertUser(params) {
    return new Promise((resolve) => {
      XTP.user.insertUser(params).then(({data, res}) => {
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
  updateUser(params) {
    return new Promise((resolve) => {
      XTP.user.updateUser(params).then(({data, res}) => {
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
  deleteUser(params) {
    return new Promise((resolve) => {
      XTP.user.deleteUser(params).then(({data, res}) => {
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

export { UserAPI };
