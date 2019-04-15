<template>
  <section>
    <el-tabs type="border-card" active-name="base">
      <el-tab-pane label="基础信息" name="base">
        <div @keyup.13="handleUpdateInfo">
          <el-form :model="userInfo" label-width="100px" :rules="formRules" ref="userInfo">
            <el-form-item label="账户名" prop="account">
              <el-input :disabled="true" v-model="userInfo.account" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userInfo.name" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userInfo.phone" auto-complete="off"
                        :disabled="editFormVisible"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="mail">
              <el-input v-model="userInfo.mail" auto-complete="off"
                        :disabled="editFormVisible"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="userInfo.qq" auto-complete="off" :disabled="editFormVisible"></el-input>
            </el-form-item>
            <el-form-item align="center" v-show="editFormVisible">
              <el-button type="success" @click="editFormVisible=false" :loading="loading.editInfoLoading">
                <!--<i class="fa fa-save"></i>--> 修改数据
              </el-button>
            </el-form-item>
            <el-form-item align="center" v-show="!editFormVisible">
              <el-button @click.native="handleCancel">取消</el-button>
              <el-button type="success" @click="handleUpdateInfo" :loading="loading.editInfoLoading"><i
                      class="fa fa-save"></i> 保存数据
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="setpwd">
        <div @keyup.13="handleUpdatePwd">
          <el-form :model="settingInfo" label-width="100px" :rules="pwdFormRules" ref="settingInfo">
            <el-form-item label="原始密码" prop="oldPwd">
              <el-input type="password" v-model="settingInfo.oldPwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input type="password" v-model="settingInfo.newPwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input type="password" v-model="settingInfo.confirmPwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item align="center">
              <el-button type="success" @click="handleUpdatePwd" :loading="loading.editPwdLoading"><i
                      class="fa fa-save"></i> 保存数据
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>

/*#region 导入函数*/
import {CheckExp} from "../../utils/utils";
import {UserAPI} from "../../modules/xtp";

/*#endregion*/

export default{
  name: "UserInfo",
  methods: {

    /*#region 自定义函数(组件change事件等)*/

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleCancel() {
      this.$refs.userInfo.resetFields();
      this.editFormVisible = true;
      UserAPI.getUser().then(({res}) => {
        this.userInfo = res.data.data;
      });
    },
    handleUpdatePwd() {
      this.$refs.settingInfo.validate((valid) => {
        if (valid) {
          this.$confirm("确认修改密码吗？", "提示", {}).then(() => {
            this.loading.editPwdLoading = true;
            const para = {password: this.settingInfo.newPwd, account: this.userInfo.account};
            const oldpwd = this.settingInfo.oldPwd;
            UserAPI.updateUserPassword(para, oldpwd).then(({res}) => {
              this.loading.editPwdLoading = false;
              if (res.data.code === 1) {
                this.$message({
                  message: "密码修改成功，请重新登录",
                  type: "success"
                });
                localStorage.removeItem(window.TOKEN_KEY);
                this.$router.push("/login");
              } else {
                this.$message({
                  message: res.data.code || "修改失败",
                  type: "error"
                });
              }
              this.$refs.settingInfo.resetFields();
            });
          });
        }
      });
    },
    handleUpdateInfo() {
      this.$refs.userInfo.validate((valid) => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示", {}).then(() => {
            this.loading.editInfoLoading = true;
            const para = Object.assign({}, this.userInfo);
            UserAPI.updateUser(para).then(({res}) => {
              this.loading.editInfoLoading = false;
              if (res.data.code === 1) {
                this.editFormVisible = true;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
                return true;
              }
            });
          });
        }
      });
    }

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  mounted() {
    UserAPI.getUser().then(({res, item}) => {
      this.userInfo = item;
    });
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error("长度在 2 到 20 个字符"));
      } else {
        if (this.settingInfo.newPwd !== "") {
          this.$refs.settingInfo.validateField("confirmPwd");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error("长度在 2 到 20 个字符"));
      } else if (value !== this.settingInfo.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      if (CheckExp.isTel(value)) {
        callback();
      } else {
        if (value) {
          return callback(new Error("请填写正确的电话号码"));
        }
        return callback();
      }
      callback();
    };
    const checkQQ = (rule, value, callback) => {
      if (value !== "" && value !== undefined) {
        if (CheckExp.isQQ(value)) {
          callback();
        } else {
          return callback(new Error("请填写正确的QQ"));
        }
      } else {
        callback();
      }
    };
    return {
      loading: {editInfoLoading: false, editPwdLoading: false},
      userInfo: {account: "", name: "", phone: "***********", mail: "", qq: ""},
      settingInfo: {oldPwd: "", newPwd: "", confirmPwd: ""},
      formRules: {
        account: [
          {required: true, message: "请输入账户名", trigger: "blur"},
          {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
        ],
        name: [
          {required: true, message: "请输入姓名", trigger: "blur"},
          {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
        ],
        phone: [
          {required: false, minlength: 11, maxlength: 11, message: "请输入正确的手机号", trigger: "blur"},
          {validator: checkPhone, trigger: "blur"}],
        mail: [{required: false, message: "", trigger: "blur"},
          {type: "email", message: "请输入正确的邮箱地址", trigger: "blur,change"}],
        qq: [{required: false, message: "", trigger: "blur"}, {validator: checkQQ, trigger: "blur,change"}]
      },
      pwdFormRules: {
        oldPwd: [
          {required: true, message: "请输入原始密码", trigger: "blur"},
          {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
        ],
        newPwd: [
          {required: true, validator: validatePass, trigger: "blur"}
        ],
        confirmPwd: [
          {required: true, validator: validatePass2, trigger: "blur"}
        ]
      },
      editFormVisible: true
    }
  }

  /*#endregion */

}
</script>
<style scoped></style>
