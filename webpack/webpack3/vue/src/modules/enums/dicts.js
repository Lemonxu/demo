//数据字典类型定义
const DictType = {
  materialColor: "MaterialColor", //物料颜色
  materialInCategory: "MaterialInCategory", //物料入库类型
  materialOutCategory: "MaterialOutCategory", //物料出库类型
  productColor: "ProductColor", //成品颜色
  productInCategory: "ProductInCategory", //成品入库类型
  productOutCategory: "ProductOutCategory", //成品出库类型
  unit: "Unit"//计量单位
};

const OrganizeList = [
  {value: "1", key: "一级组织"},
  {value: "2", key: "二级组织"},
  {value: "3", key: "三级组织"},
  {value: "4", key: "四级组织"},
  {value: "5", key: "五级组织"}
];

export {
  DictType,
  OrganizeList
};
