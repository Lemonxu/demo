import {UserAPI} from "./base";
import {XTP} from "../api";

Object.assign(UserAPI, {
  updateUserPassword: (params, oldpwd) => new Promise((resolve) => {
     XTP.user.updateUserPassword(params, oldpwd).then(({res, data}) => {
       resolve({res, data});
     });
   }),
  updateUserResetPassword(params) {
    return new Promise((resolve) => {
      XTP.user.updateUserResetPassword(params).then(({res, data}) => {
        resolve({res, data});
      });
    });
  },
  listUser(params) {
    return new Promise((resolve) => {
      XTP.user.listUser(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        list.map((element) => {
          element.QQ = element.qq;
          element.roleIds = [];
        });
        resolve({ data, list, res });
      });
    });
  },
  loginUser(params) {
    return new Promise((resolve) => {
      XTP.user.loginUser(params).then(({data, res}) => {
        resolve({ data, res });
      });
    });
  }
});

export {
  UserAPI
};
