/*
 * @Author: 罗鹏
 * @Date: 2021-01-10 22:40:52
 * @LastEditTime: 2021-01-10 23:10:43
 * @Description: 路由文件
 * @FilePath: \deep-learing\components\src\routes\index.ts
 */
import { Vue } from "vue-property-decorator";
import KVueRouter from "./kvue-router";
const config = require("../../config/index.json");
Vue.use(KVueRouter as any);


const router = new KVueRouter([
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
  },{
    path: '/test',
    name: 'test',
    component: () => import('@/components/test.vue'),
  },
]);
export default router