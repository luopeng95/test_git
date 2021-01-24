// Vue中响应式的原理
function defineReactive(obj, key, val) {
    // 先进行深度监听
    observe(val);

    Object.defineProperty(obj, key, {
        get() {
            console.log('访问了get请求');
            return val;
        },
        set(newVal) {
            console.log('访问了set：', newVal);
            if (val !== newVal) {
                val = newVal;

                // 如果新设置的值也是对象的话，需要再进行设置监听
                observe(newVal);

                // 执行更新 updater -- 将来真正做 DOM 操作的
                update();
            }
        },
    });
}

// 深度监听
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }

    new Observer(obj);
}

// 代理函数
function proxy(vm) {
    Object.keys(vm.$data).forEach((key) => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key];
            },
            set(newVal) {
                vm.$data[key] = newVal;
            },
        });
    });
}

// 定义KVue类
class KVue {
    constructor(options) {
        // 收集类依赖
        this.$options = options;

        // 处理数据
        this.$data = options.data;
        observe(this.$data);

        // 对this进行代理
        proxy(this);
    }
}

// 定义Observer类，每一个响应式数据都伴生一个observer实例
class Observer {
    constructor(value) {
        this.value = value;

        // 判断value是对象还是数据
        this.walk(value);
    }

    walk(obj) {
        Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
    }
}
