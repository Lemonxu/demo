<template>
  <section>
    <!--#region 搜索条-->
    <xt-search @search="handleSearch">
      <el-select v-model="filters.appId" placeholder="请选择" class="search-box__input"  size="small" @change="handleSearch">
        <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="filters.roleName" placeholder="角色名称" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
      <el-input v-model="filters.roleCode" placeholder="角色编码" size="small" class="search-box__input" clearable @keyup.enter.native="handleSearch"></el-input>
      <template slot="actions">
        <el-button size="small" class="search-box__button" type="primary" @click="handleRefreshPermissions()">刷新权限</el-button>
      </template>
    </xt-search>

    <el-row :gutter="0">
      <el-col :span="6">
        <div class="grid-content bg-purple xt-height">
          <div class="xt-role-head">角色列表</div>
          <div class="xt-role-body" :loading="loading.listLoading">
            <el-table :data="roleList" highlight-current-row style="width: 100%;" @row-click="getRoleMenus"
                      :show-header="false">
              <el-table-column
                      prop="name"
                      align="center"
                      label="名称">
                <template slot-scope="scope">
                  <span><span style="font-size:12px;color:gray">[{{scope.row.code}}]</span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div v-for="item in roleList" class="xt-role-name" @click="getRoleMenus(item,this)" :class="addForm.roleId==item.id?'xt-role-name-active':''">{{item.name}}</div>-->

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
      <el-col :span="6">
        <div class="grid-content xt-height">
          <div class="xt-role-head">角色菜单</div>
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
                    @node-expand="nodeExpand"
                    :expand-on-click-node="true"
                    v-loading.lock="loading.roleMenuListLoading"
            >
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple xt-height" style="border-right: 1px solid #DFE6EC">
          <div class="xt-role-head" style="border-right:1px solid #DFE6EC;">
            权限信息
            <el-radio-group v-show="addForm.menuId==0?false:true" v-model="switchButton.name" size="small" @change="radioChange" style="float: right;line-height: 2.5rem">
              <el-radio-button label="数据" value="true"></el-radio-button>
              <el-radio-button label="按钮" value="false"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="xt-role-data-body" v-show="switchButton.value">
            <el-button type="primary" v-show="addForm.menuId==0?false:true" size="small" @click="addRoleData">
              <div class="xt-add-icon"><i class="el-icon-plus"></i>新增</div>
            </el-button>
            <div class="xt-role-data-list-body">
              <div class="xt-role-data-list-head" v-show="addForm.menuId==0?false:true">
                <el-col :span="6">字段名称</el-col>
                <el-col :span="6">运算符</el-col>
                <el-col :span="6">数值</el-col>
                <el-col :span="6">操作</el-col>
              </div>
              <div v-show="addForm.menuId==0?false:roleMenuDataList.length==0?true:false" class=" xt-no-data">暂无数据</div>
              <div v-for="(item,index) in roleMenuDataList" class="xt-role-data-list " v-loading.lock="loading.roleMenuDataLoading" :key="index">
                <el-col :span="6" class="xt-role-data">
                  <label v-show="!item.isEdit" class="bounceInLeft animated">{{item.fieldName}}</label>
                  <el-input v-show="item.isEdit" v-model="item.fieldName" size="small" auto-complete="off"></el-input>
                </el-col>
                <el-col :span="6" class="xt-role-data">
                  <label v-show="!item.isEdit" class="bounceInLeft animated">{{item.symbol}}</label>
                  <el-select v-show="item.isEdit" size="small" v-model="item.symbol" placeholder="请选择运算符" class="xt-width-full-width">
                    <el-option v-for="(item,index) in symbolList" :label="item.name" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6" class="xt-role-data">
                  <label v-show="!item.isEdit" class="bounceInLeft animated xt-text-hidden" :title="item.value">{{item.value}}</label>
                  <el-input v-show="item.isEdit" size="small" v-model="item.value" auto-complete="off" class="xt-width-full-width" style="margin-top: 0.3rem"></el-input>
                </el-col>
                <el-col :span="6" class="xt-role-data">
                  <el-button v-show="item.isEdit" size="mini" type="success" @click="editRoleDataSure(item)" icon="el-icon-check" :loading="item.editRoleDataLoading"></el-button>
                  <el-button v-show="item.isEdit" size="mini" type="danger" @click="editRoleDataCancel(item)" icon="el-icon-close"></el-button>
                  <el-button v-show="!item.isEdit" size="mini" type="info" @click="editRoleData(item)" icon="el-icon-edit"></el-button>
                  <el-button v-show="!item.isEdit" size="mini" type="danger" @click="deleteRoleData(item)" icon="el-icon-delete" :loading="item.deleteRoleDataLoading"></el-button>
                </el-col>
              </div>
            </div>
          </div>
          <div class="xt-role-data-body" v-show="!switchButton.value">
            <div class="xt-role-data-list-body" v-show="addForm.menuId==0?false:true" style="">
              <div class="xt-role-data-list-head">
                按钮权限选择
              </div>
              <div style="border: 1px solid #DFE6EC;height: 30rem" v-loading.lock="loading.menuOperationLoading">
                <el-checkbox v-for="item in menuOperationList" :label="item.id" :key="item.id" style="width: 30%;margin-left: 10%;margin-top: 0.5rem" :checked="item.checked" @change="checkBoxChange(item)">
                  {{item.name}}({{item.code}})
                </el-checkbox>

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
            <el-option v-for="item in symbolList" :label="item.name" :value="item.value" :key="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数值" prop="value">
          <el-input v-model="addForm.value" auto-complete="off" class="xt-width-full-width"></el-input>
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
import {RoleDataRuleAPI, RoleAPI, MenuOperationAPI, AppAPI, MenuAPI, RoleMenuOperationAPI, RoleMenuAPI} from "../../modules/xtp";

/*#endregion*/

export default{
  name: "RoleDataRule",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    /*按钮权限的保存删除事件*/
    checkBoxChange(item) {
      const _this = this;
      item.checked = !item.checked;
      if (item.checked === true) {
        const params = {data: JSON.stringify({roleId: _this.addForm.roleId, menuId: _this.addForm.menuId, menuOperationId: item.id})};
        RoleMenuOperationAPI.insertRoleMenuOperation(params).then(function ({res}) {
          if (res.data.code === 1) {
            item.roleMenuOperation = res.data.data.id;
          } else {
            _this.$message({
              type: "error",
              message: "保存失败!"
            });
            const newAddForm = _this.addForm;
            const newParams = {
              id: newAddForm.menuId,
              name: newAddForm.menuName,
              roleId: newAddForm.roleId,
              roleName: newAddForm.roleName,
              fieldName: newAddForm.fieldName,
              symbol: newAddForm.symbol,
              value: newAddForm.value
            };
            _this.getRoleData(newParams);
          }
        });
      } else {
        RoleMenuOperationAPI.deleteRoleMenuOperation({id: item.roleMenuOperation}).then(function ({res}) {
          if (res.data.code === 1) {
            //  liukomg
          } else {
            _this.$message({
              type: "error",
              message: "保存失败!"
            });
            const paramsAddForm = _this.addForm;
            const newParams = {
              id: paramsAddForm.menuId,
              name: paramsAddForm.menuName,
              roleId: paramsAddForm.roleId,
              roleName: paramsAddForm.roleName,
              fieldName: paramsAddForm.fieldName,
              symbol: paramsAddForm.symbol,
              value: paramsAddForm.value
            };
            _this.getRoleData(newParams);
          }
          item.deleteRoleDataLoading = false;
        });
      }
    },

    //数据与按钮切换事件
    radioChange(value) {
      const list = [{name: "数据", value: true}, {name: "按钮", value: false}];
      const _this = this;
      list.map(function (element) {
        if (element.name === value) {
          _this.switchButton.value = element.value;
        }
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
          const newParams = {
            id: paramsAddForm.menuId,
            name: paramsAddForm.menuName,
            roleId: paramsAddForm.roleId,
            roleName: paramsAddForm.roleName,
            fieldName: paramsAddForm.fieldName,
            symbol: paramsAddForm.symbol,
            value: paramsAddForm.value
          };
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
              const newParams = {id: params.menuId, name: params.menuName, roleId: params.roleId, roleName: params.roleName, fieldName: params.fieldName, symbol: params.symbol, value: params.value};
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

    /*展开角色菜单事件*/
    nodeExpand(item) {
      const _this = this;
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
            const newParams = {
              id: paramsAddForm.menuId,
              name: paramsAddForm.menuName,
              roleId: paramsAddForm.roleId,
              roleName: paramsAddForm.roleName,
              fieldName: paramsAddForm.fieldName,
              symbol: paramsAddForm.symbol,
              value: paramsAddForm.value
            };
            _this.getRoleData(newParams);
          }
          item.deleteRoleDataLoading = false;
        });

      });
    },

    /*#endregion*/

    /*#region 操作函数(handle)*/
    handleSearch() {
      this.getRoles();
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
      this.getRoles();
    },
    //数据当前页
    handleCurrentChange(val) {
      this.pageInfo.pageIndex = val;
      this.getRoles();
    },
    //删除
    handleRefreshPermissions: function () {
      this.$confirm("确认要刷新所有用户的权限吗?", "提示", {
        type: "warning"
      }).then(() => {
        RoleMenuOperationAPI.refreshPermissions().then(({res}) => {
          this.listLoading = false;
          this.$message({
            message: "刷新成功",
            type: "success"
          });
          this.getRoles();
        });
      });
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
        RoleMenuOperationAPI.listRoleMenuOperation(params).then(({res}) => {
          resolve(res.data.data.data);
        });
      });
    },

    //获取角色列表
    getRoles() {
      const _this = this;
      const para = Object.assign({}, this.pageInfo);
      para.name = _this.filters.roleName !== "" ? "%" + _this.filters.roleName + "%" : "";
      para.code = _this.filters.roleName !== "" ? "%" + _this.filters.roleCode + "%" : "";
      para.appId = _this.filters.appId;
      this.loading.listLoading = true;
      this.addForm = {id: 0, roleId: 0, roleName: "", menuName: "", menuId: 0, fieldName: "", symbol: "", value: 0, menuOperationEdit: false};
      _this.roleList = [];
      RoleAPI.listRole(para).then(({res}) => {
        _this.pageInfo.pageIndex = res.data.data.currentPage;
        _this.pageInfo.count = res.data.data.count;
        const list = res.data.data.data;
        _this.roleList = list;
        _this.roleMenuList = [];
        _this.roleMenuDataList = [];
        _this.menuList = [];
        _this.loading.listLoading = false;
      });
    },

    //获取选中的角色的菜单列表
    getRoleMenus(item, event) {
      const _this = this;
      const newItem = this.addForm;
      newItem.roleId = item.id;
      newItem.roleName = item.name;
      newItem.menuId = 0;
      newItem.menuName = "";
      _this.roleMenuList = [];
      _this.roleMenuDataList = [];
      const params = {pageIndex: 1, pageSize: 2147483647, roleId: newItem.roleId};
      return new Promise(function (resolve, reject) {
        _this.loading.roleMenuListLoading = true;
        RoleMenuAPI.listRoleMenu(params).then(function ({res}) {
          const list = res.data.data ? res.data.data.data : [];
          const menuIdList = [];
          list.map(function (element) {
            menuIdList.push(element.menuId);
          });
          _this.roleMenuList = list;
          _this.selectedMenus = menuIdList;
          _this.getMenus();
        });
      });
    },
    getApps() {
      const _this = this;
      return new Promise((resolve, reject) => {
        const para = {pageIndex: 1, pageSize: 9999999};
        AppAPI.listApp(para).then(({res}) => {
          _this.appList = res.data.data.data;
          _this.appList.map(function (item) {
            item.tokenshow = "**************";
          });
          if (_this.filters.appId === "") {
            _this.filters.appId = _this.appList[0].id;
            para.appId = _this.filters.appId;
          }
          resolve();
        });
      });
    },

    //获取菜单列表
    getMenus() {
      const _this = this;
      return new Promise(function (resolve, reject) {
        const para = {pageIndex: 1, pageSize: 999999};
        MenuAPI.listMenu(para).then(({res}) => {
          const menuArr = res.data.data.data;
          const count = menuArr.length;
          const menuList = [];
          menuArr.map(function (item) {
            item.childs = [];
            _this.roleMenuList.map((element) => {
              if (item.id === element.menuId) {
                menuList.push(item);
              }
              if (element.parentId === item.id) {
                const newItem = {id: element.menuId, code: element.menuCode, name: element.menuName, parentId: element.parentId, roleId: element.roleId};
                item.childs.push(newItem);
              }
            });
            if (item.childs) {
              item.childs.map((child) => {
                child.childs = [];
                _this.roleMenuList.map((element) => {
                  if (element.parentId === child.id) {
                    const newItem = {id: element.menuId, code: element.menuCode, name: element.menuName, parentId: element.parentId, roleId: element.roleId};
                    child.childs.push(newItem);
                  }
                });
              });
            }
          });
          _this.menuList = menuList;
          _this.loading.roleMenuListLoading = false;
        });
      });
    },

    //获取选中的角色权限列表
    getRoleData(item) {
      const childsType = typeof item.childs;
      const _this = this;
      const newItem = this.addForm;
      newItem.menuId = item.id;
      newItem.menuName = item.name;
      const params = {roleId: newItem.roleId, menuId: newItem.menuId, pageIndex: 1, pageSize: 2147483647};
      _this.loading.menuOperationLoading = true;
      _this.loading.roleMenuDataLoading = true;
      RoleDataRuleAPI.listRoleDataRule(params).then(function ({res}) {
        const list = res.data.data.data;
        list.map(function (element) {
          element.isEdit = false;
          element.editRoleDataLoading = false;
          element.deleteRoleDataLoading = false;
        });
        _this.roleMenuDataList = list;
        _this.loading.roleMenuDataLoading = false;
      });
      _this.menuOperationList = [];
      _this.getMenuOperationSelectedList({roleId: _this.addForm.roleId, menuId: _this.addForm.menuId, pageIndex: 1, pageSize: 999999}).then(function (res) {
        _this.getMenuOperatorList({menuId: _this.addForm.menuId, pageIndex: 1, pageSize: 999999}).then(function (datas) {
          const menuOperationList = datas;
          menuOperationList.map(function (element) {
            element.checked = false;
            res.map(function (item) {
              if (item.menuOperationId === element.id) {
                element.checked = true;
                element.roleMenuOperation = item.id;
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
    this.getApps().then(() => {
      this.getRoles();
    });
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    return {
      addDialogVisible: false,
      filters: {
        key: "", roleName: "", roleCode: "", appId: ""
      },
      appList: [],
      pageInfo: {pageIndex: 1, pageSize: 10, count: 0},
      loading: {listLoading: false, addRoleDataLoading: false, roleLoading: false, roleMenuListLoading: false, menuOperationLoading: false, roleMenuDataLoading: false},
      addForm: {id: 0, roleId: 0, roleName: "", menuName: "", menuId: 0, fieldName: "", symbol: "", value: "", menuOperation: [], menuOperationEdit: false},
      addFormRules: {
        fieldName: [
          {required: true, message: "请填写字段名称", trigger: "blur"},
          {min: 1, max: 20, message: "请输入长度在1到20个字符", trigger: "blur"}
        ],
        symbol: [
          {required: true, message: "请选择运算符", trigger: "change"}
        ],
        value: [{required: true, message: "请填写数值", trigger: "blur"},
          {min: 1, max: 20, message: "请输入长度在1到20个字符", trigger: "blur"}
        ]
      },
      roleList: [], //角色列表 a list of roles
      roleMenuList: [], //角色菜单列表 a list of a role menus
      roleMenuDataList: [], //角色菜单信息列表
      menuList: [],
      menuOperationList: [],
      menuOperationSelected: [],
      selectedMenus: [],
      symbolList: [{name: "空", value: "null"}, {name: "不为空", value: "IsNotNull"}, {name: "等于", value: "="}, {name: "不等于", value: "<>"}, {name: "大于", value: ">"}, {name: "不等于", value: ">="}, {
        name: "小于",
        value: "<"
      }, {name: "小于等于", value: "<="}, {name: "In", value: "In"}, {name: "NotIn", value: "NotIn"}, {name: "Between", value: "Between"}],
      defaultProps: {
        label: "name",
        children: "childs"
      },
      switchButton: {name: "数据", value: true}
    }
  }

  /*#endregion */

}
</script>
<style scoped lang="scss">
  @import "../../assets/styles/scss/views/role-data-rule/role-data-rule.scss";
</style>
