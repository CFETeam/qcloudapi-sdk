var request = require('request')
var assign = require('object-assign')

var qs = require('querystring')
var crypto = require('crypto')

var baseHost = 'api.qcloud.com'

/**
 * API 构造函数
 * @param {Object} [defaults] 默认参数及配置
 * @param {String} defaults.serviceType 服务类型. 如: cvm, vpc, dfw, lb 等. 根据 `serviceType` 和 `baseHost` 将拼装成请求域名, 如: `vpc.api.qcloud.com`
 * @param {String} defaults.path='/v2/index.php' Api 请求路径
 * @param {String} defaults.method='POST' 请求方法
 * @param {String} defaults.baseHost='api.qcloud.com' Api 的基础域名. 与 `serviceType` 拼装成请求域名.
 * @param {String} defaults.SecretId secretId
 * @param {String} defaults.SecretKey secretKey
 * @constructor
 */
var QcloudApi = function(defaults) {
    defaults = defaults || {}

    defaults.path = defaults.path || '/v2/index.php'
    defaults.method = defaults.method || 'POST'

    defaults.baseHost = defaults.baseHost || baseHost

    this.defaults = defaults
}

/**
 * 生成 API 的请求地址
 * @param {Object} opts
 * @returns {string}
 */
QcloudApi.prototype.generateUrl = function(opts) {
    opts = opts || {}
    var host = this._getHost(opts)

    return 'https://' + host + (opts.path || this.defaults.path)
}

/**
 * 生成请求参数.
 * @param {Object} data 该次请求的参数. 同 `request` 方法的 `data` 参数
 * @param {Object} [opts] 请求配置. 同 `request` 方法的 `opts` 参数
 * @returns {string} 包括签名的参数字符串
 */
QcloudApi.prototype.generateQueryString = function(data, opts) {
    opts = opts || this.defaults

    var defaults = this.defaults
    var options = assign({
        Region: this.defaults.Region,
        SecretId: opts.SecretId || this.defaults.SecretId,
        Timestamp: Math.round(Date.now() / 1000),
        Nonce: Math.round(Math.random() * 65535)
    }, data)

    var keys = Object.keys(options)
    var qstr = '', signStr

    var host = this._getHost(opts)
    var method = (opts.method || defaults.method).toUpperCase()

    keys.sort()
    keys.forEach(function(key) {
      // 排除上传文件的参数
      if(method === 'POST' && options[key][0] === '@'){
        return
      }
      //把参数中的 _ 替换成 .
      qstr += '&' + key.replace('_', '.') + '=' + options[key]
    })

    qstr = qstr.slice(1)

    signStr = this.sign(method + host + (opts.path || defaults.path) + '?' + qstr, opts.SecretKey || defaults.SecretKey)

    options.Signature = signStr

    return qs.stringify(options)
}

/**
 * 请求 API
 * @param {Object} data 该次请求的参数.
 * @param {Object} [data.SecretId] Api SecrectId, 通过 `data` 参数传入时将覆盖 `opt` 传入及默认的 `secretId`
 * @param {Object} [opts] 请求配置. 配置里的参数缺省使用默认配置 (`this.defaults`) 里的对应项
 * @param {String} opts.host 该次请求使用的 API host. 当传入该参数的时候, 将忽略 `serviceType` 及默认 `host`
 * @param {requestCallback} callback
 */
QcloudApi.prototype.request = function(data, opts, callback) {
    if(typeof opts === 'function') {
        callback = opts
        opts = this.defaults
    }
    opts = opts || this.defaults
    callback = callback || Function.prototype

    var url = this.generateUrl(opts)
    var method = (opts.method || this.defaults.method).toUpperCase()
    var dataStr = this.generateQueryString(data, opts)
    var option = {url: url, method: method, strictSSL: false}

    if(method === 'POST') {
        option.form = qs.parse(dataStr)
    }else{
        option.url += '?' + dataStr
    }
    option.json = true

    request(option, function(error, response, body) {
        callback(error, body)
    })
}

/**
 * `.request` 的请求回调
 * @callback requestCallback
 * @param {Error} error 请求错误
 * @param {Object} body API 请求结果
 */


/**
 * 生成签名
 * @param {String} str 需签名的参数串
 * @param {String} secretKey
 * @returns {String} 签名
 */
QcloudApi.prototype.sign = function(str, secretKey) {
    var hmac = crypto.createHmac('sha1', secretKey || '')
    return hmac.update(new Buffer(str, 'utf8')).digest('base64')
}

/**
 * 获取 API host
 * @param opts 请求配置
 * @param {String} [opts.serviceType] 服务类型. 如: cvm, vpc, dfw, lb 等
 * @param {String} [opts.host] 如果配置中直接传入 host, 则直接返回该 host
 * @returns {String}
 * @private
 */
QcloudApi.prototype._getHost = function(opts) {
    var host = opts.host
    if(!host) {
        host = (opts.serviceType || this.defaults.serviceType) + '.' + (opts.baseHost || this.defaults.baseHost)
    }
    return host
}

module.exports = QcloudApi
