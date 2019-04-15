<template>
  <section>
    <div @keyup.13="handleLogin" class="mainLogin">
      <div class="login-container">
        <!--头部-->
        <div class="form-title-wrap">
          <div class="form-title">{{systemName}}</div>
          <div class="form-subtitle">{{subName}}</div>
          <div class="form-english">BackStage login</div>
        </div>
        <!--表单-->
        <el-form :model="formData" :rules="formRules" ref="formData" label-position="left" label-width="0px" class="rule-form">
          <el-form-item prop="account">
            <el-input type="text" v-model="formData.account" icon="" auto-complete="off" placeholder="账号">
              <template slot="prepend">
                <i class="fa fa-user-o"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formData.password" auto-complete="off" placeholder="密码">
              <template slot="prepend">
                <i class="fa fa-key"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <div class="remember">
          <el-checkbox v-model="isRemember">记住密码</el-checkbox>
        </div>
        <div class="buttons">
          <el-button type="primary" class="login" @click.native.prevent="handleLogin" :loading="loading.loginLoading">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </div>
      </div>
    </div>
  </section>
</template>
<script>

/*#region 导入函数*/
import {UserAPI} from "../../../modules/xtp";
import PagePlugIn from "../../../mixins/page-plug-in";

/*#endregion*/

export default{
  name: "Login",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    redirect() {
      let redirect = this.$route.query.redirect;
      redirect = redirect ? redirect : "/";
      this.$router.push({ path: redirect });
    },
    saveItem(data) {
      if (this.isRemember) {
        localStorage.setItem(window.TOKEN_KEY, data);
      } else {
        sessionStorage.setItem(window.TOKEN_KEY, data);
      }
    },

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleLogin() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.loading.loginLoading = true;
          const loginParams = { account: this.formData.account, password: this.formData.password };
          UserAPI.loginUser(loginParams).then(({res}) => {
            sessionStorage.clear();
            localStorage.clear();
            this.loading.loginLoading = false;
            const { msg, code, data } = res.data;
            if (code !== 1) {
              this.$message({
                message: "登录失败,请确认用户名密码！",
                type: "error"
              });
            } else {
              this.saveItem(data);
              this.getUserData();
              this.$store.dispatch("delMenuList", []);
              this.$store.dispatch("delMenuOperation", []);
              this.$store.dispatch("delAllViews", []);
              // this.$store.dispatch('getMenuList',{},true)
            }
          });
        } else {
          return false;
        }
      });
    },

    /*#endregion*/

    /*#region 获取数据*/
    getUserData () {
      UserAPI.getUser().then(({res}) => {
        if (res.data.code === 1) {
          localStorage.setItem("account", res.data.data.account);
          localStorage.setItem("userName", res.data.data.name);
          sessionStorage.setItem("account", res.data.data.account);
          sessionStorage.setItem("userName", res.data.data.name);
          this.redirect();
        } else {
          this.$message({
            type: "error",
            message: "未能成功获取用户信息，请重新登录"
          });
          return true;
        }
      });
    }

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  created() {
    this.$message.closeAll();
    try {
      this.systemName = window.THEME_CONFIG.SYSTEM_NAME || this.systemName;
      this.subName = window.THEME_CONFIG.SUB_NAME || this.systemName;
    } catch (e) {
      console.warn(e);
    }
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    return {
      systemName: window.THEME_CONFIG.SYSTEM_NAME || "",
      subName: window.THEME_CONFIG.SUB_NAME || "",
      loading: {loginLoading: false},
      formData: {
        account: "",
        password: ""
      },
      formRules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      isRemember: false
    };
  },
  mixins: [PagePlugIn]

  /*#endregion */

}
</script>
<style scoped lang="scss">
  @import "../../../assets/styles/scss/views/base/login/login.scss";
</style>
