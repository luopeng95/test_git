// 类似KVueRouter
let KVue: any;

// 实现Store类
class Store {
  constructor(options: any) {

  };
};


// 实现install方法
function install(Vue: any) {
  KVue = Vue;

  // 挂载到Vue的原型上
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  })
}


// 导出KVuex
export default {
  Store,
  install
}
