import {MenuAPI} from "../../modules/xtp";

const sideBar = {
  state: {
    isCollapse: false,
    menuList: [],
    allMenuList: [],
    menuOperation: [],
    menuPageList: [],
    menuPageOperationList: []
  },
  mutations: {
    CHANGE_ISCOLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_MENULIST: (state, list) => {
      state.menuList = list;
    },
    SET_ALLMENULIST: (state, list) => {
      state.allMenuList = list;

    },
    GET_MENULIST: (state, {parentMenus, allMenus, menuPageList}) => {
      state.menuList = parentMenus;
      state.allMenuList = allMenus;
      state.menuPageList = menuPageList;
    },
    DEL_MENU_LIST: (state) => {
      state.menuList = [];
      state.allMenuList = [];
    },
    DEL_MENU_OPERATION: (state) => {
      state.menuOperation = [];
    }
  },
  actions: {
    changeIsCollapse({commit}) {
      commit("CHANGE_ISCOLLAPSE");
    },
    setMenuList({commit}, list) {
      commit("GET_MENULIST", list);
    },
    setAllMenuList({commit}, list) {
      commit("SET_ALLMENULIST", list);
    },

    /*获取菜单列表*/
    getMenuList({commit, state}, params) {
      return new Promise((resolve, reject) => {
        const pageList = [];
        // 将菜单调整为带有层级的菜单
        const setChildren = function(item, allMenuList) {
          const childrenList = [];
          allMenuList.map((allItem, allIndex) => {
            allItem.path = allItem.url;
            if (allItem.parentId === item.id) {
              if (allItem.displayFlag) {
                if (allItem.type === 2) {
                  pageList.push(allItem);
                } else {
                  childrenList.push(allItem);
                }
              }
            }
          });
          childrenList.sort(function (a, b) {
            return a.sort - b.sort;
          });
          item.children = childrenList;
          if (item.children.length > 0) {
            item.children.map((childItem, childIndex) => {
              setChildren(childItem, allMenuList);
            });
          }
        };

        /*如果不存在已经存在的菜单需要重新取数据库*/
        const menuList = state.menuList || JSON.parse(sessionStorage.getItem("menu-list")) || [], allMenuList = state.allMenuList || JSON.parse(sessionStorage.getItem("all-menu")) || [];
        if (menuList.length === 0) {
          MenuAPI.listMenuByUserId(params).then(({res}) => {
            const parentMenus = res.data.data.parentMenu;
            const allMenus = res.data.data.allMenu;
            parentMenus.map((item) => {
              item.path = item.url;
              setChildren(item, allMenus);
              if (item.displayFlag) {
                if (item.type === 2) {
                  pageList.push(item);
                }
              }
            });
            parentMenus.sort(function (a, b) {
              return a.sort - b.sort;
            });
            state.allMenuList = allMenus;
            state.menuList = parentMenus;
            state.menuPageList = pageList;
            sessionStorage.setItem("all-menu", JSON.stringify(allMenus));
            sessionStorage.setItem("menu-list", JSON.stringify(parentMenus));
            sessionStorage.setItem("page-list", JSON.stringify(pageList));
            console.log(pageList);
            commit("GET_MENULIST", {parentMenus, allMenus, menuPageList: pageList});
            resolve({parentMenus, allMenus});
          })
          .catch(() => {
            resolve({parentMenus: [], allMenus: []});
          });
        } else {
            resolve({parentMenus: menuList, allMenus: allMenuList});
        }
      });
    },
    delMenuList({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_MENU_LIST");
        resolve([...state.menuList, ...state.allMenuList]);
      });
    },
    delMenuOperation({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_MENU_OPERATION");
        resolve([...state.menuOperation]);
      });
    },

    /*获取菜单操作权限*/
    getMenuOperation({commit, state}, path) {
      //根据url获取相应的操作权限
      function operationsFun(allMenu, path) {
        let operations = "";
        const menuOperationCodes = [];
        const menuOperation = allMenu.find((menu) => menu.url === path);
        if (menuOperation) {
          menuOperation.operationList.map((op) => {
            menuOperationCodes.push(op.code);
          });
          operations = menuOperationCodes.join("|");
        }
        return operations;
      }
      return new Promise((resolve) => {
        const menuOperation = state.menuOperation || JSON.parse(sessionStorage.getItem("menu-operation")) || [];
        if (menuOperation.length === 0) {
          let allMenu = [];
          //如果不存在已经存在的操作权限需要重新去数据库
          MenuAPI.listMenuWithOperationByUserId().then(({res}) => {
            if (res.data.code === 1) {
              allMenu = res.data.data.allMenu;
            }
            state.menuOperation = allMenu;
            sessionStorage.setItem("menu-operation", JSON.stringify(allMenu));
            resolve({operation: operationsFun(allMenu, path)});
          });
        } else {
          resolve({operation: operationsFun(menuOperation, path)});
        }
      });
    }
  }
};

export default sideBar;
