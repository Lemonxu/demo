<template>
  <section>
    <!--#region 搜索条-->

    <xt-search @search="handleSearch">
      <el-select v-model="filters.appId" placeholder="请选择" @change="handleSearch" size="small">
        <el-option
          v-for="item in appList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="filters.code" placeholder="角色编码" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
      <el-input v-model="filters.name" placeholder="角色名称" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
      <template slot="actions">
        <el-button size="small" class="search-box__button" type="primary" icon="plus" @click="handleAdd">新增</el-button>
      </template>
    </xt-search>

    <!--#endregion-->

    <!--#region 页面主要列表-->

    <!--列表-->

    <el-table :data="roleList" highlight-current-row v-loading="loading.listLoading" style="width: 100%;" stripe border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <role-menu :roleId="scope.row.id" :appId="scope.row.appId"></role-menu>
        </template>
      </el-table-column>
      <el-table-column align="left" header-align="center" type="index" width="56" label="序号">
        <template slot-scope="scope">
          {{(pageInfo.pageIndex-1)*pageInfo.pageSize+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="角色编码">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column align="left" header-align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
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
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" auto-complete="off" :maxlength="255" placeholder="请输入角色编码" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" auto-complete="off" :maxlength="255" placeholder="请输入角色名称" size="small"></el-input>
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

  import PagePlugIn from "../../mixins/page-plug-in";
  import {RoleAPI, AppAPI} from "../../modules";
  import {GetExitData} from "../../utils/utils";
  import RoleMenu from "./src/role-menu";

  /*#endregion*/

  export default {
    name: "Role",
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
              RoleAPI.insertRole(params).then(({data}) => {
                if (data.code === 1) {
                  this.$refs.formData.resetFields();
                  this.getMainList();
                  this.dialog.formDataVisible = false;
                }
                this.loading.addLoading = false;
              });
            } else {
              this.loading.addLoading = true;
              RoleAPI.updateRole(params).then(({data}) => {
                if (data.code === 1) {
                  this.$refs.formData.resetFields();
                  this.getMainList();
                  this.dialog.formDataVisible = false;
                }
                this.loading.addLoading = false;
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
          RoleAPI.deleteRole({id: row.id}).then(({data}) => {
            if (data.code === 1) {
              this.getMainList();
            }
          });
        });
      },


      /*#endregion*/

      /*#region 操作函数(handle)*/

      //修改

      handleEdit(row) {
        this.$refs.formData && this.$refs.formData.resetFields();
        this.formData = JSON.parse(JSON.stringify(row));
        this.dialog.formDataVisible = true;
      },
      handleCancel() {
        this.dialog.formDataVisible = false;
      },
      handleAdd() {
        this.$refs.formData && this.$refs.formData.resetFields();
        this.formData = {...RoleAPI.init(), appId: this.filters.appId || null};
        this.dialog.formDataVisible = true;
      },

      /*#endregion*/

      /*#region 获取数据*/

      getMainList() {
        const params = {
          ...this.getParams()
        };
        RoleAPI.listRole(params).then(({data, list}) => {
          this.roleList = list;
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
          this.filters.appId = this.appList[0].id;
        }
        this.getMainList();
      });
    },

    /*#endregion*/

    /*#region 注册绑定数据*/
    components: {RoleMenu},
    mixins: [PagePlugIn],
    data() {
      const checkCode = (rule, value, callback) => {
        GetExitData({code: value.replace(/\s+/g, "")}, RoleAPI.listRole).then(({isEmpty, id}) => {
          if ((id === this.formData.id)) {callback();} else {
            if (!isEmpty) {return callback(new Error("该编码已存在，请重新输入"));} else {callback();}
          }
        });
      };
      const checkName = (rule, value, callback) => {
        GetExitData({name: value.replace(/\s+/g, "")}, RoleAPI.listRole).then(({isEmpty, id}) => {
          if ((id === this.formData.id)) {callback();} else {
            if (!isEmpty) {return callback(new Error("该名称已存在，请重新输入"));} else {callback();}
          }
        });
      };
      return {
        filters: {...RoleAPI.init(), appId: null},
        formData: RoleAPI.init(),
        formRules: {
          code: [
            {required: true, message: "请输入角色编码", trigger: "blur"},
            {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"},
            {validator: checkCode, trigger: "blur"}
          ],
          name: [
            {required: true, message: "请输入角色名称", trigger: "blur"},
            {min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"},
            {validator: checkName, trigger: "blur"}
          ]
        },
        dialog: { formDataVisible: false },
        loading: { addLoading: false, listLoading: false },
        roleList: [],
        appList: []
      };
    }

    /*#endregion */

  };
</script>

<style scoped>

</style>
