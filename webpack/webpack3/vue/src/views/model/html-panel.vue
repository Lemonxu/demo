<template>
  <section>
    <!--<mu-circular-progress :size="40" v-if="loading"/>-->
    <div v-html="html"></div>
  </section>
</template>
<script>

/*#region 导入函数*/
import {_axios} from "../../modules/api";

/*#endregion*/

export default{
  name: "HtmlPanel",
  methods: {

    /*#region 自定义函数(组件change事件等)*/
    load (url) {
      if (url && url.length > 0) {
        console.log(url);
        // 加载中
        this.loading = true;
        const param = {
          // accept: "text/html, text/plain"
          "Content-Type": "application/x-www-form-urlencoded",
          responseType: "json",
          oauth: "whosyourdaddy"
        };
        _axios.get(url, param).then((response) => {
                  console.log(response);
                  this.loading = false;
                  // 处理HTML显示
                  this.html = response.data;
                })
                .catch(() => {
                  this.loading = false;
                  this.html = "加载失败";
                });
      }
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
  mounted () {
    this.load(this.url);
  },

  /*#endregion*/

  /*#region 注册绑定数据*/

  data() {
    return {}
  },
  // 使用时请使用 :url.sync=""传值
  props: {
    url: {
      required: true
    }
  },
  watch: {
    url (value) {
      console.log(value);
      this.load(value);
    }
  }

  /*#endregion */

}
</script>
<style scoped></style>
