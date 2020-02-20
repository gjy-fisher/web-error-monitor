import config from './config'
import utils from './utils'

function request(data, cb) {
    if (config.noReuqest) {
        console.log(data)
        return undefined
    }

    if (config.request && utils.isType(config.request, 'Function')) {
        return config.request(data, cb)
    }

    const img = new window.Image()
    img.onload = cb
    img.src = config.url + '?' + window.btoa(JSON.stringify(data))
    return undefined
}

export default request
