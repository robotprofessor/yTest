## **一、四步搭建自动化测试环境**

#### 1、安装nodejs（已安装的，请忽略）

[nodejs下载（windows版本）](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi)

mac版本，自行百度！

#### 2、安装cnpm（已安装的，请忽略）

`npm install -g cnpm --registry=https://registry.npm.taobao.org`



#### 3、安装git（已安装的，请忽略）

自行百度

#### 4、安装 ytest

`cnpm i macaca-cli -g`

`cnpm i macaca-chrome -g`

`cnpm i ytest-cli -g`

ytest是基于nodejs的自动化测试脚手架，y是yonyou的缩写

## **二、自动化用例编程**

#### 1、创建用例工程

`ytest init -p mycase`

mycase是工程名字，可以改成实际工程名，注意保持英文

#### 2、运行一下

现在，准备工作就已经做完了，在命令行进入mycase目录，运行用例 test 或者 helloworld：

`cd mycase`

`npm run test`   

ok，到这里，就可以开启后续的用例编程了！

#### 3、编程篇：

非常常用关键字、调试技巧、常用API、等等内容，请参考：[《基于ytest开发用例实战篇》]()

it.only  整个测试方案只执行当前被标记的用例

。。。





## **三、附录：第三方API查询**

[webdriver api](https://macacajs.github.io/macaca-wd)

[mocha api](https://macacajs.github.io/macaca-wd)






