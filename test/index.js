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

//额外参数.
//utf8 参数
//特殊参数
capi.request({
    Region: 'gz',
    Action: 'DescribeProject',
    test: '中文',
    test_1: 'test_1',
    test_2: '@test2'
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 0)
})

//数组及对象序列化
capi.request({
	Region: 'gz',
	Action: 'DescribeProject',
	test_object : {
		test_a:"test_a",
		test_b:"test_b"
	},
	test_array : [1,2,3,{
		test_a:"test_a",
		test_b:"test_b"
	}]

}, function(error, data) {
	assert.equal(error, null)
	assert.equal(typeof data, 'object')
	assert.equal(data.code, 0)
})

// //写操作
// capi.request({
//   Region: 'gz',
//   Action: 'AddProject',
//   projectName: '测试项目2',
//   projectDesc: '测试项目2',
// }, function(error, data) {
//   console.log(error)
//   console.log(data)
// })

//get 方法
capi.request({
    Region: 'gz',
    Action: 'DescribeInstances'
}, {
    serviceType: 'cvm',
    method: 'get'
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 0)
})

capi.request({
    Region: 'gz',
    Action: 'DescribeProject',
    miss: undefined
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 0)
})

//错误地域
capi.request({
    Region: 'unkown',
    Action: 'DescribeInstances'
}, {
    serviceType: 'cvm',
    method: 'get'
}, function(error, data) {
    assert.equal(error, null)
    assert.equal(typeof data, 'object')
    assert.equal(data.code, 4000)
})

//错误的serviceType
capi.request({
    Region: 'unkown',
    Action: 'DescribeInstances'
}, {
    serviceType: 'unkown'
}, function(error, data) {
    assert.ok(error)
    assert.equal(data, undefined)
})
