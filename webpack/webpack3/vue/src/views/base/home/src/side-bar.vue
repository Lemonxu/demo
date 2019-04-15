<style scoped lang="scss">
  @import "../../../../assets/styles/scss/views/base/home/side-bar.scss";
  /*必须要在这里导入,否则无法更改el组件的样式*/
</style>
<template>
  <section>
    <div >
      <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" v-for="(item,index) in menuList" :key="index" v-if="item.displayFlag&&item.type!==2" :router="true" background-color="rgb(238, 241, 246)" style="position: inherit" >
        <el-submenu :index="item.path"  v-if="item.children.length>0">
          <template slot="title" >
            <i :class="item.icon" ></i>
            <span slot="title" v-if="!isCollapse">{{item.name}}</span>
          </template>
          <div v-for="(child,childIndex) in item.children" :key="childIndex" v-if="child.displayFlag" >
            <el-submenu :index="child.path"  v-if="child.children.length>0" style="background-color:white">
              <template slot="title" >
                <i :class="item.icon"></i>
                <span slot="title" >{{child.name}}</span>
              </template>
              <div v-for="(grandChild,grandChildIndex) in child.children" :key="grandChildIndex" v-if="grandChild.displayFlag" >
                <el-submenu :index="grandChild.path"  v-if="grandChild.children.length>0" style="background-color:white">
                  <template slot="title" >
                    <i :class="child.icon"></i>
                    <span slot="title" >{{grandChild.name}}</span>
                  </template>
                </el-submenu>
                <el-menu-item :index="grandChild.path" :route="grandChild.path" v-else >
                  <i :class="grandChild.icon"></i>
                  <span slot="title">{{grandChild.name}}</span>
                </el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item :index="child.path" :route="child.path" v-else >
              <i :class="child.icon"></i>
              <span slot="title">{{child.name}}</span>
            </el-menu-item>
          </div>
        </el-submenu>
        <el-menu-item :index="item.path" :route="item.path" v-else >
          <i :class="item.icon"></i>
          <span slot="title" >{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </section>
</template>
<script>

/*#region 导入函数*/
// import menus from "../menus";
import {MenuAPI} from "../../../../modules/xtp";
import { mapGetters } from "vuex";

/*#endregion*/

export default{
  name: "SideBar",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    collapse: function () {
      this.$store.dispatch("changeIsCollapse");
    },
    setChildren(item, allMenuList) {
      const childrenList = [];
      allMenuList.map((allItem, allIndex) => {
        allItem.path = allItem.url;
        if (allItem.parentId === item.id) {
          if (allItem.displayFlag) {childrenList.push(allItem);}
        }
      });
      childrenList.sort(function (a, b) {
        return a.sort - b.sort;
      });
      item.children = childrenList;
      if (item.children.length > 0) {
        item.children.map((childItem, childIndex) => {
          this.setChildren(childItem, allMenuList);
        });
      }
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

  /*#endregion*/

  /*#region 注册绑定数据*/

  computed: {
    ...mapGetters(["isCollapse"]),
    menuList () {
      return this.$store.getters.menuList;
    }
  },
  data() {
    return {
      allMenuList: [],
      menuLoading: false
    }
  }

  /*#endregion */

}
</script>
