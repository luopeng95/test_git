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
    }
  })
}

function update() {
  app.innerHTML = obj.foo;
}