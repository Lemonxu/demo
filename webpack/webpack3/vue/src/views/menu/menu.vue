<template>
  <section>
    <!--#region 搜索条-->

    <xt-search @search="handleSearch">
      <el-select v-model="filters.appId" placeholder="请选择" size="small" class="search-box__input" @change="handleSearch">
        <el-option
          v-for="item in appList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
        <el-input v-model="filters.code" placeholder="菜单编码" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
        <el-input v-model="filters.name" placeholder="菜单名称" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
        <template slot="actions">
          <el-button size="small" class="search-box__button" type="primary" icon="plus" @click="handleAdd">新增</el-button>
          <el-dropdown @command="handleDropDown">
            <el-button type="primary" size="small" style="margin-left:10%">
              复制当前菜单到<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-for="(item, index) in appList">
                <el-dropdown-item :key="index" v-if="item.id!==filters.appId" :command="item">
                  {{item.name}}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </xt-search>

    <!--#endregion-->

    <!--#region 页面主要列表-->

    <!--列表-->

    <el-table :data="menuList" highlight-current-row v-loading="loading.listLoading" style="width: 100%;" stripe border @expand-change="expandHandle">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <menu-tag :data="scope.row" @handleAdd="handleAdd" @handleEdit="handleEdit" @handleDel="deleteData"></menu-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" header-align="center" type="index" width="56" label="序号">
        <template slot-scope="scope">
          {{(pageInfo.pageIndex-1)*pageInfo.pageSize+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="appName"
        align="center"
        label="所属应用" minWidth="120"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span >{{scope.row.appName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="菜单编码" minWidth="120"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="菜单名称" minWidth="120"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        align="center"
        label="菜单图标" minWidth="120">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="链接地址" minWidth="120"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span >{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        label="排序" minWidth="80">
      </el-table-column>
      <el-table-column
        prop="displayFlag"
        align="center"
        label="是否启用" minWidth="120">
        <template slot-scope="scope">
          {{scope.row.displayFlag ? "√" : "×"}}
        </template>
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

    <el-dialog width="95%" top="20px" :title="formData.id===0?'新增':'修改'" :visible.sync="dialog.formDataVisible" :close-on-click-modal="false" :modal-append-to-body="false">
      <el-form :model="formData" label-width="100px" :rules="formRules" ref="formData">
        <el-form-item label="所属应用" prop="appId" v-show="formData.parentId===0">
          <el-select v-model="formData.appId" placeholder="请选择所属应用">
            <el-option
              v-for="item in appList"
              :label="item.name"
              :value="item.id" :key="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单编码" prop="code">
          <el-input placeholder="请输入菜单编码" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input placeholder="请输入菜单名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input placeholder="请输入链接地址" v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">页面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number v-model="formData.sort" placeholder="请输入排序值" :min="0" :controls="false" :max="9999"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <span style="color: #1c8de0; font-size: 1.5rem"><i :class="formData.icon"></i></span>
          <el-button type="success" size="mini" @click.native="dialog.iconVisible = true">选择图标</el-button>
          <span style="padding-left: 1rem">是否启用 </span>
          <el-checkbox v-model="formData.displayFlag"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取消</el-button>
        <el-button type="primary" @click.native="submitData" :loading="loading.addLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择图标" :visible.sync="dialog.iconVisible" :modal-append-to-body="false" :close-on-click-modal="false">
      <div class="iconbox">
        <div class="item" v-for="(item,index) in allIcon" @click="handleIcon(item)" :key="index">
          <i :class="item"></i>
        </div>
      </div>
    </el-dialog>
    <!--#endregion-->

  </section>
</template>

<script>

/*#region 导入函数*/
import {AppAPI, getAllIcons} from "../../modules";
import PagePlugIn from "../../mixins/page-plug-in";
import {MenuAPI} from "../../modules";
import MenuTag from "./src/menuTag";

/*#endregion*/

export default {
  name: "Menu",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    expandHandle(row, expanded) {
      return new Promise(function (resolve) {
        if (expanded) {
          row.loading = true;
          MenuAPI.listMenu({pageIndex: 1, pageSize: 999999, parentId: row.id}).then(({list}) => {
            row.loading = false;
            list.map(function (element) {
              element.childs = [];
            });
            list.sort(function (a, b) {
              return a.sort - b.sort;
            });
            row.children = list;
            resolve();
          });

          /* } else {
               resolve()
           }*/
        }
      });
    },

    /*#endregion*/

    /*#region 数据提交事件*/

    //提交事件

    submitData() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formData));
          if (params.id === 0) {
            this.loading.addLoading = true;
            MenuAPI.insertMenu(params).then(({data}) => {
              if (data.code === 1) {
                this.$refs.formData.resetFields();
                this.getMainList();
                this.dialog.formDataVisible = false;
              }
              this.loading.addLoading = false;
            });
        } else {
          this.loading.addLoading = true;
          MenuAPI.updateMenu(params).then(({data}) => {
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

    deleteData(row, parent) {
      this.$confirm("删除之后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        MenuAPI.deleteMenu({id: row.id}).then(({data}) => {
          if (data.code === 1) {
            if (row.parentId !== 0) {
              this.getChildMenuList(row, parent);
              return true;
            }
            this.getMainList();
          }
        });
      });
    },


    /*#endregion*/

    /*#region 操作函数(handle)*/

    //修改

    handleEdit(row, data) {
      this.menuTagData = data || {};
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData = JSON.parse(JSON.stringify(row));
      this.dialog.formDataVisible = true;
    },
    handleCancel() {
      this.dialog.formDataVisible = false;
    },
    handleAdd(row) {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData = {...MenuAPI.init(), appId: row.appId || null, parentId: row.id || 0, type: 1, displayFlag: true};
      this.dialog.formDataVisible = true;
    },
    handleIcon(icon) {
      this.formData.icon = icon;
      this.dialog.iconVisible = false;
    },
    handleDropDown(item) {
      this.$confirm('确定将当前所有菜单复制到另一个应用下？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {fromAppId: this.filters.appId, toAppId: item.id};
        MenuAPI.updateCopy(params);
      });
    },


    /*#endregion*/

    /*#region 获取数据*/

    getChildMenuList(row, parent) {
      const params = {
        parentId: row.parentId || 0,
        orderBy: "sort asc",
        pageIndex: 1,
        pageSize: 9999
      };
      MenuAPI.listMenu(params).then(({data, list}) => {
        list.map((element) => {
          const appItem = this.appList.find((i) => i.id === element.appId);
          if (appItem) {
            element.appName = appItem.name || "";
          }
        });
        parent.children = list;
      });
    },
    getMainList() {
      const params = {
        ...this.getParams(),
        appId: this.filters.appId,
        parentId: 0,
        orderBy: "sort asc"
      };
      MenuAPI.listMenu(params).then(({data, list}) => {
        list.map((element) => {
          const appItem = this.appList.find((i) => i.id === element.appId);
          if (appItem) {
            element.appName = appItem.name || "";
          }
        });
        this.menuList = list;
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

  components: {MenuTag},
  data() {
    return {
      filters: {...MenuAPI.init(), appId: ""},
      formData: MenuAPI.init(),
      formRules: {
        url: [
          {required: true, message: "请输入链接地址", trigger: "blur"}
        ],
        code: [
          {required: true, message: "请输入菜单编码", trigger: "blur"},
          {min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur"}
        ],
        name: [
          {required: true, message: "请输入菜单名称", trigger: "blur"},
          {min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "blur"}
        ],
        appId: [
          {required: true, message: "请选择所属应用", trigger: "change"}
        ],
        icon: [
          {required: true, message: "请选择菜单图标", trigger: "change"}
        ],
        sort: [{required: false, type: "number", message: "", trigger: "change"}],
        type: [{required: true, message: "请选择菜单类型", trigger: "change"}]
      },
      dialog: { formDataVisible: false, iconVisible: false },
      loading: { addLoading: false, listLoading: false },
      menuList: [],
      appList: [],
      allIcon: getAllIcons(),
      menuTagData: {}
    };
  },
  mixins: [PagePlugIn]

  /*#endregion */

};
</script>

<style scoped lang="scss">
  @import "../../assets/styles/scss/views/menu/menu";
</style>
