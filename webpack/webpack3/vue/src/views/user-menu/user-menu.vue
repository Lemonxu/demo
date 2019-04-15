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
      <el-input v-model="filters.name" placeholder="名称" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
    </xt-search>

    <!--#endregion-->

    <!--#region 页面主要列表-->

    <!--列表-->

    <el-table :data="userList" highlight-current-row v-loading="loading.listLoading" style="width: 100%;" stripe border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <user-item :userId="scope.row.id" :appId="filters.appId"></user-item>
        </template>
      </el-table-column>
      <el-table-column align="left" header-align="center" type="index" width="56" label="序号">
        <template slot-scope="scope">
          {{(pageInfo.pageIndex-1)*pageInfo.pageSize+scope.$index+1}}
        </template>
      </el-table-column>
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

    <!--#endregion-->

  </section>
</template>

<script>

  /*#region 导入函数*/
  import PagePlugIn from "../../mixins/page-plug-in";
  import {AppAPI, UserAPI} from "../../modules";
  import UserItem from "./src/user-item";

  /*#endregion*/

  export default {
    name: "User",
    methods: {

      /*#region 自定义函数(组件change事件等)*/

      /*#endregion*/

      /*#region 数据提交事件*/

      /*#endregion*/

      /*#region 操作函数(handle)*/
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
        this.getMainList();
      });
    },

    /*#endregion*/

    /*#region 注册绑定数据*/
    components: {UserItem},
    mixins: [PagePlugIn],
    data() {
      return {
        filters: {...UserAPI.init(), appId: null},
        formData: UserAPI.init(),
        formRules: {
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
