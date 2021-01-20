<template>
  <div id="app">
    <!-- <keep-alive :max='20'> -->
    <router-view ref="myView"></router-view>
    <router-link to="/index">index</router-link>
    <router-link to="/test">test</router-link>
    <!-- <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" /> -->
    <div @click="$store.commit('add')">
      同步修改：{{$store.state.a}}
    </div>

    <div @click="$store.dispatch('add')">
      异步修改：{{$store.state.a}}
    </div>

    <div>
      测试getters：{{$store.getters.testGet}}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  name: "App",
})
export default class App extends Vue {
  /* Data */
  /* Hook */
  private mounted() {
    // console.log('App页面展示当前view', (this.$refs as any).myView.$children[0].testValue);
  }
  /* Watch */
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
