import { deflate } from 'pako'
import { Base64 } from 'js-base64'
import MD5 from 'crypto-js/md5'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

function encrypt(data) {
    const _data = {
        log: data
    }
    const key = 'XXX'

    const sign = Base64.btoa(deflate(JSON.stringify(_data), { gzip: true, to: 'string' }))

    const md5Key = MD5(key).toString().slice(8, 24)

    const code = AES.encrypt(Utf8.parse(sign), Utf8.parse(md5Key), {
        iv: Utf8.parse('0102030405060708')
    }).toString()

    return code
}

export default encrypt
