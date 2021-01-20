<template>
  <div class="testContainer">
    <slot></slot>
    <div
      v-for="v in $attrs"
      :key="v"
      >
      {{v}}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";

@Component({
  name: "testContainer",
  inheritAttrs: false
})
export default class testContainer extends Vue {
  /* Data */
  private testValue: boolean = true;
  /* Hook */
  /* Watch */
  // @Prop() private a: number
  // @Prop() private b: number
  // @Prop() private c: number

  private fun() {
    console.log('测试privat');
  }
}
</script>

<style lang="scss">
  .testContainer {
    width: 100%;
    height: 100%;
  }
</style>
