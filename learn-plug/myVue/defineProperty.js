// Vue中响应式的原理

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log('访问了get请求');
            return val;
        },
        set(newVal) {
            console.log('访问了set：', newVal);
            if (val !== newVal) {
                val = newVal;

                // 执行更新 updater -- 将来真正做 DOM 操作的
                update();
            }
        },
    });
}

function update() {
    app.innerHTML = obj.foo;
}

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
