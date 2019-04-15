<template>
  <section>
    <el-button size="small" type="warning" @click="handleAdd()" icon="plus">新增子菜单</el-button>
    <el-table
      :data="data.children"
      v-loading="data.loading"
      style="width: 100%" border @expand-change="expandHandle">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <menu-tag :data="scope.row" @handleAdd="handleAdd" @handleEdit="handleEdit" @handleDel="handleDel"></menu-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="菜单编码" minWidth="115">
        <template slot-scope="scope">
          <span class="xt-text-hidden" :title="scope.row.code">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称" minWidth="115">
        <template slot-scope="scope">
          <span class="xt-text-hidden" :title="scope.row.name">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        align="center"
        label="菜单图标" minWidth="115">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="链接地址" minWidth="115">
        <template slot-scope="scope">
          <span :title="scope.row.url" class="xt-text-hidden">{{scope.row.url}}</span>
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
        label="是否启用">
        <template slot-scope="scope">
          {{scope.row.displayFlag ? "√" : "×"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" minWidth="120">
        <template slot-scope="scope">
          <el-button
            title="编辑"
            type="success"
            size="small"
            @click="handleEdit(scope.row)" icon="el-icon-edit"></el-button>
          <el-button
            title="删除"
            size="small"
            type="danger"
            @click="handleDel(scope.row, data)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>

  /*#region 导入函数*/
  import {MenuAPI} from "../../../modules/xtp";

  /*#endregion*/

  export default{
    name: "MenuTag",
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

      /*#endregion*/

      /*#region 操作函数(handle)*/
      handleAdd(data) {
        this.$emit("handleAdd", data || this.data);
      },
      handleEdit(row) {
        this.$emit("handleEdit", row, this.data);
      },
      handleDel(row, data) {
        this.$emit("handleDel", row, data);
      }

      /*#endregion*/

      /*#region 获取数据*/

      /*#endregion*/

    },

    /*#region 生命周期函数(created、mount、等)*/

    /*#endregion*/

    /*#region 注册绑定数据*/

    data() {
      return {
        menuList: [],
        loading: false
      };
    },
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    }

    /*#endregion */

  };
</script>
<style scoped></style>
