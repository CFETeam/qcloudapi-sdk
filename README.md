Tencent Qcloud API SDK for node.js
==================================

`qcloudapi-sdk` 是[腾讯云 API 2.0](https://www.qcloud.com/doc/api) 的 node.js SDK 工具包.

安装
----

```bash
npm i qcloudapi-sdk --save
```

使用
----

1.	使用之前请在腾讯云的[云 API 控制台](https://console.qcloud.com/capi)中创建自己的安全凭证(SecretId 和 SecretKey). SecretKey 要严格保管, 避免泄露.
2.	安装并引入本 SDK.

示例
----

```js
var Capi = require('qcloudapi-sdk')

//通过构造函数传入的参数将作为默认配置
var capi = new Capi({
    SecretId: 'Your SecretId here',
    SecretKey: 'Your SecretKey here',
    serviceType: 'account'
})

capi.request({
    Region: 'gz',
    Action: 'DescribeProject',
    otherParam1: 'otherParam1',
    otherParam2: 'otherParam2'
}, function(error, data) {
    console.log(data)
})

//传入配置以覆盖默认项
capi.request({
    Region: 'gz',
    Action: 'DescribeInstances',
    otherParam1: 'otherParam1',
    otherParam2: 'otherParam2'
}, {
    serviceType: 'cvm'
}, function(error, data) {
    console.log(data)
})

//生成 querystring
var qs = capi.generateQueryString({
    Region: 'gz',
    Action: 'DescribeInstances',
    otherParam1: 'otherParam1',
    otherParam2: 'otherParam2'
}, {
    serviceType: 'cvm'
})
//'Region=gz&SecretId=&Timestamp=1449461969&Nonce=20874&Action=DescribeInstances&otherParam1=otherParam1&otherParam2=otherParam2&Signature=r%2Fa9nqMxEIn5RsMjqmIksQ5XcYc%3D'
```

SDK API
-------

请访问 [api.md](./api.md)

资源
----

-	[API 列表](https://www.qcloud.com/doc/api)
