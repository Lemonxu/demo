import {OrganizeAPI} from "./base";
import {XTP} from "../api";

Object.assign(OrganizeAPI, {
  getOrganizeCoding(params) {
    return new Promise((resolve) => {
      XTP.organize.getOrganizeCoding(params).then(({data, res}) => {
        resolve({ data, res });
      });
    });
  },
  listOrganize(params) {
    return new Promise((resolve) => {
      XTP.organize.listOrganize(params).then(({data, res}) => {
        let list = [];
        if (data.code === 1) {list = data.data.data;}
        list.map((element) => {
          element.isEdit = false;
          element.children = [];
          element.level = element.level + "";
        });
        resolve({ data, list, res });
      });
    });
  }
});

export {
  OrganizeAPI
};
