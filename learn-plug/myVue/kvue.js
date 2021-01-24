/*
 * @Author: your name
 * @Date: 2021-01-24 10:00:13
 * @LastEditTime: 2021-01-25 07:18:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \deep-learing\learn-plug\myVue\kvue.js
 */
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
                // update();
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

// 将$data中的key代理到KVue的实例上去
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

        // 进行编译
        new Compile(this.$options.el, this);
    }
}

// 定义Observer类，每一个响应式数据都伴生一个observer实例
class Observer {
    constructor(value) {
        this.value = value;

        // 判断value是对象还是数组
        this.walk(value);
    }

    walk(obj) {
        Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
    }
}

// 编译过程
class Compile {
    constructor(el, vm) {
        // 绑定组件实例
        this.$vm = vm;
        // 绑定元素
        this.$el = document.querySelector(el);

        // 编译模板
        if (this.$el) {
            this.compile(this.$el);
        }
        
    }

    // 编译方法 -- 接收一个根节点进行递归遍历，判断类型。
    compile(el) {
        el.childNodes.forEach(node => {
            if (this.isElement(node)) {
                console.log('编译元素', node.nodeName);
            } else if (this.isInter(node)) {
                console.log('编译插值表达式：', node.textContent);
                this.compileText(node);
            }

            // 递归判断
            if (node.childNodes) {
                this.compile(node);
            }
        })
    }

    // 插值文本进行编译
    compileText(node) {
        // 获取匹配表达式的值
        // console.log(this.$vm);
        // node.textContent = this.$vm[RegExp.$1];
        this.update(node, RegExp.$1, 'text');
    }

    // 编译元素
    compileElement(node) {
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            const attrName = attr.name;
            const exp = attr.value;

            // 判断这个属性的类型
            if (this.isDirective(attrName)) {
                const dir = attrName.subString(2);
                // 执行指令
                this[dir] && this[dir](node, exp);
            }
        })
    }

    // 判断一个节点是否是元素
    isElement(node) {
        return node.nodeType === 1;
    }

    // 判断插值表达式
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    // 判断是否是指令
    isDirective(attrName) {
        return attrName.indexOf('k-') === 0;
    }

    text(node, exp) {
        // node.textContent = this.$vm[exp];
        this.update(node, exp, 'text');
    }

    html(node, exp) {
        // node.innerHTML = this.$vm[exp];
        this.update(node, exp, 'html');
    }

    // 动态绑定创建更新函数以及对应实例 更新函数，收集依赖。
    update(node, exp, dir) {
        // 初始化
        const fn = this[dir + 'Updater'];
        fn && fn(node, this.$vm[exp]);

        // 更新
        new Watcher(this.$vm, exp, function() {
            fn && fn(node, val);
        })
    }

    // 文本更新实际操作的地方
    textUpdater(node, val) {
        node.textContent = val;
    }

    // html实际操作的地方
    htmlUpdater(node, val) {
        node.innerHTML = val;
    }
}

// Watcher：管理依赖，未来执行更新
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm;
        this.key = key;
        this.updateFn = updateFn;
    }

    // 管家调用
    update() {
        // 传入当前的最新值给更新函数
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}