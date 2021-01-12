/*
 * @Author: 罗鹏
 * @Date: 2021-01-10 22:40:52
 * @LastEditTime: 2021-01-10 23:10:43
 * @Description: 路由文件
 * @FilePath: \deep-learing\components\src\routes\index.ts
 */
import { Vue } from "vue-property-decorator";
import Router, { Route, } from "vue-router";
const config = require("../../config/index.json");
Vue.use(Router);


const router: any = new Router({
  mode: "history",
  base: config.baseUrl,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */"@/views/index/index.vue"),
    }
  ],
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
export default router