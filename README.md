# Vue-Related

## mini-vue

mini-vue 练习

## vue-swiper-demo.html

使用 vue 写的左滑删除动画操作

## vue2-learn-origin-code

vue2 源码相关代码梳理

## vue3-learn-practice-demo

Vue3 从入门到实战 进阶式掌握完整知识体系

## imooc-ls

手写实现类系统命令 ls 的效果
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47dea7acb793499cbc5b6f5c5c1f675a~tplv-k3u1fbpfcp-watermark.image?)

## imooc-build

实现脚手架命令 imooc-build

### 命令：

- imooc-build start
- imooc-build dev

### 参数

- --config xxx.xxx.json/js
- -d/--debug 开始调试模式，终端显示所有日志

### 涉及功能

- 检测版本号，需要大于 '8.9.0'
- 默认端口 8080，被占用，提示用户使用新端口，根据提示选择 Y 即可
- 监听配置文件修改，重启服务
- 默认配置文件名：imooc-build.config(.json/.ejs/.js)
