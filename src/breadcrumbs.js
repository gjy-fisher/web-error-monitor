import config from './config'
import utils from './utils'

const breadcrumbs = {
    list: [],

    inited: false,

    environment: null,

    keypressTimeout: null,

    lastEvent: null,

    xhr: null,

    length: 3,

    init(global) {
        if (!config.breadcrumbs || breadcrumbs.inited) {
            return
        }
        if (global === undefined) {
            return
        }
        breadcrumbs.inited = true
        breadcrumbs.environment = global
        breadcrumbs.length = config.breadcrumbs.length || 3
        breadcrumbs.wrapEvent()
    },

    captureBreadcrumb(data) {
        breadcrumbs.list.push(data)
        if (breadcrumbs.list.length > this.length) {
            breadcrumbs.list.shift()
        }
        console.log(breadcrumbs.list)
        return breadcrumbs.list.length
    },

    getBreadcrumb() {
        const _list = breadcrumbs.list.slice(0)
        console.log(_list)
        breadcrumbs.list.length = 0
        clearTimeout(breadcrumbs.keypressTimeout)
        breadcrumbs.lastEvent = null
        return _list
    },

    wrapEvent() {
        const self = breadcrumbs
        if (document.addEventListener) {
            config.breadcrumbs.click && document.addEventListener('click', self.breadcrumbHandle('click'), false)
            config.breadcrumbs.keypress && document.addEventListener('keypress', self.keyPressHandler, false)
        } else {
            // IE8 Compatibility
            config.breadcrumbs.click && document.attachEvent('onclick', self.breadcrumbHandle('click'))
            config.breadcrumbs.keypress && document.attachEvent('onkeypress', self.keyPressHandler)
        }
        config.breadcrumbs.xhr && breadcrumbs.warpXhr()
    },

    breadcrumbHandle(evtName) {
        const self = breadcrumbs
        return function (e) {
            console.log(e)
            self.keypressTimeout = null
            if (self.lastEvent === e) {
                return
            }
            self.lastEvent = e
            let target
            try {
                target = e.target
            } catch (err) {
                target = '<unknow>'
            }

            self.captureBreadcrumb({
                type: 'ui.' + evtName,
                message: utils.getElementTree(target)
            })
        }
    },

    keyPressHandler(e) {
        let target
        try {
            target = e.target
        } catch (err) {
            return
        }
        const tagName = target && target.tagName && target.tagName.toLowerCase()
        if (!tagName || (tagName !== 'input' && tagName !== 'textarea' && !target.isContentEditable)) {
            return
        }
        if (!breadcrumbs.keypressTimeout) {
            breadcrumbs.breadcrumbHandle('input')(e)
        }
        clearTimeout(breadcrumbs.keypressTimeout)
        breadcrumbs.keypressTimeout = setTimeout(() => {
            breadcrumbs.keypressTimeout = null
        }, 1000)
    },

    warpXhr() {
        const self = this
        if ('XMLHttpRequest' in this.environment && utils.isType(this.environment.XMLHttpRequest, 'Function')) {
            const _open = this.environment.XMLHttpRequest.prototype.open
            const _send = this.environment.XMLHttpRequest.prototype.send
            this.environment.XMLHttpRequest.prototype.open = function wrapOpen(method, url) {
                const xhr = this
                xhr.__xhr__ = {
                    method,
                    url,
                    status_code: null
                }
                _open && _open.apply(this, arguments)
            }

            this.environment.XMLHttpRequest.prototype.send = function wrapSend(data) {
                const xhr = this
                function onreadystatechangeHandler() {
                    if (xhr.__xhr__ && xhr.readyState === 4) {
                        try {
                            xhr.__xhr__.status_code = xhr.status
                        } catch (err) {
                        /* do nothing */
                        }
                        xhr.__xhr__.url.indexOf('crashLog') === -1 && self.captureBreadcrumb({
                            type: 'xhr',
                            data: xhr.__xhr__
                        })
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
    }
}

export default breadcrumbs
