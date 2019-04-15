<template>
  <section>
    <xt-search @search="handleSearch" >
      <el-select v-model="filters.appId" placeholder="请选择" class="search-box__input"  size="small" @change="handleSearch">
        <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="filters.name" placeholder="姓名" class="search-box__input"  size="small" clearable @keyup.enter.native="handleSearch"></el-input>
      <el-input v-model="filters.account" placeholder="账户名" class="search-box__input"  size="small" clearable @keyup.enter.native="handleSearch"></el-input>
    </xt-search>

    <el-row :gutter="0">
      <el-col :span="5">
        <div class="grid-content bg-purple xt-height">
          <div class="xt-role-head">用户名称</div>
          <div class="xt-role-body" v-loading.lock="loading.listLoading">
            <el-table :data="userList" highlight-current-row  style="width: 100%;" @row-click="getRoleMenus"
                      :show-header="false">
              <el-table-column
                      prop="name"
                      align="center"
                      label="名称">
                <template slot-scope="scope">
                  <span><span style="font-size:12px;color:gray">[{{scope.row.account}}]</span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <!--toolbars-->
              <el-col :span="24" class="toolbar">
                <el-pagination
                        :small="true"
                        style="float:right;"
                        @size-change="handledSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.pageIndex"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageInfo.pageSize"
                        layout="sizes, prev, pager, next"
                        :total="pageInfo.count">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content xt-height">
          <div class="xt-role-head">用户菜单</div>
          <div class="xt-role-body">
            <el-tree
                    :data="menuList"
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="selectedMenus"
                    :props="defaultProps" style="height: 37.4rem;border:none;"
                    @node-click="getRoleData"
                    :highlight-current="true"
                    :disabled="true"
                    :expand-on-click-node="true"
                    v-loading.lock="loading.roleMenuListLoading">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple xt-height" style="border-right: 1px solid #DFE6EC">
          <div class="xt-role-head" style="border-right:1px solid #DFE6EC;">
            按钮权限信息
          </div>
          <div class="xt-role-data-body" v-show="!switchButton.value" >
            <div class="xt-role-data-list-body" v-show="addForm.menuId==0?false:true" style="">
              <div class="xt-role-data-list-head" >
                按钮权限选择
              </div>
              <div style="border: 1px solid #DFE6EC;height: 30rem;" v-loading.lock="loading.menuOperationLoading">
                <div style="" v-for="item in menuOperationList" >
                  <div class="xt-menu-operation-item" style="">{{item.name}}({{item.code}})</div>
                  <div style="display: inline-block;background-color: #ededed">
                    <el-radio-group v-model="item.type" @change="checkBoxChange(item)">
                      <el-radio :label="-1">忽略</el-radio>
                      <el-radio :label="0">禁止</el-radio>
                      <el-radio :label="1">允许</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--角色权限添加模态框 a dialog for role rule add-->
    <el-dialog :title="addForm.id==0?'数据权限添加':'数据权限修改'" :visible.sync="addDialogVisible" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item class="xt-inline-block" label="角色名称">
              <el-tag type="gray">{{addForm.roleName}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="xt-inline-block" label="角色菜单">
              <el-tag type="gray">{{addForm.menuName}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="addForm.fieldName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运算符" prop="symbol">
          <el-select v-model="addForm.symbol" placeholder="请选择运算符" class="xt-width-full-width">
            <el-option label="大于" value=">"></el-option>
            <el-option label="大于等于" value=">="></el-option>
            <el-option label="小于" value="<"></el-option>
            <el-option label="小于等于" value="<="></el-option>
            <el-option label="等于" value="="></el-option>
            <el-option label="不等于" value="<>"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数值" prop="value">
          <el-input  v-model="addForm.value" auto-complete="off" class="xt-width-full-width"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="addRoleDataSure" :loading="loading.addRoleDataLoading">确 定</el-button>
              </span>
    </el-dialog>

  </section>
</template>
<script>

/*#region 导入函数*/
import {MenuOperationAPI, AppAPI, MenuAPI, UserMenuOperationAPI, RoleDataRuleAPI, UserAPI} from "../../modules/xtp";

/*#endregion*/

export default{
  name: "UserButtonRule",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    /*按钮权限的保存删除事件*/
    checkBoxChange(item) {
      const _this = this;
      const params = {data: JSON.stringify({userId: _this.addForm.userId, menuId: _this.addForm.menuId, menuOperationId: item.id, type: item.type})};
      UserMenuOperationAPI.insertUserMenuOperation(params).then(function ({res}) {
        if (res.data.code === 1) {
          //  成功
        } else {
          _this.$message({
            type: "error",
            message: "保存失败!"
          });
          const newAddForm = _this.addForm;
          const newParams = {id: newAddForm.menuId, name: newAddForm.menuName, userId: newAddForm.userId, roleName: newAddForm.roleName, fieldName: newAddForm.fieldName, symbol: newAddForm.symbol, value: newAddForm.value};
          _this.getRoleData(newParams);
        }
      });
    },

    //数据与按钮切换事件
    radioChange(value) {
      const list = [{name: "数据", value: true}, {name: "按钮", value: false}];
      const _this = this;
      list.map(function (element) {
        if (element.name === value) {_this.switchButton.value = element.value;}
      });
    },
    //新增权限数据
    addRoleData() {
      const _this = this;
      _this.addDialogVisible = true;
      const newItem = _this.addForm;
      newItem.fieldName = "";
      newItem.symbol = "";
      newItem.value = "";
    },

    //打开修改页面
    editRoleData(item) {
      const _this = this;
      item.isEdit = true;
    },
    /*编辑确认数据权限*/
    editRoleDataSure(item) {
      const _this = this;
      const params = item;
      _this.loading.editRoleDataLoading = true;
      RoleDataRuleAPI.updateRoleDataRule(params).then(function ({res}) {
        if (res.data.code === 1) {
          item.isEdit = false;
          _this.$message({
            type: "success",
            message: "更新成功!"
          });
          const paramsAddForm = _this.addForm;
          const newParams = {id: paramsAddForm.menuId, name: paramsAddForm.menuName, userId: paramsAddForm.userId, roleName: paramsAddForm.roleName, fieldName: paramsAddForm.fieldName, symbol: paramsAddForm.symbol, value: paramsAddForm.value};
          _this.getRoleData(newParams);
        }
        _this.loading.editRoleDataLoading = false;
      });
    },

    /* 取消编辑数据权限*/
    editRoleDataCancel(item) {
      item.isEdit = false;
    },

    /*确认添加权限数据*/
    addRoleDataSure() {
      const _this = this;
      const params = this.addForm;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          _this.loading.addRoleDataLoading = true;
          RoleDataRuleAPI.insertRoleDataRule(params).then(function ({res}) {
            if (res.data.code === 1) {
              _this.addDialogVisible = false;
              _this.$message({
                type: "success",
                message: "添加成功!"
              });
              const newParams = {id: params.menuId, name: params.menuName, userId: params.userId, roleName: params.roleName, fieldName: params.fieldName, symbol: params.symbol, value: params.value};
              _this.getRoleData(newParams);
              _this.$refs.addForm.resetFields();
            }
            _this.loading.addRoleDataLoading = false;
          });
        } else {
          _this.loading.addRoleDataLoading = false;
          return false;
        }
      });
    },

    /*#endregion*/

    /*#region 数据提交事件*/
    /*删除权限信息数据列表事件*/
    deleteRoleData(item) {
      const _this = this;
      const params = {id: item.id};
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        item.deleteRoleDataLoading = true;
        RoleDataRuleAPI.deleteRoleDataRule(params).then(function ({res}) {
          if (res.data.code === 1) {
            _this.$message({
              type: "success",
              message: "删除成功!"
            });
            const paramsAddForm = _this.addForm;
            const newParams = {id: paramsAddForm.menuId, name: paramsAddForm.menuName, userId: paramsAddForm.userId, roleName: paramsAddForm.roleName, fieldName: paramsAddForm.fieldName, symbol: paramsAddForm.symbol, value: paramsAddForm.value};
            _this.getRoleData(newParams);
          }
          item.deleteRoleDataLoading = false;
        });

      });
    },

    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleSearch() {
      this.getUserLists();
    },
    //弹框关闭按钮事件
    handleClose(done) {
      this.addDialogVisible = false;
      const newItem = this.addForm;
      newItem.fieldName = "";
      newItem.symbol = "";
      newItem.value = "";
      this.$refs.addForm.resetFields();
    },
    //每页数据数
    handledSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getUserLists();
    },
    //数据当前页
    handleCurrentChange(val) {
      this.pageInfo.pageIndex = val;
      this.getUserLists();
    },

    /*#endregion*/

    /*#region 获取数据*/
    //获取菜单按钮列表
    getMenuOperatorList(params) {
      const _this = this;
      return new Promise(function (resolve, reject) {
        MenuOperationAPI.listMenuAllOperation(params).then(({res}) => {
          resolve(res.data.data.data);
        });
      });
    },

    getMenuOperationSelectedList(params) {
      const _this = this;
      return new Promise(function (resolve, reject) {
        UserMenuOperationAPI.listUserMenuOperation(params).then(({res}) => {
          resolve(res.data.data.data);
        });
      });
    },

    //获取菜单列表
    getUserLists() {
      const _this = this;
      const para = Object.assign({}, this.pageInfo);
      para.name = "%" + _this.filters.name + "%";
      para.account = "%" + _this.filters.account + "%";
      para.appId = _this.filters.appId;
      para.appFlag = true;
      this.loading.listLoading = true;
      this.addForm = {id: 0, userId: 0, roleName: "", menuName: "", menuId: 0, fieldName: "", symbol: "", value: 0, menuOperationEdit: false};
      _this.userList = [];
      _this.userMenuList = [];
      _this.userMenuDataList = [];
      _this.menuList = [];
      UserAPI.listUser(para).then(({res}) => {
        _this.pageInfo.pageIndex = res.data.data.currentPage;
        _this.pageInfo.count = res.data.data.count;
        const list = res.data.data.data;
        _this.userList = list;
        _this.loading.listLoading = false;
      });
    },

    //获取选中的角色的菜单列表
    getRoleMenus(item, event) {
      const _this = this;
      const newItem = this.addForm;
      newItem.userId = item.id;
      newItem.userName = item.name;
      newItem.menuId = 0;
      newItem.menuName = "";
      _this.userMenuList = [];
      _this.userMenuDataList = [];
      const params = {pageIndex: 1, pageSize: 2147483647, userId: newItem.userId};
      return new Promise(function (resolve, reject) {
        _this.loading.roleMenuListLoading = true;
        MenuAPI.listMenuWithOperationByUserId(params).then(function({res}) {
          const allMenu = res.data.data.allMenu ? res.data.data.allMenu : [];
          const menuArr = res.data.data.parentMenu ? res.data.data.parentMenu : [];
          const menuList = [];
          menuArr.map(function (item) {
            item.childs = [];
            allMenu.map((element) => {
              if (item.id === element.id) {
                menuList.push(item);
              }
              if (element.parentId === item.id) {
                item.childs.push(element);
              }
            });
            if (item.childs) {
              item.childs.map((child) => {
                child.childs = [];
                allMenu.map((element) => {
                  if (element.parentId === child.id) {
                    child.childs.push(element);
                  }
                });
              });
            }
          });
          _this.userMenuList = allMenu;
          _this.menuList = menuList;
          _this.loading.roleMenuListLoading = false;
        });
      });
    },
    getApps() {
      const _this = this;
      const para = {pageIndex: 1, pageSize: 9999999};
      AppAPI.listApp(para).then(({res}) => {
        _this.pageInfo.pageIndex = res.data.data.currentPage;
        _this.appList = res.data.data.data;
        _this.appList.map(function (item) {
          item.tokenshow = "**************";
        });
        if (_this.filters.appId === "") {
          _this.filters.appId = _this.appList[0].id;
          para.appId = _this.filters.appId;
        }
      });
    },

    //获取选中的角色权限列表
    getRoleData(item) {
      const childsType = typeof item.childs;
      const _this = this;
      const newItem = this.addForm;
      newItem.menuId = item.id;
      newItem.menuName = item.name;
      const params = {userId: newItem.userId, menuId: newItem.menuId, pageIndex: 1, pageSize: 2147483647};
      _this.loading.menuOperationLoading = true;
      _this.loading.roleMenuDataLoading = true;
      UserMenuOperationAPI.listUserMenuOperation(params).then(function ({res}) {
        const list = res.data.data.data;
        list.map(function (element) {
          element.isEdit = false;
          element.editRoleDataLoading = false;
          element.deleteRoleDataLoading = false;
        });
        _this.userMenuDataList = list;
        _this.loading.roleMenuDataLoading = false;
      });
      _this.menuOperationList = [];
      _this.getMenuOperationSelectedList({userId: _this.addForm.userId, menuId: _this.addForm.menuId, pageIndex: 1, pageSize: 999999}).then(function (res) {
        _this.getMenuOperatorList({menuId: _this.addForm.menuId, pageIndex: 1, pageSize: 999999}).then(function (datas) {
          const menuOperationList = datas;
          menuOperationList.map(function (element) {
            element.type = -1;
            res.map(function (item) {
              if (item.menuOperationId === element.id) {
                element.type = item.type;
                element.userMenuOperation = item.id;
              }
            });
          });
          _this.menuOperationList = menuOperationList;
          _this.loading.menuOperationLoading = false;
        });
      });
    },

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  created() {
    this.getUserLists();
    this.getApps();
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    return {
      addDialogVisible: false,
      filters: {
        key: "", account: "", name: "", appId: ""
      },
      appList: [],
      pageInfo: {pageIndex: 1, pageSize: 10, count: 0},
      loading: {listLoading: false, addRoleDataLoading: false, roleLoading: false, roleMenuListLoading: false, menuOperationLoading: false, roleMenuDataLoading: false},
      addForm: {id: 0, userId: 0, roleName: "", menuName: "", menuId: 0, fieldName: "", symbol: "", value: "", menuOperation: [], menuOperationEdit: false, type: "-1"},
      addFormRules: {
        fieldName: [
          { required: true, message: "请填写字段名称", trigger: "blur" },
          { min: 1, max: 20, message: "请输入长度在1到20个字符", trigger: "blur" }
        ],
        symbol: [
          { required: true, message: "请选择运算符", trigger: "change" }
        ],
        value: [{ required: true, message: "请填写数值", trigger: "blur" },
          { min: 1, max: 20, message: "请输入长度在1到20个字符", trigger: "blur" }
        ]
      },
      userList: [], //角色列表 a list of roles
      userMenuList: [], //角色菜单列表 a list of a role menus
      userMenuDataList: [], //角色菜单信息列表
      menuList: [],
      menuOperationList: [],
      menuOperationSelected: [],
      selectedMenus: [],
      defaultProps: {
        label: "name",
        children: "childs"
      },
      switchButton: {name: "按钮", value: false}
    }
  }

  /*#endregion */

}
</script>
<style scoped lang="scss">
  @import "../../assets/styles/scss/views/user-button-rule/user-button-rule";
</style>
