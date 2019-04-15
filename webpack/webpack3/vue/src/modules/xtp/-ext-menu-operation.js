import {MenuOperationAPI} from "./base";
import {XTP} from "../api";

Object.assign(MenuOperationAPI, {
  listMenuAllOperation(params) {
    return new Promise((resolve) => {
      XTP.menuOperation.listMenuAllOperation(params).then(({res, data}) => {
        resolve({res, data});
      });
    });
  }
});

export {
  MenuOperationAPI
};
