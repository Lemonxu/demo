
//登录传参信息
window.TOKEN_KEY = "app-token";

window.THEME_CONFIG = {
  THEME: "default", //系统主题选择
  SYSTEM_NAME: "XTP通用管理系统", //系统大标题
  SUB_NAME: "后台登录", //系统小标题
  NAV_BAR_NAME: "XTP通用管理系统" //顶部栏标题
};

//项目名称
window.PROJECT_NAME = "xtp";

window.env = {
  NODE_ENV: "development" //是否需要主题外框还是单页面，production单页面否则带外壳
};

//后端请求接口
window.APP_SETTING = {
  SERVER_HOST: "119.37.194.4",
  SERVER_PORT: 5555,
  API: "xtp-api",
  XTP: {
    SERVER_HOST: "119.37.194.4",
    SERVER_PORT: 5555,
    API: "xtp-api"
  }
};

//其他系统地址
window.APP_SETTING_WEB = {
  SERVER_HOST: "119.37.194.4",
  SERVER_PORT: 11142,
  QCSTAGE: {
    SERVER_HOST: "119.37.194.4",
    SERVER_PORT: 11142,
    // SERVER_HOST: "localhost",
    // SERVER_PORT: 8004,
    PATH: "/js-qcstage"
  }
};
