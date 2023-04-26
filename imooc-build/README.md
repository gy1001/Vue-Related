# imooc-build

实现脚手架命令 imooc-build

## 使用步骤

1. npm install
2. npm link
3. 执行命令即可

## 命令：

- imooc-build start
- imooc-build dev

## 参数

- --config xxx.xxx.json/js
- -d/--debug 开始调试模式，终端显示所有日志

## 涉及功能

- 检测版本号，需要大于 '8.9.0'
- 默认端口 8080，被占用，提示用户使用新端口，根据提示选择 Y 即可
- 监听配置文件修改，重启服务
- 默认配置文件名：imooc-build.config(.json/.ejs/.js)
