const getters = {
  sidebar: (state) => state.app.sidebar,
  language: (state) => state.app.language,
  theme: (state) => state.app.theme,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  isCollapse: (state) => state.sideBar.isCollapse,
  menuList: (state) => state.sideBar.menuList,
  menuPageList: (state) => state.sideBar.menuPageList
};
export default getters;
