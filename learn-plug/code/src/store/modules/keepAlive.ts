import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store/index.ts';



// 参数一：module名称，开启命名空间后会以name为命名空间
// 参数二：是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。使用动态加载的时候index.ts文件不用修改
// 参数三：是否开启命名空间，如果你的模块很多，强烈建议开启
// 参数四：挂载的store目标

@Module({ name: 'keepAlive', dynamic: true, namespaced: true, store })
class KeepAlive extends VuexModule {
  // 存储当前缓存路由的数组，也就是显示在导航栏上面的数据
  public keepAlives: Array<string | null | undefined> = [];

  // 往数组中添加路由,添加到最后一个
  @Mutation
  public AddRoute(routeName: string | null | undefined) {
    this.keepAlives.push(routeName);
  }

  // 数组中删除路由
  @Mutation
  public DelRoute(routeName: string | null | undefined) {
    const index: number = this.keepAlives.indexOf(routeName);
    if (index !== -1) {
      this.keepAlives.splice(index, 1);
      console.log('删除之后的缓存路由数组：', this.keepAlives);
    }
  }

  // 删除数组中的全部路由
  @Mutation
  public DelAllRoute() {
    this.keepAlives = [];
  }

}

export const KeepAliveMoudle = getModule(KeepAlive);