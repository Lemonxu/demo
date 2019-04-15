<template>
  <section>
    <!--#region 搜索条-->

    <xt-search @search="handleSearch">
      <el-select v-model="filters.appId" placeholder="应用名称" size="small" class="search-box__input" @change="handleSearch">
        <el-option
          v-for="item in appList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
        <el-input v-model="filters.account" placeholder="账户" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
        <el-input v-model="filters.name" placeholder="姓名" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
        <template slot="actions">
          <el-button size="small" class="search-box__button" type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </template>
      </xt-search>

    <!--#endregion-->

    <!--#region 页面主要列表-->

    <!--列表-->

    <el-table :data="userList" highlight-current-row v-loading="loading.listLoading" style="width: 100%;" stripe border>
      <!--<el-table-column type="expand">-->
      <!--<template slot-scope="scope">-->
      <!--<useritem :userId="scope.row.id" :appId="filters.appId"></useritem>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="left" header-align="center" type="index" width="56" label="序号">
        <template slot-scope="scope">
          {{(pageInfo.pageIndex-1)*pageInfo.pageSize+scope.$index+1}}
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="appName"-->
      <!--align="center"-->
      <!--label="所属应用">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="name"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="account"
        align="center"
        label="登录账户">
      </el-table-column>
      <!-- <el-table-column
               prop="groupId"
               align="center"
               label="分组号">
       </el-table-column>-->
      <el-table-column
        prop="phone"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="mail"
        align="center"
        label="Email">
      </el-table-column>
      <el-table-column
        prop="qq"
        align="center"
        label="QQ">
      </el-table-column>
      <el-table-column label="操作" width="270">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleReset(scope.row)">重置密码</el-button>
          <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--#endregion-->

    <!--#region 工具条-->

    <!--工具条-->

    <el-row>
      <el-col :span="24" class="toolbar">
        <el-pagination
          style="float:right;"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageInfo.pageSize"
          layout="sizes, prev, pager, next"
          :total="pageInfo.count">
        </el-pagination>
      </el-col>
    </el-row>

    <!--#endregion-->

    <!--#region 新增修改页面-->

    <!--新增界面-->

    <el-dialog width="95%" top="20px" :title="formData.id==0?'新增':'修改'" :visible.sync="dialog.formDataVisible" :close-on-click-modal="false" :modal-append-to-body="false">
      <el-form :model="formData" label-width="100px" :rules="formRules" ref="formData">
        <el-form-item label="账户名" prop="account">
          <el-input v-model="formData.account" auto-complete="off" :maxlength="50" placeholder="请输入账户名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" auto-complete="off" :maxlength="50" placeholder="请输入姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择" style="width:100%">
            <el-option v-for="item in roleList" :label="item.name" :value="item.id+''" :key="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" auto-complete="off" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="mail">
          <el-input v-model="formData.mail" auto-complete="off" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="formData.qq" auto-complete="off" :maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取消</el-button>
        <el-button type="primary" @click.native="submitData" :loading="loading.addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--#endregion-->

  </section>
</template>

<script>

/*#region 导入函数*/
import {CheckExp, GetExitData} from "../../utils/utils";
import PagePlugIn from "../../mixins/page-plug-in";
import {AppAPI, UserAPI, RoleAPI, RoleUserAPI} from "../../modules";

/*#endregion*/

export default {
  name: "User",
  methods: {

    /*#region 自定义函数(组件change事件等)*/

    /*#endregion*/

    /*#region 数据提交事件*/

    //提交事件

    submitData() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          if (params.id === 0) {
            this.loading.addLoading = true;
            UserAPI.insertUser(params).then(({data}) => {
              if (data.code === 1) {
                params.id = data.data.id;
                RoleUserAPI.updateRoleUser({userId: params.id, roleIds: params.roleIds.join(",")}).then(({res}) => {
                  this.loading.addLoading = false;
                  this.$refs.formData.resetFields();
                  this.getMainList();
                  this.dialog.formDataVisible = false;
                });
              }
            });
        } else {
          this.loading.addLoading = true;
          UserAPI.updateUser(params).then(({data}) => {
            this.loading.addLoading = false;
            if (data.code === 1) {
              RoleUserAPI.updateRoleUser({userId: params.id, roleIds: params.roleIds.join(",")}).then(({res}) => {
                this.$refs.formData.resetFields();
                this.getMainList();
                this.dialog.formDataVisible = false;
              });
            }
          });
          }
        }
      });
    },

    //删除

    deleteData(row) {
      this.$confirm("删除之后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        UserAPI.deleteUser({id: row.id}).then(({data}) => {
          if (data.code === 1) {
            this.getMainList();
          }
        });
      });
    },


    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleReset(row) {
      this.$confirm("确认重置该用户的密码吗?", "提示", {
        type: "warning"
      }).then(() => {
        UserAPI.updateUserResetPassword({id: row.id}).then(({res}) => {
          this.$message({
            showClose: true,
            message: "重置密码成功!【新密码：" + res.data.data.password + "】",
            type: "success",
            duration: 100000
          });
        });
      });
    },
    async handleEdit(row) {
      await RoleAPI.listRole({pageIndex: 1, pageSize: 9999, appId: this.filters.appId}).then(({list}) => {
        this.roleList = list;
      });
      await RoleUserAPI.listRoleUser({pageIndex: 1, pageSize: 999999, userId: row.id, appId: this.filters.appId}).then(({list}) => {
        const roleIds = [];
        list.map((roleItem) => {
          roleIds.push(roleItem.roleId + "");
        });
        row.roleIds = roleIds;
        this.$refs.formData && this.$refs.formData.resetFields();
        this.formData = JSON.parse(JSON.stringify(row));
        this.dialog.formDataVisible = true;
      });
      return true;
    },
    handleCancel() {
      this.dialog.formDataVisible = false;
    },
    handleAdd() {
      RoleAPI.listRole({pageIndex: 1, pageSize: 9999, appId: this.filters.appId}).then(({list}) => {
        this.roleList = list;
        this.$refs.formData && this.$refs.formData.resetFields();
        this.formData = {...UserAPI.init(), appId: this.filters.appId, roleIds: []};
        this.dialog.formDataVisible = true;
      });
    },

    /*#endregion*/

    /*#region 获取数据*/

    getMainList() {
      const params = {
        ...this.getParams(),
        appFlag: true
      };
      UserAPI.listUser(params).then(({data, list}) => {
        this.userList = list;
        this.pageInfo.pageIndex = data.data ? data.data.currentPage : 1;
        this.pageInfo.count = data.data ? data.data.count : 0;
      });
    }

    /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/

  created() {
    AppAPI.listApp({pageIndex: 1, pageSize: 9999}).then(({list}) => {
      this.appList = list;
      if (list.length > 0) {
        this.filters.appId = list[0].id;
      }
      RoleAPI.listRole({pageIndex: 1, pageSize: 9999, appId: this.filters.appId}).then(({list}) => {
        this.roleList = list;
      });
      this.getMainList();
    });
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  mixins: [PagePlugIn],
  data() {
    const checkPhone = (rule, value, callback) => {
      if (CheckExp.isTel(value)) {
        callback();
      } else {
        return callback(new Error("请填写正确的电话号码"));
      }
    };
    const checkQQ = (rule, value, callback) => {
      if (value) {
        if (CheckExp.isQQ(value)) {
          callback();
        } else {
          return callback(new Error("请填写正确的QQ"));
        }
      } else {
        callback();
      }
    };
    const checkUser = (rule, value, callback) => {
      const param = {account: value}; //, appId: this.filters.appId
      GetExitData(param, UserAPI.listUser).then(({isEmpty, id}) => {
        if ((id === this.formData.id)) {callback();} else {
          if (!isEmpty) {return callback(new Error("该账户已存在，请重新输入"));} else {callback();}
        }
      });
    };
    return {
      filters: {...UserAPI.init(), appId: null},
      formData: UserAPI.init(),
      formRules: {
        account: [
          {required: true, message: "请输入账户名", trigger: "change"},
          {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"},
          {validator: checkUser, trigger: "blur"}
        ],
        name: [
          {required: true, message: "请输入姓名", trigger: "blur"},
          {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
        ],
      //  groupId: [
      //      {required: true, message: '请输入分组号', trigger: 'blur'}
      //  ],
      // phone: [
      //     {minlength: 11, maxlength: 11,required: true, message: '请输入正确的手机号', trigger: 'blur'},
      //     { validator:checkPhone, trigger: 'blur,change' }
      // ],
        mail: [{ required: false, message: "", trigger: "change" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur,change" }],
        qq: [{required: false, message: "", trigger: "blur"}, { validator: checkQQ, trigger: "change" }],
        roleIds: [{required: true, message: "请选择角色", trigger: "change"}]
      },
      dialog: { formDataVisible: false },
      loading: { addLoading: false, listLoading: false },
      userList: [],
      appList: [],
      roleList: []
    };
  }

  /*#endregion */

};
</script>

<style scoped>

</style>
