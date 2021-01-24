/*
 * @Author: your name
 * @Date: 2021-01-19 22:39:51
 * @LastEditTime: 2021-01-20 23:13:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \deep-learing\learn-plug\code\src\kstore\kvuex.ts
 */
// 类似KVueRouter
let KVue: any;

// 实现Store类
class Store {
  private _vm : any;    // 用来做私有变量
  private _mutations: any; // 存储传入的mutation
  private _actions: any;
  // private getters: any;
  constructor(options: any) {
    // 响应式的state
    // this._vm = new KVue({
    //   data() {
    //     return {
    //       $$state: options.state
    //     }
    //   }
    // })

    // 保存mutation
    this._mutations = options.mutations;
    this._actions = options.actions;
    // 保存this到store实例上
    const store = this;
    const { commit, dispatch} = store;

    this.commit = function (type: string, payload: any) {
      console.log('已经重新挂载啦');
      commit.call(store,type, payload );
    };

    this.dispatch = function (type: string, payload: any) {
      dispatch.call(store, type, payload);
    }

    // 实现getters
    // this.getters = {};

    // for (let getter in options.getters) {
    //   console.log('设置不同的getters：', options.getters[getter].call(store, store));
    //   Object.defineProperty(this.getters, getter, {
    //     get() {
    //       console.log('执行get函数');
    //       return options.getters[getter].call(store, store);
    //     },
    //     set(value) {
    //       console.log('传入的新值：', value);
    //       console.log('传入的this：', this);
    //     }
    //   })
    // }

    // 给getters添加缓存
    const computed: any = {};
    for (let getter in options.getters) {
      computed[getter] = options.getters[getter].bind(store, store);
    }


    this._vm = new KVue({
      data() {
        return {
          $$state: options.state
        }
      },
      computed,
    })
    


  };

  get state() {
    return this._vm._data.$$state;
  };

  set state(v) {
    console.error('不要直接修改state的值');
  }

  get getters() {
    return this._vm;
  }

  // 定义commit方法去执行mutations里面定义的方法 -- 修改state里面的数据
  public commit(type: string, payload: any) {
    // 根据type获取对应的mutation -- 这样不能解决使用module后开启命名空间的情况
    const entry = this._mutations[type];

    if (!entry) {
      console.error('unknown mutation type!');
      return;
    }

    entry(this, payload);
  }

  // 定义dispatch方法进行执行
  public dispatch(type: string, payload: any) {
    // 根据type获取对应的actions -- 这样不能解决使用module后开启命名空间的情况
    const entry = this._actions[type];

    if (!entry) {
      console.error('unknown mutation type!');
      return;
    }

    return entry(this, payload);
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
        console.log('挂载到原型上的store：', this.$options.store);
      }
    }
  })
}


// 导出KVuex
export default {
  Store,
  install
}
