自动化测试环境搭建

1、安装nodejs

[nodejs下载（windows版本）](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi)

2、安装cnpm以及调试工具

`npm install -g cnpm --registry=https://registry.npm.taobao.org`

cnpm install -g node-inspector


3、安装macaca

`cnpm i macaca-cli -g`

`cnpm i macaca-chrome -g`

`cnpm i macaca-datahub -g`




4、下载demo代码

[Demo download](http://git.yonyou.com/iuaptest_macaca/sample)

5、运行一下

在命令行进入sample目录，初始化用例环境：`cnpm install`

现在，准备工作就已经做完了，执行sample用例:`npm run test`

高级篇：

编程篇

调试篇

`cnpm i -g devtool`   //只需要执行一次，下载调试工具devtool

`macaca server --verbose`   //启动服务？封装一下

6、非常常用关键字

it.only

7、API查询

[webdriver api](https://macacajs.github.io/macaca-wd)

[mocha api](https://macacajs.github.io/macaca-wd)






