/*
 * @Author: your name
 * @Date: 2021-01-24 10:00:13
 * @LastEditTime: 2021-01-25 07:18:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \deep-learing\learn-plug\myVue\kvue.js
 */
// Vue中响应式的原理

// 数组响应式
// 1.替换原数组原型上的七个方法
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto);

['push', 'pop', 'shift', 'unshift'].forEach((method) => {
    arrayProto[method] = function () {
        // 原始操作
        originalProto[method].apply(this, arguments);
        // 覆盖操作：通知更新
        console.log('数组执行 ' + method + '操作:');
    };
});

// 对象响应式
function defineReactive(obj, key, val) {
    // 先进行深度监听
    observe(val);

    // 创建dep
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        get() {
            // console.log('访问了get请求');
            // 判断当前是不是watcher发起的收集依赖请求
            Dep.target && dep.addWatcher(Dep.target);
            return val;
        },
        set(newVal) {
            // console.log('访问了set：', newVal);
            if (val !== newVal) {
                val = newVal;

                // 如果新设置的值也是对象的话，需要再进行设置监听
                observe(newVal);

                // 通知watcher进行更新
                dep.notify();
            }
        },
    });
}

// 深度监听
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }

    // 判断传入的obj类型
    if (Array.isArray(obj)) {
        // 覆盖原型，替换变更操作
        obj.__proto__ = arrayProto;
        // 对数组内部原因执行响应化
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; ++i) {
            observe(obj[i]);
        }
    } else {
        new Observer(obj);
    }
}

// 将$data中的key代理到KVue的实例上去
// 代理函数
function proxy(vm, data) {
    Object.keys(data).forEach((key) => {
        Object.defineProperty(vm, key, {
            get() {
                return data[key];
            },
            set(newVal) {
                data[key] = newVal;
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
        proxy(this, this.$data);
        proxy(this, this.$options.methods);

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
        el.childNodes.forEach((node) => {
            if (this.isElement(node)) {
                // console.log('编译元素', node.nodeName);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                // console.log('编译插值表达式：', node.textContent);
                this.compileText(node);
            }

            // 递归判断
            if (node.childNodes) {
                this.compile(node);
            }
        });
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
        Array.from(nodeAttrs).forEach((attr) => {
            const attrName = attr.name;
            const exp = attr.value;
            // console.log('属性名字：', attrName);
            // 判断这个属性的类型
            if (this.isDirective(attrName)) {
                let dir = attrName.substring(2);
                const dirs = dir.split(':');
                // 执行指令
                this[dirs[0]] && this[dirs[0]](node, exp, dirs[1]);
            } else if (attrName.indexOf('@') === 0) {
                // 判断是否是@绑定的事件
                let eventName = attrName.substring(1);
                this['on'] && this['on'](node, exp, eventName);
            }
        });
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

    // on指令, node--节点元素，exp--事件的函数名字
    on(node, exp, eventName) {
        console.log('绑定事件');
        // 先取到绑定的事件名字，再给元素绑定事件
        console.log('取到的事件名字：', eventName, exp);
        console.log(this.$vm[exp]);
        node.addEventListener(eventName, this.$vm[exp].bind(this.$vm));
    }

    // 动态绑定创建更新函数以及对应实例 更新函数，收集依赖。
    update(node, exp, dir) {
        let that = this.$vm;
        const keyArys = exp.split('.');
        const length = keyArys.length - 1;
        for (let i = 0; i < length; ++i) {
            that = that[keyArys[i]];
        }

        // 初始化
        const fn = this[dir + 'Updater'];
        fn && fn(node, that[keyArys[length]]);

        // 更新
        new Watcher(that, keyArys[length], function (val) {
            fn && fn(node, val);
        });
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

        // 先设置一下Dep的target，对应在get中定义的Dep.target。然后再读一下值触发一下get方法进行依赖收集
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
    }

    // 管家调用
    update() {
        // 传入当前的最新值给更新函数
        this.updateFn.call(this.vm, this.vm[this.key]);
    }
}

class Dep {
    constructor() {
        this.watchers = [];
    }

    // 收集依赖
    addWatcher(watcher) {
        this.watchers.push(watcher);
    }

    // 执行更新
    notify() {
        this.watchers.forEach((watcher) => {
            // 通知所有的watcher进行更新操作
            watcher.update();
        });
    }
}
