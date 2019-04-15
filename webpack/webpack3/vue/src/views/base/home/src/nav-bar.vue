<template>
  <section>
    <div class="bar">
      <label>
        <span class="collapse" @click.prevent="collapse">
            <i class="fa fa-align-justify" ></i>
        </span>
        {{systemName}}
      </label>
      <el-select v-if="themeSwitch" class="theme-select" v-model="theme" placeholder="请选择主题" size="mini">
        <el-option
                v-for="item in themes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
      <el-dropdown trigger="hover" class="userinfo">
          <span class="el-dropdown-link userinfo-inner">
              <img src="../../../../assets/images/user.png" /> {{userInfo.userName || userInfo.account}}
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in menuPageList" :key="index" @click.native="handleWorkingInspecting(item)">
            <i v-bind:class="item.icon"></i> {{item.name}}
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handleUserInfo">
            <i class="fa fa-drivers-license-o"></i> 我的资料
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <i class="fa fa-sign-out"></i> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </section>
</template>
<script>

/*#region 导入函数*/
import { mapGetters } from "vuex";

/*#endregion*/

export default{
  name: "NavBar",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    //退出登录
    logout() {
      this.$confirm("确认退出吗?", "提示", {
      }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        this.$router.push("/login");
      });
    },
    collapse() {
      this.$store.dispatch("changeIsCollapse");
    },

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleWorkingInspecting(item) {
      window.location = item.url;
    },
    handleUserInfo() {
      location.href = "#/userinfo";
    }

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  created() {
    try {
      this.systemName = window.SYSTEM_NAME || this.systemName;
      this.themeSwitch = window.THEME_CONFIG.THEME_SWITCH || false;
    } catch (e) {
      console.warn(e);
    }
  },
  mounted() {
    this.userInfo = {account: sessionStorage.getItem("account") || localStorage.getItem("account") || "", userName: sessionStorage.getItem("userName") || localStorage.getItem("userName") || ""};
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  computed: {
    ...mapGetters(["isCollapse", "menuPageList"]),
    theme: {
      get() {
        return this.$store.getters.theme || "default"
      },
      set(value) {
        this.$store.dispatch("setTheme", value);
        console.log(value);
      }
    }
  },
  data() {
    return {
      themes: [{value: "default", label: "默认主题"}, {value: "yandang", label: "雁荡主题"}],
      themeSwitch: window.THEME_CONFIG.THEME_SWITCH || false,
      sysUserName: "",
      systemName: window.THEME_CONFIG.NAV_BAR_NAME || "",
      userInfo: {account: localStorage.getItem("account"), userName: localStorage.getItem("userName")}
    }
  }

  /*#endregion */

}
</script>
<style lang="scss" scoped>
  @import "../../../../assets/styles/scss/views/base/home/nav-bar.scss";
</style>
