import config from './config'
import utils from './utils'
import report from './report'

const Wrap = {

    timeoutKey: null,

    environment: null,

    consoleList: {},

    init(global) {
        this.environment = global || window

        if (config.wrapAll) {
            this.wrapAjax().wrapJquery().wrapTimer().wrapConsole()
        } else {
            config.wrapJquery && this.wrapJquery()
            config.wrapAjax && this.wrapAjax()
            config.wrapTimer && this.wrapTimer()
            config.wrapConsole && this.wrapConsole()
        }
    },

    cat(func, args) {
        const global = this.environment

        return () => {
            try {
                func.apply(this, args || undefined)
            } catch (e) {
                // hang up browser and throw , but it should trigger onerror , so rewrite onerror then recover it
                if (!this.timeoutKey) {
                    const orgOnerror = window.onerror
                    global.onerror = function noop() {}
                    this.timeoutKey = setTimeout(() => {
                        global.onerror = orgOnerror
                        this.timeoutKey = null
                    }, 50)
                }

                throw e
            }
        }
    },

    catTimer(func) {
        return function wrapTimer(args) {
            const argsArr = utils.toArray(args)
            let cb = argsArr[0]
            const timeout = argsArr[1]
            if (utils.isType(cb, 'String')) {
                try {
                    cb = new Function(cb)
                } catch (e) {
                    throw e
                }
            }

            const _args = argsArr.splice(2)
            cb = this.cat(cb, _args.length && _args)

            return func(cb, timeout)
        }
    },

    makeObjTry(func, self) {
        const _this = this
        return function _makeObjTry() {
            let tmp 
            const args = []

            utils.toArray(arguments).forEach(v => {
                utils.isType(v, 'Function') && (tmp = _this.cat(v)) &&
                    (v.tryWrap = tmp) && (v = tmp)
                args.push(v)
            })

            return func.apply(self || this, args)
        }
    },

    wrapJquery() {
        const _$ = $ || window.$

        if (!_$ || !_$.event) {
            return this
        }

        let _add
        let _remove
        if (_$.zepto) {
            _add = _$.fn.on
            _remove = _$.fn.off

            _$.fn.on = this.makeArgsTry(_add)
            
            _$.fn.off = function off() {
                const args = []
                utils.toArray(arguments).forEach(v => {
                    utils.isType(v, 'Function') && v.tryWrap && (v = v.tryWrap)
                    args.push(v)
                })
                return _remove.apply(this, args)
            }
        } else if (_$.fn.jquery) {
            _add = _$.event.add
            _remove = _$.event.remove

            _$.event.add = this.makeArgsTry(_add)
            _$.event.remove = (...params) => {
                const args = []
                utils.toArray(params).forEach(v => {
                    utils.isType(v, 'Function') && v.tryWrap && (v = v.tryWrap)
                    args.push(v)
                })
                return _remove.apply(this, args)
            }
        }

        const _ajax = _$.ajax

        if (_ajax) {
            _$.ajax = (url, setting) => {
                if (!setting) {
                    setting = url
                    url = undefined
                }
                this.makeObjTry(setting)
                if (url) return _ajax.call(_$, url, setting)
                return _ajax.call(_$, setting)
            }
        }
        return this
    },

    wrapTimer() {
        const global = this.environment
        global.setTimeout = this.catTimer(global.setTimeout)
        global.setInterval = this.catTimer(global.setInterval)
        return this
    },

    wrapConsole() {
        ['logx', 'debug', 'info', 'warn', 'error'].forEach((type, index) => {
            const _console = this.environment.console[type]
            window.console[type] = (...args) => {
                this.reportConsole(_console, type, index, utils.toArray(args))
            }
        })
        return this
    },

    wrapAjax() {
        const self = this

        if ('XMLHttpRequest' in this.environment && utils.isType(this.environment.XMLHttpRequest, 'Function')) {
            const _send = this.environment.XMLHttpRequest.prototype.send

            this.environment.XMLHttpRequest.prototype.send = function wrappSend(data) {
                const xhr = this
                function onreadystatechangeHandler() {
                    if (xhr.readyState === 1 || xhr.readyState === 4) {
                        if (xhr.status >= 400 || xhr.status >= 500) {
                            self.reportAjaxError(xhr)            
                        }
                    }
                }

                if ('onreadystatechange' in xhr && utils.isType(xhr.onreadystatechange, 'Function')) {
                    const _onreadystatechange = xhr.onreadystatechange
                    xhr.onreadystatechange = function wrapOnreadystatechange() {
                        onreadystatechangeHandler()
                        _onreadystatechange && _onreadystatechange()
                    }
                }

                _send && _send.call(this, data)
            }
        }
    },

    reportConsole(func, type, level, args) {
        config.combo = true
        let msg = ''
        args.forEach(x => {
            if (utils.isType(x, 'string')) {
                msg += x
            } else if (utils.isType(x, 'array')) {
                msg += (`[${x.join(',')}]`)
            } else {
                msg += JSON.stringify(x)
            }
        })

        this.consoleList[type] = this.consoleList[type] || []
        this.consoleList[type].push({
            msg,
            level,
            lineNum: '',
            colNum: '',
            targetUrl: ''
        })

        if (this.consoleList[type].length > 2) {
            report.reportQueue = report.reportQueue.concat(this.consoleList[type])
            report.submit(() => {
                this.consoleList[type] = []
            })
        }

        return func.apply(this, args)
    },

    reportAjaxError(xhr) {
        const data = {
            msg: `${xhr.responseURL} request error`,
            lineNum: '',
            colNum: '',
            ext: {
                xhr
            }
        }

        report.push(data).submit({})
    }

}

export default Wrap
