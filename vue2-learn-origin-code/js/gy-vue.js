// 立即执行函数
;(function (global, factory) {
	// 遵循UMD规范
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory()
	} else if (typeof define === 'function' && define.amd) {
		define(factory)
	} else {
		global = global || self
		global.Vue = factory()
	}
})(this, function () {
	;('use strict')

	/**
	 * Always return false.
	 */
	var no = function (a, b, c) {
		return false
	}

	function noop(a, b, c) {}

	/**
	 * Return the same value.
	 */
	var identity = function (_) {
		return _
	}

	var LIFECYCLE_HOOKS = [
		'beforeCreate',
		'created',
		'beforeMount',
		'mounted',
		'beforeUpdate',
		'updated',
		'beforeDestroy',
		'destroyed',
		'activated',
		'deactivated',
		'errorCaptured',
		'serverPrefetch',
	]

	var config = {
		//  自定义合并策略的选项 (在core/util/options中使用)
		// $flow-disable-line
		optionMergeStrategies: Object.create(null),
		// 取消 Vue 所有的日志与警告。
		silent: false,
		// 设置为 false 以阻止 vue 在启动时生成生产提示。
		productionTip: 'development' !== 'production',
		// 配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。
		devtools: 'development' !== 'production',
		// 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上。
		performance: false,
		// 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
		errorHandler: null,
		// 为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略。
		warnHandler: null,
		// 须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。
		ignoredElements: [],
		// 给 v-on 自定义键位别名。
		// $flow-disable-line
		keyCodes: Object.create(null),
		// 檢查是否是保留標籤，以便不能將其註冊為組件。這是平臺相關的，可能會被覆蓋。
		isReservedTag: no,
		// 檢查是否是保留屬性，使其不能用作組件 prop。這是平臺相關的，可能會被覆蓋。
		isReservedAttr: no,
		//  檢查標記是否為未知元素。平臺相關的。
		isUnknownElement: no,
		// 獲取元素的名稱空間
		getTagNamespace: noop,
		//  解析平台保留标签
		parsePlatformTagName: identity,
		// 检查一个attribute 必须使用property，例如：value，平台依赖标签
		mustUseProp: no,
		// 异步执行更新。被Vue单元测试使用，
		// 如果设置为false,将会显著降低性能
		async: true,
		// 因遗留原因而被暴露
		_lifecycleHooks: LIFECYCLE_HOOKS,
	}

	var warn = noop

	function Vue(options) {
		if (!(this instanceof Vue)) {
			warn('Vue is a constructor and should be called with the `new` keyword')
			warn('Vue是一个构造函数，并且应该用new关键字来调用')
		}
		this._init(options)
	}

	function initMixin(Vue) {
		console.log('我是 initMixin')
		Vue.prototype._init = function (options) {
			console.log('我是 _init函数')
		}
	}
	function stateMixin(Vue) {
		console.log('我是 stateMixin')
	}
	function eventsMixin(Vue) {
		console.log('我是 eventsMixin')
	}
	function lifecycleMixin(Vue) {
		console.log('我是 lifecycleMixin')
	}
	function renderMixin(Vue) {
		console.log('我是 renderMixin')
	}

	// 定义Vue原型上的init方法(内部方法)
	initMixin(Vue)
	// 定义原型上跟数据相关的属性方法
	stateMixin(Vue)
	//定义原型上跟事件相关的属性方法
	eventsMixin(Vue)
	// 定义原型上跟生命周期相关的方法
	lifecycleMixin(Vue)
	// 定义渲染相关的函数
	renderMixin(Vue)
	return Vue
})
