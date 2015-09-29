var assert = require('assert')
var Capi = require('../')
var config = require('./config.json')

var capi = new Capi({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    serviceType: 'account'
})

capi.request({
    Region: 'gz',
    Action: 'DescribeProject'
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 0)
})

capi.request({
    Region: 'gz',
    Action: 'DescribeInstances'
}, {
    serviceType: 'cvm'
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 0)
})
