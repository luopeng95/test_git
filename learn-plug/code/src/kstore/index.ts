import Vue from "vue";
import Vuex from "./kvuex";

Vue.use(Vuex);

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store({
  state: {
    a: 1
  },
  mutations: {},
  actions: {},
  getters: {},
});