<style lang="scss" scoped>
  .tags-view-wrapper {
    & .tags-view-item {
      & .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
<template>
    <div class="tags-view-container" v-if="visitedViews.length>0?(visitedViews.length===1?(!(visitedViews[0].path==='/')):true):false">
      <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
        <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)" >
          {{tag.title}}
          <!-- generateTitle(tag.title) -->
          <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
        </router-link>
      </scroll-pane>
      <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
        <li @click="closeSelectedTag(selectedTag)">关闭</li>
        <li @click="closeOthersTags">关闭其他</li>
        <li @click="closeAllTags">关闭所有</li>
      </ul>
    </div>
</template>
<script>

/*#region 导入函数*/
import ScrollPane from "../../../../components/scroll-pane";
import { generateTitle } from "../../../../utils/i18n";

/*#endregion*/

export default{
  name: "TagsView",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    generateTitle, // generateTitle by vue-i18n
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      if ((route.path === this.$route.path) && this.$store.state.tagsView.cachedViews.length > 0) {
        // this.$store.dispatch('cachedViewsChange', route)
      }
      return route.path === this.$route.path;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.$store.dispatch("getMenuList", {}).then(({parentMenus, allMenus}) => {
        const routeTitle = allMenus.find((allItem) => allItem.path === route.fullPath || allItem.path === route.path);
        if (routeTitle) {
          route.meta.title = routeTitle.name;
        }
        this.$store.dispatch("addVisitedViews", route);
      });
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      if (tags) {
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el);
              break;
            }
          }
        });
      }
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delVisitedViews", view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.path);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX;
      this.top = e.clientY - 40;
    },
    closeMenu() {
      this.visible = false;
    }

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  mounted() {
    const oauth = sessionStorage.getItem(window.TOKEN_KEY) || localStorage.getItem(window.TOKEN_KEY) || null;
    if (oauth) {
      this.addViewTags();
    }
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  components: { ScrollPane },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        window.addEventListener("click", this.closeMenu);
      } else {
        window.removeEventListener("click", this.closeMenu);
      }
    }
  }

  /*#endregion */

}
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/scss/views/base/home/tags-view.scss";
</style>
