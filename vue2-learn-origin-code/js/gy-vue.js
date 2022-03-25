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
	'use strict'
	function Vue() {
		console.log('vue被调用了')
	}
	return Vue
})
