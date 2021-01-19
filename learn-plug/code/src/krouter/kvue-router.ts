import { VNode } from "vue/types/umd";
import TestContainer from "@/components/test.vue";

let KVue: any;


// 插件
// 1.实现一个install方法

class KVueRouter {
  // 类的静态方法
  private static install(Vue: any) {
    // 保存传进来的Vue的构造函数  --  Vue的构造函数有什么作用呢？
    // 在打包的时候不希望把Vue也打包了，所以让Vue构造函数是传进来的并保存下来进行引用
    KVue = Vue;
    console.log('install方法传递的参数：', KVue);

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
            this.$slots.default);
        },
        props: {
          to: {
            type: String,
            required: true
          }
        },
        components: {
          TestContainer: TestContainer
        }
      });
    // router-view就是一个容器，把组件给渲染出来
    Vue.component('router-view', {
      render(h: any) {
        // 我们需要获取路由表再根据路由地址进行不同的渲染
        // 1.获取路由实例
        const routes = this.$router.$options;
        const current = this.$router.current;
        const route = routes.find((route: any) => {
          console.log('find函数的值：', route, current);
          return route.path === current;
        })
        const comp = route ? route.component : null;
        console.log('匹配的路由：', comp);

        return h(comp);
      }
    });
  }

  // 定义 this 变量区域  Start

  private $options: any;    // router插件的定义的选项
  private current: string;

  // 定义 this 变量区域  End

  // KVueRouter的构造函数
  constructor(options: any) {
    console.log('constructor函数：', KVue);
    this.$options = options;
    this.current = '/';
    // 第三步  Start
    // 做一个响应式的 url 地址，让地址变化的时候可以同步进行监听和变化
    const initial: string = window.location.hash.slice(1) || '/';
    KVue.util.defineReactive(this, 'current', initial);

    // 监听事件 hashChange 事件, 要注意此时监听事件的函数中 this 的指向问题，通常函数会谁调用就指向谁，但是我们需要的是在函数中的this指向 KVueRouter 类，所以需要改变类的指向。
    window.addEventListener('hashchange', this.onHashChange.bind(this));

    // 监听 load 事件，重新刷新页面的时候进行处理
    window.addEventListener('load', this.onHashChange.bind(this));
  };

  private onHashChange(event: Event) {
    this.current = window.location.hash.slice(1);
    console.log('当前的路由地址：', this.current);
  }

};




export default KVueRouter;