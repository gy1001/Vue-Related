(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // Object.defineProperty 只能劫持已经存在的属性，后增的或者删除的不知道
      // vue2 里面会为此单独写一些 api $set $delete
      if (Array.isArray(data)) ; else {
        this.walk(data);
      }
    }
    return _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象，对属性依次进行劫持

        // “重新定义”属性
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);
  }(); // 这里有闭包
  function defineReactive(target, key, value) {
    // 属性劫持
    // 如果是对象，再次进行深度遍历响应
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        // 取值的时候，会执行 get
        return value;
      },
      set: function set(newValue) {
        // 修改的时候，会执行 set
        if (newValue === value) {
          return;
        }
        value = newValue;
        observe(value);
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || !data) {
      return; // 只对对象进行劫持
    }
    // 如果一个对象已经被劫持过了，那就不需要再劫持了
    // 要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断是否被劫持成功

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 获取所有的选项
    if (opts.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(this) : data;

    // 对数据进行劫持
    // vue2 中采用了一个 api defineProperty
    vm._data = data;
    observe(data);

    // 将 vm._data 用 vm 来代理了

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  // 就是给 Vue 添加 Init 方法
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 用户初始化操作
      // vm vm.$options 就是获取用户的配置

      // 我们使用的 vue 的时候 $nextTIck $data $attr 。。。
      var vm = this;
      vm.$options = options; // 将用户的选项挂载到实例上

      // 初始化状态
      initState(vm);
    };
  }

  function Vue(options) {
    // options 就是用户的选项值
    this._init(options); // 默认就调用了 __init
  }
  initMixin(Vue); // 扩展了 init 方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
