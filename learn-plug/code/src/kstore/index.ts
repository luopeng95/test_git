import Vue from "vue";
import Vuex from "./kvuex";

Vue.use(Vuex);

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store({
  state: {
    a: 1
  },
  mutations: {
    add({state}: {state: any}) {
      state.a++
    },
  },
  actions: {
    add({ state }: {state: any}) {
      setTimeout(() => {
        state.a++
      }, 3000)
    }
  },
  getters: {
    testGet({ state }: {state: any}) {
      console.log('执行getters：', state);
      return state.a**2;
    }
  },
});