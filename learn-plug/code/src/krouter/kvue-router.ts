import { VNode } from "vue/types/umd";

let KVue;


// 插件
// 1.实现一个install方法

class KVueRouter {
  // 类的静态方法
  private static install(Vue: any) {
    // 保存传进来的Vue的构造函数  --  Vue的构造函数有什么作用呢？
    // 在打包的时候不希望把Vue也打包了，所以让Vue构造函数是传进来的并保存下来进行引用
      KVue = Vue;

    // 1.挂载$router -- 从 new Vue 的过程中可以看到有传入router这个参数，并且在使用中 this.$router指的就是我们传入的子类。所以我们要挂载的就是生成的这个子类，但是在使用 Vue.use()的时候，vue 实例还没有被创建。这样子我们就需要在实例已经被创建成功之后再进行挂载。
      Vue.mixin({
        beforeCreate() {
          // 全局混入，将来在组件实例化的时候才执行
          // 此时router实例已经存在了
          // this指的是组建的实例
          // 因为做的是全局混入，所以在所有的组件实例中都会生效
            if (this.$options.router) {
              // 将定义的router实例进行挂载
                Vue.prototype.$router = this.$options.router;
            }
        },
      })

    // 2.实现两个全局组件
      Vue.component('router-link', {
        // h是createElement函数，在实际执行的时候会被传进来
        render(h: any) {
          return h(
            'a',
            {
              attrs: {
                href: `#${this.to}`,
              },
            },
            'link');
        },
        props: {
          to: {
            type: String,
            required: true
          }
        },
      });
      Vue.component('router-view', {
        render(h: any) {
          return h('div', 'view');
        }
      });
  }

  // KVueRouter的构造函数
  constructor() {

  };


};




export default KVueRouter;