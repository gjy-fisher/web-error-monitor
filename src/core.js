import utils from './utils'
import config from './config'
import report from './report'
import wrap from './wrap'
import performance from './perf'
import breadcrumbs from './breadcrumbs'

const M = {

    installed: false,

    config,

    environment: null,

    performance: null,

    init(global) {
        if (M.installed) {
            return
        }

        M.installed = true

        M.environment = global || window

        if (config.reportPerf) {
            M.environment.onload = function _onload() {
                performance.init()
            }
        }
        breadcrumbs.init(M.environment)
        M.windowOnError()
        // M.promiseError()
        M.staticsLoadError()
        wrap.init()
    },

    windowOnError() {
        const originOnError = M.environment.onerror
        M.environment.onerror = function newErrorHandler(msg, target, lineNum, colNum, error) {
            let reportMsg = msg
            if (error && error.stack) {
                reportMsg = M.processErrorStack(error)
            }

            if (utils.isType(reportMsg, 'Event')) {
                reportMsg += reportMsg.type ?
                    ('--' + reportMsg.type + '--' + (reportMsg.target ?
                        (reportMsg.target.tagName + '::' + reportMsg.target.src) : '')) : ''
            }

            const data = {
                msg: reportMsg || 'unknow error',
                target,
                lineNum,
                colNum: colNum || (M.environment.event && M.environment.event.errorCharacter) || 0,
                level: 4
            }

            // for event click
            setTimeout(() => {
                report.push(data).submit({})
                originOnError && originOnError.apply(M.environment, arguments)
            }, 0)
        }
    },

    promiseError() {
        if (M.environment.addEventListener) {
            M.environment.addEventListener('unhandledrejection', this.processPromise, false)
        }
    },

    processPromise(error) {
        const errorMsg = JSON.stringify(error.reason)
        const data = {
            stack: '',
            msg: `promise unhandledrejection: ${errorMsg}`,
            lineNum: '',
            colNum: '',
            level: 4
        }
        M.catchError(data)
    },

    staticsLoadError() {
        if (!config.reportStatics) {
            return
        }
        if (M.environment.addEventListener) {
            M.environment.addEventListener('error', this.processStaticError, true)
        } else if (M.environment.attachEvent) {
            M.environment.attachEvent('onerror', this.processStaticError)
        }
    },

    processErrorStack(error) {
        let stackMsg = error.stack
        const errorMsg = error.toString()

        if (errorMsg) {
            if (stackMsg.indexOf(errorMsg) < 0) {
                stackMsg = `${stackMsg}'@'${errorMsg}`
            }
        } else {
            stackMsg = ''
        }

        return stackMsg
    },

    processError(errObj) {
        try {
            if (errObj.stack) {
                let url = errObj.stack.match('https?://[^\n]+')
                url = url ? url[0] : ''
                let rowCols = url.match(':(\\d+):(\\d+)')
                if (!rowCols) {
                    rowCols = [0, 0, 0]
                }

                const stack = M.processErrorStack(errObj)
                return {
                    msg: stack,
                    lineNum: rowCols[1],
                    colNum: rowCols[2],
                    target: url.replace(rowCols[0], ''),
                    level: 4
                }
            } 
            // ie 独有 error 对象信息，try-catch 捕获到错误信息传过来，造成没有msg
            if (errObj.name && errObj.message && errObj.description) {
                return {
                    msg: JSON.stringify(errObj)
                }
            }
            return errObj
        } catch (err) {
            return errObj
        }
    },

    processStaticError(e) {
        const nodeName = e.target.nodeName
        const src = e.target.src

        if (!nodeName) {
            return
        }

        const data = {
            stack: '',
            msg: `statics files ${nodeName} loads error`,
            lineNum: '',
            colNum: '',
            level: 3,
            ext: {
                src
            }
        }
        M.catchError(data)
    },

    // 立即上传
    submitNow(data) {    
        report.submit({ isNowSubmit: true, log: data })
    },

    // 加入队列
    catchError(error) {
        const data = M.processError(error)
        report.push(data).submit({})
    }

}

export default M
