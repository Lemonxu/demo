import Cookies from "js-cookie";

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus")
    },
    language: Cookies.get("language") || "en",
    theme: window.THEME_CONFIG.THEME || "default",
    account: localStorage.getItem("account") //存储用户帐户名
  },
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set("language", language);
    },

    /*设置用户账户名*/
    SET_ACCOUNT: (state, account) => {
      state.account = account;
    },
    GET_ACCOUNT: (state, account) => {
      if (!state.account) {

      }
    },
    SET_THEME: (state, theme) => {
      state.theme = theme;
      window.localStorage.setItem("theme", theme);
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit("TOGGLE_SIDEBAR");
    },
    setLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
    },
    setAccount({ commit }, account) {
      commit("SET_ACCOUNT", account);
    },
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    }
  }
};

export default app;
