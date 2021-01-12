/*
 * @Author: your name
 * @Date: 2021-01-10 22:40:52
 * @LastEditTime: 2021-01-10 23:02:23
 * @Description: In User Settings Edit
 * @FilePath: \deep-learing\components\src\store\modules\tagBars.ts
 */
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store/index.ts';
import { Route } from 'vue-router';

@Module({ name: 'tagbars', dynamic: true, namespaced: true, store })
class Tagbars extends VuexModule {
  // 显示在导航栏上面的数据
  public list: any[] = [];
  public test: any[] = [{ a: 1 }, { b: 2 }];

  public get tagBars() {
    return this.list;
  }

  // 当前选中选中的页面
  public get selectTag() {
    let tag;
    this.list.forEach((e: any) => {
      console.log('循环选择的数据：', e)
      if (e.isSelect) {
        tag = e;
      }
    })
    return tag || "";
  }

  // 往数组中添加路由,添加到最后一个
  @Mutation
  public AddTag(route: any) {
    this.list.push(route);
  }

  // 数组中元素
  @Mutation
  public DelTag(index: number) {
    this.list.splice(index, 1);
    console.log('删除之后的导航数组:', this.list)
  }

  // 删除数组中的全部数据
  @Mutation
  public DelAllTags() {
    this.list = [];
  }

}

export const TagbarsMoudle = getModule(Tagbars);