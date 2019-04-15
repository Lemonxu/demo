<template>
    <section v-loading="loading.listLoading">
      <!--工具条-->
        <el-col :span="24" style="padding-bottom: 8px;border-bottom: 1px solid #eeeeee">
          <el-button-group>
            <el-button type="primary" :disabled="editEnabled" @click="handleEdit" icon="el-icon-edit"
                       title="编辑"></el-button>
            <el-button type="warning" :disabled="!editEnabled" @click="handleCancel" title="取消"><i
              class="fa fa-mail-reply"></i></el-button>
            <el-button type="success" :disabled="!editEnabled" @click="handleSave" title="保存"
                       :loading="loading.saveLoading"><i class="fa fa-save"></i></el-button>
          </el-button-group>
        </el-col>
          <fieldset class="box" :disabled="!editEnabled" :key="index" v-for="(item, index) in menuList">
            <el-tree
              :check-strictly="false"
              :data="item"
              show-checkbox
              :default-expand-all="true"
              node-key="id"
              :ref="'tree_'+item[0].id"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </fieldset>
    </section>
</template>
<script>

/*#region 导入函数*/
import {MenuAPI, RoleMenuAPI} from "../../../modules/xtp";

/*#endregion*/

export default {
    name: "RoleMenu",
    methods: {

        /*#region 自定义函数(组件change事件等)*/

        /*#endregion*/

        /*#region 数据提交事件*/

        /*#endregion*/

        /*#region 操作函数(handle)*/
        handleEdit() {
          this.copySelectedMenus = JSON.parse(JSON.stringify(this.selectedMenuList));
          this.editEnabled = true;
        },
        //取消编辑
        handleCancel() {
          this.selectedMenuList = JSON.parse(JSON.stringify(this.copySelectedMenus));
          this.menuList.map((element) => {
            this.$refs[`tree_${element[0].id}`][0].setCheckedNodes(this.selectedMenuList);
          });
          this.editEnabled = false;
        },
        //保存
        handleSave() {
          const selectArr = [];
          this.menuList.map((item) => {
            const arr = Array.from(this.$refs["tree_" + item[0].id][0].getCheckedNodes());
            if (arr && arr.length > 0) {
              selectArr.push(item[0].id);
              arr.map((childrenItem) => {
                selectArr.push(childrenItem.id);
                const selectedItem = selectArr.find((selectArrItem) => selectArrItem === childrenItem.parentId);
                if (!selectedItem && childrenItem.parentId) {
                  selectArr.push(childrenItem.parentId);
                }
              });
            }
          });
          const menuIds = Array.from(new Set(selectArr.join(",").split(","))).join(",");
          console.log(menuIds, "menuIds");
          this.loading.saveLoading = true;
          RoleMenuAPI.updateRoleMenu({roleId: this.roleId, appId: this.appId, menuIds: menuIds}).then(({res}) => {
            this.loading.saveLoading = false;
            if (res.data.code === 1) {
              this.editEnabled = false;
              this.listLoading = false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getMainList().then(() => {
                this.getAllMenuList().then(({list}) => {
                  list.map((element) => {
                    this.$refs[`tree_${element[0].id}`][0].setCheckedNodes(this.selectedMenuList);
                  });
                });
              });
            } else {
              this.$message({
                message: "保存失败，请重试！",
                type: "error"
              });
              return true;
            }
          });
        },

        /*#endregion*/

        /*#region 获取数据*/
      async getMainList(appId) {
        const para = {pageIndex: 1, pageSize: 999999, roleId: this.roleId, appId: this.appId};
        await RoleMenuAPI.listRoleMenu(para).then(({res, list}) => {
          const selectedItemList = [];
            list.map((item) => {
              selectedItemList.push({id: item.menuId, name: item.menuName});
            });
            this.selectedMenuList = selectedItemList;
            this.roleMenuList = list;
            return true;
        });
      },
      async getAllMenuList() {
        await MenuAPI.listMenuWithChildren({pageIndex: 1, pageSize: 9999, appId: this.appId}).then(({list}) => {
          this.loading.listLoading = false;
          const childFun = (childItem) => {
            if (childItem.children.length >= 0) {
              const menuItem = this.selectedMenuList.find((item) => item.id === childItem.parentId);
              if (menuItem) {
                this.selectedMenuList.remove(menuItem);
              }
            }
            childItem.children.map((subItem) => {
              childFun(subItem);
            });
          };
          const menuList = [];
          list.map((element) => {
            childFun(element);
            menuList.push([element]);
          });
          this.menuList = menuList;
        });
        return {list: this.menuList};
      }

        /*#endregion*/

    },

    /*#region 生命周期函数(created、mount、等)*/
    created() {
      this.loading.listLoading = true;
      this.getMainList().then(() => {
        this.getAllMenuList().then(({list}) => {
          list.map((element) => {
            this.$refs[`tree_${element[0].id}`][0].setCheckedNodes(this.selectedMenuList);
          });
        });
      });
    },

    /*#endregion*/

    /*#region 注册绑定数据*/

    data() {
        return {
          loading: {listLoading: false, saveLoading: false},
          editEnabled: false,
          defaultProps: {
            label: "name",
            children: "children"
          },
          props: {
            label: "name",
            children: "children"
          },
          selectedMenus: [],
          selectedMenuList: [],
          copySelectedMenus: [],
          menuList: [],
          tempList: [],
          roleMenuList: []
        };
    },
    props: {
      roleId: {
        type: Number,
        default: 0
      },
      appId: {
        type: Number,
        default: 0
      }
    }

    /*#endregion */

};
</script>
<style scoped lang="scss">
  section {
    display: flex;
    flex-flow: row wrap;
  }

  section .box {
    width: 12rem;
    border-radius: 5px;
    border: 1px solid #1c8de0;
    box-shadow: 5px 5px 5px #999999;
    margin: .5rem;
    padding: 1rem;
  }
</style>
