import {MenuAPI} from "./base";
import {XTP} from "../api";
import {Message} from "element-ui";

Object.assign(MenuAPI, {
  listMenuWithChildren: (params) => new Promise((resolve) => {
      XTP.menu.listMenuWithChildren(params).then(({res, data}) => {
        let list = [];
        if (data.code === 1) {
          list = data.data.data;
        }
        resolve({data, res, list});
      });
    }),
  listMenu(params) {
    return new Promise((resolve) => {
      XTP.menu.listMenu(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        list.map((element) => {
          element.loading = false;
          element.children = [];
        });
        resolve({ data, list, res });
      });
    });
  },
  listMenuWithOperationByUserId(params) {
    return new Promise((resolve) => {
      XTP.menu.listMenuWithOperationByUserId(params).then(({data, res}) => {
        resolve({ data, res });
      });
    });
  },
  listMenuByUserId(params) {
    return new Promise((resolve) => {
      XTP.menu.listMenuByUserId(params).then(({data, res}) => {
        resolve({ data, res });
      });
    });
  },
  updateCopy(params) {
    return new Promise((resolve) => {
      XTP.menu.updateCopy(params).then(({data, res}) => {
        if (data.code === 1) {
          Message({
            message: "复制成功",
            type: "success"
          });
        }
        resolve({data, res});
      });
    });
  }
});

export {
  MenuAPI
};
