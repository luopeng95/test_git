<template>
  <div id="app">
    <!-- <keep-alive :max='20'> -->
    <router-view></router-view>
    <!-- <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" /> -->
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
  /* Watch */
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
