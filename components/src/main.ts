import { Vue } from "vue-property-decorator";
import "reset.css";
import "@/styles/index.scss";
// import "@/plug/cookies.ts";
import "@/plug/element.ts";
// import "@/plug/vconsole";
import "@/plug/axios.ts";
import "default-passive-events";
// 引入手淘rem
import '@/utils/flexible.js';
// import 'default-passive-events';

import App from "./App.vue";
import router from "@/routes";
import store from "@/store";
import api from "@/api";
import { getAndroidPermission } from "@/utils/utils";

Vue.prototype.$http = api;
// Vue.prototype.$permission = getAndroidPermission(); // 安卓权限
Vue.config.productionTip = false;

Vue.filter('strip', function strip(num: number, precision: number = 12) {
  return +parseFloat(num.toPrecision(precision));
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount("#app");

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el: any) {
    // 聚焦元素
    el.focus()
  }
})