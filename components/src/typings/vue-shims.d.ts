import Vue from "vue";
import VueRouter, { Route } from "vue-router";
// import { Route } from "vue-router";

// 扩充
declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $http: any;
    $permission: any;
    $axios: any;
  }
}
