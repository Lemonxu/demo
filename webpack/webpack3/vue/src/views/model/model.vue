<template>
  <section>
    <iframe name="iframe" :id="$route.path" :src="path" style="width: 100%;height:auto;min-height: 800px;border: 0px;overflow-y:hidden;margin-bottom: 2rem"></iframe>
    <!--<html-panel url="http://119.37.194.4:11142/xtp/#/model/imm/basic/version-info"></html-panel>-->
    <!--<button @click="getIframeContent">测试</button>-->
  </section>
</template>
<script>

/*#region 导入函数*/
import { UrlGet } from "../../utils/utils";
import HtmlPanel from "./html-panel";

/*#endregion*/

export default{
  name: "Model",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    // getIframeContent() {
    //   console.log(window);
    //   const iframe = document.getElementById(this.$route.path);
    //   const iwindow = iframe.contentWindow;
    //   const idoc = iwindow.document;
    //   console.log("window", iwindow);//获取iframe的window对象
    //
    //   console.log("document", idoc); //获取iframe的document
    //
    //   console.log("html", idoc.documentElement);//获取iframe的html
    //
    //   console.log("head", idoc.head); //获取head
    //
    //   console.log("body", idoc.body); //获取body
    // },
    getIframePath() {
      const params = this.$route.params;
      let srcPath = "", modelPath = "", lastPath = "";
      if (params.modelName) {
        if (params.pageName) {
          if (params.childModelName) {
            modelPath = `/model/${params.modelName}/${params.childModelName}/${params.pageName}`;
            srcPath = `${params.modelName}/#/${params.childModelName}/${params.pageName}`;
            lastPath = `#/${params.childModelName}/${params.pageName}`;
          } else {
            modelPath = `/model/${params.modelName}/${params.pageName}`;
            srcPath = `${params.modelName}/#/${params.pageName}`;
            lastPath = `#/${params.pageName}`;
          }
        } else {
          modelPath = `/model/${params.pageName}`;
          srcPath = `${params.modelName}`;
          lastPath = "";
        }
      }
      let query = "";
      if (this.$route.query) {
        Object.keys(this.$route.query).map((queryItem) => {
          query = `${query}&${queryItem}=${this.$route.query[queryItem]}`;
        });
      }
      this.$store.dispatch("getMenuOperation", this.$route.fullPath || modelPath).then(({operation}) => {
        this.path = `http://${window.APP_SETTING_WEB.SERVER_HOST}:${window.APP_SETTING_WEB.SERVER_PORT}/${params.modelName}/?v=${Math.random()}&xtit_oauth=${localStorage.getItem("isautologin") ? (localStorage.getItem(window.TOKEN_KEY) || "") : (sessionStorage.getItem(window.TOKEN_KEY) || "")}${this.$route.hash ? this.$route.hash : ""}&operation=${operation}${query}${lastPath}`;
        console.log(this.path, operation);
      });
    }

    /*#endregion*/

    /*#region 数据提交事件*/

    /*#endregion*/

    /*#region 操作函数(handle)*/

    /*#endregion*/

    /*#region 获取数据*/

     /*#endregion*/

  },

  /*#region 生命周期函数(created、mount、等)*/
  created() {
    // this.getIframePath();
  },

  /*#endregion*/

  /*#region 注册绑定数据*/
  components: {
    HtmlPanel
  },
  data() {
    return {path: ""};
  },
  watch: {
    "$route.params": {
      immediate: true,
      handler(val) {
        this.getIframePath();
      }
    }
  }

  /*#endregion */

}
</script>
<style scoped></style>
