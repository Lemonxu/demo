<template>
  <section>
    <div class="main">
      <div class="header">
        <nav-bar></nav-bar>
      </div>
      <div class="body">
        <div class="body_header" :style="sidebar?'width:64px':'width:230px'">
          <side-bar class="sidebar" :style="sidebar?'position: absolute':''">{{sidebar}}</side-bar>
        </div>
        <div class="body_body">
          <div class="body_tags">
            <tags-view></tags-view>
          </div>
          <div class="body_bodys">
            <app-main id="app-main"></app-main>
          </div>
          <div class="body_foot">
            <div>杭州贤二智能科技有限公司Copyright © 2018</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

/*#region 导入函数*/
import NavBar from "./src/nav-bar.vue";
import SideBar from "./src/side-bar.vue";
import TagsView from "./src/tags-view.vue";
import AppMain from "./src/app-main.vue";

/*#endregion*/

export default{
  name: "Home",
  methods: {

    /*#region 自定义函数(组件change事件等)*/

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/

  /*#endregion*/

  /*#region 注册绑定数据*/
  components: {
    NavBar,
    SideBar,
    TagsView,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.sideBar.isCollapse;
    }
  },
  data() {
    return {}
  }

  /*#endregion */

}
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/scss/views/base/home/home.scss";
</style>
