import Vue from 'vue'
import Router from 'vue-router'
import routers from './router'
import store from "./store"
// @ts-ignore
import App from './App.vue'
import ElementUI from 'element-ui'
import Components from "./components";
import "./assets/styles/scss/themes/element-variables.scss"
import "font-awesome/css/font-awesome.min.css"
import 'babel-polyfill'
import "./utils/common";

Vue.use(Router);
Vue.use(ElementUI);
Vue.use(Components);

Vue.config.productionTip = false;

// declare global {
//   interface Window {
//     SYSTEM_NAME: string
//     _Vue: any
//   }
// }
window.document.title = window.THEME_CONFIG.NAV_BAR_NAME;

const router = new Router({
  routes: routers
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const getStorageItem = sessionStorage.getItem(window.TOKEN_KEY) || localStorage.getItem(window.TOKEN_KEY) || null;
    if (!getStorageItem) {
      next({
        path: "/login"
        // query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
    next();
  } else {
    next();
  }
});

/* eslint-disable no-new */
window._Vue = new Vue({
  el: '#app',
  router,
  store,
  data: {
    Bus: new Vue()
  },
  render: (h) => h(App)
})
