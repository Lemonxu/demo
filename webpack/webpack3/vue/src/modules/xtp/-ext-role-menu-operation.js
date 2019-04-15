import {RoleMenuOperationAPI} from "./base";
import {XTP} from "../api";

Object.assign(RoleMenuOperationAPI, {
  refreshPermissions() {
    return new Promise((resolve) => {
      XTP.roleMenuOperation.refreshPermissions().then(({res, data}) => {
        resolve({res, data});
      });
    });
  }
});

export {
  RoleMenuOperationAPI
};
