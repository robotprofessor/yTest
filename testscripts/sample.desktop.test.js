'use strict';

/*
初始化自动化测试环境，不要改动
参数说明:
        driver:即 WebDriver，驱动浏览器工作的接口类
        browser:当前检测到的浏览器名字，比如chrome
        assert：断言类
*/
require('should'); //加载should组件，断言类
const {fs, assert, opn, path, moment, KEY_MAP, wd, pkg, diffImage, browser, initWebSiteURL} = require('../lib/basedesktop.js');

/*************************************************************************************
* 用例编写，从这里开始
* 作者：
* 功能描述：
* 日期：
*/


describe('testscripts/sample.test.js', function() {
this.timeout(5 * 60 * 1000);
//初始化需要加载的web站点URL，initWebSiteURL（url,端口）
var driver = initWebSiteURL("localhost", "3456");

const attachmentRoot = "//172.16.72.88/质量管理部/自动化脚本附件";
const initialURL = 'http://172.16.72.88/sample';


describe('d1', function() {

    it('#0 login', function() {

        return driver
            .get(initialURL) // 打开网页
            .sleep(1000) // 等待1000毫秒
            .elementByLinkText("登录").click() // 点击登录链接
            .sleep(1000)
            .elementById('username').clear().type('user01') // 在id为username的输入框里清空并输入user01
            .elementByXPath("//span[text()='密码:']/../span/input").type("pass01") // 按xpath找到的input输入框里输入pass01
            .sleep(1000)
            .elementByXPath("//button[text()='登录']").click()
            .sleep(1000)
            .hasElementByXPath("//a[text()='page1']").then((value) => value.should.be.equal(true)) // 断言 判断登录后的页面里有page1
            .hasElementByXPath("//a[text()='page100']").then((value) => value.should.be.equal(false)) // 断言 判断登录后的页面里没有page100
            .waitForElementByXPath("//a[text()='page2']") // 简单的判断是否存在某个元素可以直接有waitFor
            .elementByXPath("//a[text()='page1(new window)']")
            .getAttribute('target').then((value) => value.should.be.equal('new')) // 判断链接'page1(new window)'的target为new
            .waitForElementByXPath("//a[text()='page1(new window)' and @target='new']") // 判断属性也可以用waitFor
            .sleep(1000);
    });

    it('#1 page1', function() {
        const currentTime = moment().format("YYYYMMDD_HHmmss"); // 获取当前时间,格式为'年月日_时分秒'
        const name = 'auto_name_' + currentTime; // 根据时间生成名字
        return driver
            .elementByLinkText("page1").click()
            .sleep(1000)
            .elementById("name").type(name)
            .elementById("sex1").click()
            .elementById("birthday").then((element) => driver.execute("arguments[0].value = arguments[1]", [element, "2000-01-01"])) // 只读的元素用js设置值,如日期选择
            .elementByXPath("//span[text()='省份:']/../select/option[text()='河北']").click()
            .elementById("hobby1").click()
            .elementById("hobby3").click()
            .elementByXPath("//span[text()='头像:']/../input").type(attachmentRoot + '/test/a.xls') // 上传文件，在输入框里输入文件的路径
            .sleep(1000)
            .frame("iframe_id01") // 切到iframe里，括号里的是id
            .elementByXPath("//textarea").clear().type("test123中文测试") // textarea在iframe里，需要先切到iframe里
            .frame() // 切到iframe外
            .sleep(1000)
            .elementByXPath("//button[text()='提交']").click()
            .sleep(1000);
    });

    it('#2 page1(new window)', function() {
        const portalURL = initialURL + '/portal.html';
        let c1;
        return driver
            .get(portalURL)
            .then(async () => c1 = (await driver.windowHandles()).length) // 记录当前打开的窗口数c1
            .elementByLinkText("page1(new window)").click() // 点击链接会打开一个新窗口
            .sleep(1000)
            .then(async () => should((await driver.windowHandles()).length).be.equal(c1 + 1)) // 判断当前打开的窗口数比c1大1，说明上一步的动作打开了一个新窗口
            .switchWindow() // 切到最后一个窗口即新打开的窗口里
            .elementById("name").type("张三") // 修改当前窗口里的元素
            .frameTo("//span[text()='内容:']/../iframe") // 如果iframe没有id，可以这样切iframe
            .elementByXPath("//textarea").clear().type("test123中文测试") // 修改iframe内的元素
            .frame() // 切出iframe
            .elementById("name").clear().type("李四") // 修改iframe外的元素，需要先切出iframe
            .sleep(1000)
            .close() // 关闭当前窗口, 做这一步最好验证一下打开新窗口的动作是否真的打开了一个新窗口
            .switchWindow() // 切换到最后一个窗口
            .sleep(1000)
            .elementByLinkText("page1").click() // 操作当前窗口里的元素
            .sleep(1000);
    });

    // 提取出addUser方法
    async function addUser(name, sex, province, hobbys, photo, content) {
        return driver
            .elementByLinkText("page1").click()
            .sleep(1000)
            .elementById("name").type(name)
            .elementById(sex).click()
            .elementByXPath("//span[text()='省份:']/../select/option[text()='" + province + "']").click()
            .then(async () => {
                for (let i in hobbys) {
                    await driver.elementById(hobbys[i]).click();
                }
                return driver;
            })
            .elementByXPath("//span[text()='头像:']/../input").type(attachmentRoot + '/test/' + photo) // 上传文件，在输入框里输入文件的路径
            .sleep(1000)
            .frame("iframe_id01") // 切到iframe里，括号里的是id
            .elementByXPath("//textarea").clear().type(content) // textarea在iframe里，需要先切到iframe里
            .frame() // 切到iframe外
            .sleep(1000)
            .elementByXPath("//button[text()='提交']").click()
            .sleep(1000)
            .elementByXPath("//a[text()='返回']").click()
            .sleep(1000);
    }

    it('#3 批量添加用户', function() {
        const portalURL = initialURL + '/portal.html';
        return driver
            .get(portalURL)
            .sleep(1000)
            .then(async () => {
                await addUser('name_01', 'sex1', '河北', ['hobby1', 'hobby3'], '头像1.png', 'test123中文测试_01');
                await addUser('name_02', 'sex2', '北京', ['hobby2', 'hobby3'], '头像2.png', 'test123中文测试_02'); // 调用多次addUser

                const users = [['name_03', 'sex1', '北京', ['hobby1'], '头像1.png', 'test123中文测试_01'],
                    ['name_04', 'sex2', '河北', ['hobby2'], '头像2.png', 'test123中文测试_02']];
                for (let i in users) { // 用循环和数组的方式
                    let user = users[i];
                    await addUser(user[0], user[1], user[2], user[3], user[4], user[5]);
                }

                for (let i = 0; i < 2; i++) { // 用循环，只有名字不一样
                    await addUser('auto_name_' + i, 'sex1', '河北', ['hobby1', 'hobby3'], '头像1.png', 'test123中文测试');
                }
                return driver;
            })
            .sleep(1000)
    });

    it('#4 key test', function() {
        const portalURL = initialURL + '/portal.html';
        return driver
            .get(portalURL)
            .sleep(1000)
            .elementByLinkText("page1").click()
            .elementById("name").click()
            .keys("abc")
            .sleep(1000)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.ARROW_RIGHT}`)
            .keys(`${KEY_MAP.SPACE}`)
            .sleep(1000)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.ARROW_DOWN}`)
            .sleep(1000)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.SPACE}`)
            .sleep(1000)
            .keys(`${KEY_MAP.TAB}`)
            .keys(`${KEY_MAP.SPACE}`)
            .sleep(1000)
            .keys(`${KEY_MAP.ENTER}`)
            .sleep(1000)
            .get(portalURL)
            .elementByLinkText("page4").click()
            .sleep(1000)
            .keys(`${KEY_MAP.PAGE_DOWN}`)
            .sleep(1000)
            .keys(`${KEY_MAP.PAGE_DOWN}`)
            .sleep(1000)
            .keys(`${KEY_MAP.END}`)
            .sleep(1000)
            .keys(`${KEY_MAP.PAGE_UP}`)
            .sleep(1000)
            .keys(`${KEY_MAP.HOME}`)
            .sleep(1000)
            .keys(`${KEY_MAP.ARROW_RIGHT}`)
            .keys(`${KEY_MAP.ARROW_RIGHT}`)
            .sleep(1000)
            .keys(`${KEY_MAP.CONTROL}a`) // 更多 https://github.com/macacajs/webdriver-keycode/blob/master/lib/webdriver-keycode.js
            .sleep(1000)
    });

});

before(() => {
    return driver
        .init({
            platformName: 'desktop',
            browserName: browser,
            userAgent: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0 Safari/537.36 Macaca Custom UserAgent`,
            deviceScaleFactor: 2
        })
        .setImplicitWaitTimeout(15000)
        .maximize();
});
afterEach(function() {
    return driver
        .customSaveScreenshot(this)
        .sleep(1000)
});
after(() => {
    return driver
        .quit();
});
});

