
/*
初始化自动化测试环境，不要改动
参数说明:
        driver:即 WebDriver，驱动浏览器工作的接口类
        browser:当前检测到的浏览器名字，比如chrome
        assert：断言类
*/

const {fs,assert,opn,path,moment,KEY_MAP,wd,pkg,diffImage,browser,initWebSiteURL} = require('../lib/basedesktop.js');

/*************************************************************************************
* 用例编写，从这里开始
* 作者：
* 功能描述：
* 日期：
*/
describe('某应用1用例描述', function() {
//用例执行超时时间，10分钟
this.timeout(10 * 60 * 1000);

//初始化需要加载的web站点URL，initWebSiteURL（url,端口）
var driver = initWebSiteURL("localhost", "1234");
//子用例，可以有多个
describe('子用例1描述', function() {

    it('#0 基础部分：打开百度首页', function() {
        const url = 'https://www.baidu.com';
        return driver
            .get(url)
            .sleep(3000)
    });

    it('#1 基础部分：测试百度首页基本功能', function() {
        return driver
            //常用三种获取dom节点的方法,更多请参考与本样例代码在一起的文档
            //by id，ID作为业务唯一标识，推荐使用这个方法获取UIDOM对象
            .elementById('kw')
            .sendKeys('用')
            //by xpath，DOM结构发生改变，此行代码也要响应调整
            .elementByXPath("//input[@name='wd']")
            .sendKeys("友")
            //by class,一般不能唯一定位一个DOM元素
            .elementByClassName("s_ipt")
            .sendKeys("云")
            //
            .sleep(1000)
            .elementById('su')
            .click()

            .sleep(1000)
            .source()
            .then(function(html) {
                if (html.indexOf('用友云-数字企业智能服务') >= 0) { //此处文字为Demo数据，应来自mock服务
                    assert.ok(true);
                    driver.elementByLinkText("用友云-数字企业智能服务").click(); //新测试分支
                    driver.sleep(1000);
                } else {
                    assert.ok(false);
                }
            // html.should.containEql('用友云');
            }

        )
    });
});

describe('子用例2描述', function() {
    it('#0 进阶部分：测试本地页面', function() {
        const url = path.join(__dirname, './pages/desktop-sample.html');
        return driver
            .get(`file://${url}`)
            .sleep(1000)
            .execute(`document.querySelector('#select').selectedIndex = 2`)
            .sleep(1000)
            .elementById('select')
            /*
            .getProperty('value')
            .then(value => {
              assert.ok(value);
            })
            */
            .mouseEvent('#hover_text', 'mouseover')
            .elementById('hover_text')
            .getComputedCss('color')
            .then(value => {
                assert.ok(value);
            })
            // https://github.com/macacajs/macaca-electron#windowalert
            .execute(`
          var e = document.createElement('div');
          e.id = 'alert_msg';
          window.alert = function() {
            e.innerHTML = JSON.stringify(arguments[0]);
            document.body.appendChild(e);
          };
        `)
            .elementById('alert_button')
            .click()
            .elementById('alert_msg')
            .text()
            .then(value => {
                assert.equal(value, 'this message is from alert');
            })
            .sleep(3000);
    });



    it('#1 高级部分：涉及到iframe，以及如何做结果图片比较', function() {
        const iframeURL = 'https://xudafeng.github.io/use-tinyMce-textEditor/';

        return driver
            .get(iframeURL)
            .sleep(3000)
            .frame('mce_0_ifr')
            .elementById('tinymce')
            .sendKeys('这是一段测试')
            .sleep(3000)
            .takeScreenshot()
            .then(imgData => {
                const newImg = new Buffer(imgData, 'base64');
                const screenshotFolder = path.resolve(__dirname, '../screenshot');
                fs.writeFileSync(path.join(screenshotFolder, 'diff.png'), newImg.toString('binary'), 'binary')

                const oldImgPath = path.join(screenshotFolder, 'origin.png');
                const diffImgPath = path.join(screenshotFolder, 'diff.png');
                return true || diffImage(oldImgPath, newImg, 0.1, diffImgPath);
            })
            .then(result => {
                result.should.be.true();
            })
            .catch(e => {
                console.log(e);
            });
    });

    after(() => {
        return driver
            .quit();
    });
});





/******************************************系统回调方法****************************************************/
//start
//用例执行前回调的方法
before(() => {
    //
    console.log("here");
    //
    return driver
        .init({
            platformName: 'desktop',
            browserName: 'chrome', //browser,
            userAgent: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0 Safari/537.36 Macaca Custom UserAgent`,
            deviceScaleFactor: 2
        })
        .setWindowSize(1280, 800);
});
//
/*
afterEach(function() {
    return driver
        .customSaveScreenshot(this)
        .sleep(1000)
});
*/
//用例执行后回调的方法
after(function() {
    opn(path.join(__dirname, '..', 'reports', 'index.html'));
});
//end

});
