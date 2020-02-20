# web-error-monitor

## Types && ideas

* **js error**  -->  window.onerror
* **statics files**  -->  addEventListener('error')
* **ajax request**  -->  xhr.prototype.send xhr.onreadystatechange
* **console/jquery/setTimeout/setInterval**  -->  wrap func using call/apply and arguments
* **performance**  -->  performance.timing/getEntries (window.onload)

## Usage

```
    // 1. through browser

    <script src="../dist/main.js"></script>
    <script>
        window.JSMONITOR.config.requestHeaders = {
            'SOMTHING-CLIENT': 'H5',
            'SOMTHING-VERSION': '0.0.1'
        }
        window.JSMONITOR.config.ext = function ext() {
            return {
                userId: localStorage.userId
            }
        }
        window.JSMONITOR.init(window)
    </script>

    // 2. npm库加载
    import JSMONITOR from 'web-error-monitor'

```

## config
```
// src/config.js
// 通过window.JSMONITOR.config修改
```

## (Thinking) To design a sdk framework

1. Module class es6
2. Module cmd
3. function and prototype (oo)
4. object --> `this` problem, scope and structrue

## release
> npm run build:prod 打包并上传至阿里云
> 在.release文件会输出生成的js文件名，用于记录和引用
