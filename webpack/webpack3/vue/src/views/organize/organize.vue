<template>
  <section>
    <!--#region 页面主要列表-->

    <div>
      <el-button type="primary" size="mini" icon="plus" @click="handleAddFormData()">新增</el-button>
      <div class="xt-body">
        <div class="xt-left">
          <div class="xt-left-head">
            组织架构
          </div>
          <div class="xt-left-list">
            <el-tree :data="organizeList" node-key="id" :props="defaultProps" style="height: 625px;overflow: auto;border:none;"
                     @current-change="handleNodeClick" :highlight-current="true" lazy :load="nodeLoad" @node-expand="nodeExpand" @node-collapse="nodeCollapse" :default-expanded-keys="defaultExpandKeys"></el-tree>
            <el-row>
              <el-col :span="24" class="toolbar">
                <el-pagination small style="float:right;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageIndex" :page-size="pageInfo.pageSize" layout="prev, pager, next" :total="pageInfo.count"></el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="xt-right">
          <div class="xt-right-head">
            结构详情
          </div>
          <!--已选择的数据展示-->
          <div v-show="!(formData.id===0&&formData.parentId===0)">
            <div class="xt-right-body">
              <div class="xt-form-head">
                修改{{formData.fullName}}
              </div>
              <div class="xt-form">
                <el-form ref="formData" :model="formData" label-width="80px" :rules="formRules" >
                  <el-row style="margin-top: 1rem">
                    <el-col :span="6">
                      <el-form-item label="编码" prop="code" style="margin-bottom: 1rem">
                        <el-input size="small" v-model="formData.code" placeholder="请输入编码" :maxlength="20" :disabled="true" ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="名称" prop="fullName" style="margin-bottom: 1rem">
                        <el-input size="small" v-model="formData.fullName" placeholder="请输入名称" :maxlength="20" :disabled="!formData.isEdit"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="组织级别"  style="margin-bottom: 1rem">
                        <el-select v-model="formData.level" size="small" placeholder="请选择组织级别" style="width: 100%" :disabled="!formData.isEdit">
                          <el-option :key="index" v-for="(item, index) in levelList" :label="item.key" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="地址" style="margin-bottom:1rem">
                        <el-input size="small" v-model="formData.address" placeholder="请输入地址" :maxlength="50" :disabled="!formData.isEdit"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row >
                    <el-col :span="6">
                      <el-form-item label="传真" style="margin-bottom:1rem">
                        <el-input size="small" v-model="formData.fax" placeholder="请输入传真" :maxlength="20" :disabled="!formData.isEdit"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="办公电话" style="margin-bottom: 1rem">
                        <el-input size="small" v-model="formData.outerPhone" placeholder="请输入办公电话" :maxlength="20" :disabled="!formData.isEdit"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="描述" style="margin-bottom: 1rem">
                        <el-input size="small" type="textarea" :rows="1" v-model="formData.description" placeholder="请输入描述" :maxlength="30" :disabled="!formData.isEdit"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-row>
                  <el-col :span="10" :offset="4">
                    <el-button type="primary" @click="submitFormData('formData',formData)" size="small" v-show="formData.isEdit">保存</el-button>
                    <el-button type="info" v-show="!formData.isEdit" size="small" @click="handleFormDataEdit(formData,'formData')">修改</el-button>
                  </el-col>
                  <el-col :span="10">
                    <el-button type="default" v-show="formData.isEdit" size="small" @click="handleFormDataCancel(formData)">取消</el-button>
                    <el-button type="danger" v-show="!formData.isEdit" size="small" @click="deleteData(formData,'formData')">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="xt-right-list" >
              <el-button type="primary" size="mini" icon="plus" @click="handleAddFormData('children')">新增</el-button>
              <div class="xt-list-head">
                类目子列表
              </div>
              <div class="xt-list-body">
                <el-table :data="formData.children"
                          max-height="365" border>
                  <el-table-column align="left" header-align="center" type="index" width="56" label="序号" >
                    <template slot-scope="scope">
                      {{(pageInfo.pageIndex-1)*pageInfo.pageSize+scope.$index+1}}
                    </template>
                  </el-table-column>
                  <el-table-column align="left" header-align="center" prop="code" label="组织编码" minWidth="120" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="left" header-align="center" prop="fullName" label="组织名称" minWidth="120" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="left" header-align="center" prop="address" label="地址" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="left" header-align="center" prop="accountBook" label="账套" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column align="left" header-align="center" label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button size="mini" type="warning" @click="handleEdit(scope.row,'addForm')">修改</el-button>
                      <el-button size="mini" type="danger"  @click="deleteData(scope.row,'children')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--#endregion-->

      <!--#region 新增修改页面-->

      <!--新增父级信息-->
      <el-dialog :title="addForm.id===0?'新增':'修改'" :visible.sync="dialog.addFormVisible" :close-on-click-modal="false" :modal-append-to-body="false" width="95%" top="20px">
        <el-form ref="addForm" :model="addForm" label-width="80px" :rules="formRules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编码" prop="code">
                <el-input size="small" v-model="addForm.code" name="code" placeholder="请输入编码" :maxlength="20" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="fullName">
                <el-input size="small" v-model="addForm.fullName" placeholder="请输入名称" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织级别">
                <!--prop="level">-->
                <el-select v-model="addForm.level" size="small" placeholder="请选择组织级别" style="width: 100%">
                  <el-option :key="index" v-for="(item, index) in levelList" :label="item.key" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址">
                <!--prop="address">-->
                <el-input size="small" v-model="addForm.address" placeholder="请输入地址" :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="传真">
                <!--prop="fax">-->
                <el-input size="small" v-model="addForm.fax" placeholder="请输入传真" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公电话">
                <!--prop="outerPhone">-->
                <el-input size="small" v-model="addForm.outerPhone" placeholder="请输入办公电话" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述" >
                <el-input size="small" type="textarea" :rows="2" v-model="addForm.description" placeholder="请输入描述" :maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancelFormData">取消</el-button>
          <el-button type="primary" @click.native="submitFormData('addForm',addForm)" :loading="loading.addLoading">提交</el-button>
        </div>
      </el-dialog>

    </div>
    <!--#endregion-->

  </section>
</template>
<script>

/*#region 导入函数*/
import {GetExitData} from "../../utils/utils";
import PagePlugIn from "../../mixins/page-plug-in";
import {OrganizeAPI} from "../../modules/xtp";
import {OrganizeList} from "../../modules/enums";

/*#endregion*/

export default{
  name: "Organize",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    nodeCollapse(row) {
      const childrenFun = (itemKey) => {
        const exitChildrenItem = this.defaultExpandKeys.find((defaultItem) => defaultItem === itemKey);
        if (exitChildrenItem) {
          this.defaultExpandKeys.remove(exitChildrenItem);
        }
        if (this.allExpandKeys.childrenIds[itemKey] && this.allExpandKeys.childrenIds[itemKey].length > 0) {
          this.allExpandKeys.childrenIds[itemKey].map((childKey) => {
            childrenFun(childKey);
          });
        }
      };

      const exitItem = this.defaultExpandKeys.find((defaultItem) => defaultItem === row.id);
      if (exitItem) {
        if (this.allExpandKeys.childrenIds[exitItem] && this.allExpandKeys.childrenIds[exitItem].length > 0) {
          this.allExpandKeys.childrenIds[exitItem].map((key) => {
            childrenFun(key);
            this.defaultExpandKeys.remove(exitItem);
          });
        } else {
          this.defaultExpandKeys.remove(exitItem);
        }
      }
    },
    nodeExpand(row, node) {
      if (row.parentId) {
        if (this.allExpandKeys.childrenIds[row.parentId]) {
          this.allExpandKeys.childrenIds[row.parentId].push(row.id);
        } else {
          this.allExpandKeys.childrenIds[row.parentId] = [row.id];
        }
      }
      const exitItem = this.defaultExpandKeys.find((defaultItem) => defaultItem === row.id);
      if (!exitItem) {
        this.defaultExpandKeys.push(row.id);
      }
    },
    nodeLoad(node, resolve) {
      if (node.level === 0) {
        resolve([]);
      } else {
        this.handleNodeClick(node.data, node, "load").then((list) => {
          resolve(list);
        });
      }
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
            OrganizeAPI.insertOrganize(params).then(({data}) => {
              if (data.code === 1) {
                this.$refs.formData.resetFields();
                this.getMainList();
                this.dialog.formDataVisible = false;
              }
              this.loading.addLoading = false;
            });
          } else {
            this.loading.addLoading = true;
            OrganizeAPI.updateOrganize(params).then(({data}) => {
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
    submitFormData(stringFormName, formName) {
      this.$refs[stringFormName].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(formName));
          delete params.children;
          if (params.id === 0) {
            this.loading.addLoading = true;
            OrganizeAPI.insertOrganize(params).then(({res}) => {
              if (res.data.code === 1) {
                this.getUpdate(stringFormName, formName);
              }
              this.loading.addLoading = false;
            });
          } else {
            this.loading.addLoading = true;
            OrganizeAPI.updateOrganize(params).then(({res}) => {
              if (res.data.code === 1) {
                this.getUpdate(stringFormName, formName);
              }
              this.loading.addLoading = false;
            });
          }
        }
      });
    },
    //删除
    deleteData(row, type) {
      this.$confirm("删除之后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type === "formData") {
          if (row.children.length === 0) {
            this.getDeleteAndUpdate(row, type);
          } else {
            this.$message({
              message: "请先删除其子项目",
              type: "error"
            });
          }
        } else {
          OrganizeAPI.listOrganize({pageSize: 999, parentId: row.id}).then(({res, list}) => {
            if (list.length === 0) {
              this.getDeleteAndUpdate(row, type);
            } else {
              this.$message({
                message: "请先删除其子项目",
                type: "error"
              });
            }
          });
        }
      });
    },

    /*#endregion*/

    /*#region 操作函数(handle)*/
    //修改

    handleEdit(row, type) {
      this.$refs.addForm && this.$refs.addForm.resetFields();
      this.addForm = JSON.parse(JSON.stringify(row));
      this.dialog.addFormVisible = true;
    },
    handleCancel() {
      this.dialog.formDataVisible = false;
    },
    handleAdd() {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData = OrganizeAPI.init();
      this.dialog.formDataVisible = true;
    },
    ///树形控件点击事件
    handleNodeClick(data, node, element) {
      return new Promise((resolve) => {
        this.$refs.formData && this.$refs.formData.resetFields();
        const newFormData = JSON.parse(JSON.stringify(data));
        if (data.children.length === 0) {
          OrganizeAPI.listOrganize({pageSize: 999, parentId: data.id}).then(({list}) => {
            newFormData.children = list;
            this.formData = newFormData;
            resolve(newFormData.children);
          });
        } else {
          resolve(data.children);
        }
      });
    },
    handleFormDataEdit(row, type) {
      row.isEdit = true;
      const oldItem = this.oldList.find((item) => item.id === row.id);
      if (!oldItem) {
        this.oldList.push(JSON.parse(JSON.stringify(row)));
      }
    },
    handleFormDataCancel(row) {
      row.isEdit = false;
      const oldItem = this.oldList.find((item) => item.id === row.id);
      if (oldItem) {
        Object.assign(row, oldItem);
        row.isEdit = false;
        this.oldList.remove(oldItem);
      }
    },
    handleCancelFormData() {
      this.dialog.addFormVisible = false;
    },
    handleAddFormData(type) {
      this.$refs.addForm && this.$refs.addForm.resetFields();
      let newForm = {};
      if (type) {
        newForm = JSON.parse(JSON.stringify({id: 0, code: "", fullName: "", type: this.formData.type, parentId: this.formData.id !== 0 ? this.formData.id : 0, levels: this.formData.id !== 0 ? (parseInt(this.formData.levels, 10) + 1) : 0, leafFlag: true, remark: ""}));
      } else {
        newForm = {...OrganizeAPI.init(), leafFlag: true, parentId: 0, levels: 0, id: 0};
        this.formData = {id: 0, parentId: 0};
      }
      this.addForm = newForm;
      this.dialog.addFormVisible = true;
    },


    /*#endregion*/

    /*#region 获取数据*/
    getMainList() {
      const params = {
        ...this.getParams(),
        parentId: 0
      };
      OrganizeAPI.listOrganize(params).then(({data, list}) => {
        this.organizeList = list;
        this.pageInfo.pageIndex = data.data ? data.data.currentPage : 1;
        this.pageInfo.count = data.data ? data.data.count : 0;
      });
    },
    getDeleteAndUpdate(row, type) {
      OrganizeAPI.deleteOrganize({id: row.id}).then(({res}) => {
        if (res.data.code === 1) {
          if (type === "formData") {
            this.formData = {...OrganizeAPI.init(), leafFlag: true};
            this.getMainList();
          } else {
            OrganizeAPI.listOrganize({pageSize: 999, parentId: this.formData.id}).then(({res, list}) => {
              this.formData.children = list;
            });
          }
        }
      });
    },
    getUpdate(stringFormName, formName) {
      if (stringFormName === "addForm") {
        this.$refs.addForm.resetFields();
        if (this.formData.id !== 0) {
          OrganizeAPI.listOrganize({pageSize: 999, parentId: this.formData.id}).then(({res, list}) => {
            this.formData.children = list;
            this.getMainList();
          });
        } else {
          this.getMainList();
        }
        this.dialog.addFormVisible = false;
      } else {
        formName.isEdit = false;
        this.getMainList();
      }
    }

    /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  created() {
    this.getMainList();
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    const checkCode = (rule, value, callback) => {
      GetExitData({code: value}, OrganizeAPI.listOrganize).then(({isEmpty, id}) => {
        if ((id === this.addForm.id && id !== this.formData.id) || (id !== this.addForm.id && id === this.formData.id)) {callback();} else {
          if (!isEmpty) {return callback(new Error("该编码已存在，请重新输入"));} else {callback();}
        }
      });
    };
    // const checkName = (rule, value, callback) => {
    //   GetExitData({fullName: value}, OrganizeAPI.listOrganize).then(({isEmpty, id}) => {
    //     if ((id === this.addForm.id && id !== this.formData.id) || (id !== this.addForm.id && id === this.formData.id)) {callback();} else {
    //       if (!isEmpty) {return callback(new Error("该名称已存在，请重新输入"));} else {callback();}
    //     }
    //   });
    // };
    return {
      defaultProps: {
        children: "children",
        label: "fullName",
        isLeaf: (data, node) => {//是否为底层
          if (data.leafFlag) {return true;} else {return false;}
        }
      }, //属性控件标题以及子列表数据绑定
      filters: {...OrganizeAPI.init(), parentId: 0},
      addForm: {...OrganizeAPI.init(), leafFlag: true},
      formData: {...OrganizeAPI.init(), leafFlag: true, parentId: 0},
      formChildrenData: {},
      formRules: {
        code: [
          {required: true, message: "请输入编码", trigger: "change"},
          { validator: checkCode, trigger: "blur" }
        ],
        fullName: [
          {required: true, message: "请输入名称", trigger: "change"},
          // { validator: checkName, trigger: "blur" }
        ]
      },
      dialog: {addFormVisible: false, templateVisible: false, templateSureVisible: false},
      loading: {addLoading: false, listLoading: false, inspectingLoading: false},
      organizeList: [],
      oldList: [],
      allExpandKeys: {parentIds: [], childrenIds: {}},
      defaultExpandKeys: [],
      inspectingTemplate: {inspectingTemplateId: null},
      inspectingType: {id: null},
      levelList: OrganizeList
    }
  },
  mixins: [PagePlugIn]

  /*#endregion */

}
</script>
<style scoped lang="scss">
  @import "../../assets/styles/scss/views/organize/organize";
</style>
