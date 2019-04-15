<template>
  <div id="app" :data-theme="`${value}-theme`" :class="`${value}-theme`">

    <!--<el-button @click="handleClick('default')">default</el-button>-->
    <!--<el-button @click="handleClick('red')">red</el-button>-->
    <!--<el-button @click="handleClick('yandang')">yandang</el-button>-->
    <!--<div class="block">我是测试啊啊啊</div>-->
    <router-view/>
  </div>
</template>

<script>
export default{
    name: "App",
    methods: {
        handleClick(theme) {
          this.$store.dispatch("setTheme", theme);
        }
    },
    data() {
        return {}
    },
    computed: {
      value: {
        get() {
          return this.$store.getters.theme || "default"
        }
      }
    }
}
</script>

<style lang="scss">
  // 默认主题
  $default-theme : (
          base-color: #ddd,
          border-color: #000
  );
  //红色主题
  $red-theme : (
          base-color: red,
          border-color: red
  );
  //定义映射集合
  $themes: (
          default-theme: $default-theme,
          red-theme: $red-theme
  );
  @mixin base-background(){
    @each $themename , $theme in $themes {
      [data-theme = '#{$themename}'] & {
        background: map-get($map: $theme, $key: base-color )
      }
    }
  }
  .block {
    width: 1000px;
    @include base-background();
  }
</style>
