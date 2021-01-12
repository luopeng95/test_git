import Axios from "axios";
import Vue from "vue";

// 创建一个axios实例，并设置baseurl
const instance = Axios.create({
  baseURL: "",
  timeout: 6000
})
Vue.prototype.$axios = instance;