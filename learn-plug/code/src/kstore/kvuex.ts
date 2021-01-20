/*
 * @Author: your name
 * @Date: 2021-01-19 22:39:51
 * @LastEditTime: 2021-01-19 22:54:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \deep-learing\learn-plug\code\src\kstore\kvuex.ts
 */
// 类似KVueRouter
let KVue: any;

// 实现Store类
class Store {
  private _vm : any;    // 用来做私有变量
  constructor(options: any) {
    // 响应式的state
    this._vm = new KVue({
      data() {
        return {
          $$state: options.state
        }
      }
    })

  };

  get state() {
    return this._vm._data.$$state;
  };

  set state(v) {
    console.error('不要直接修改state的值');
  }

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
