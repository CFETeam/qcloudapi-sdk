Tencent Qcloud API SDK for node.js
==================================

`qcloudapi-sdk` 是[腾讯云 API 2.0](http://www.qcloud.com/wiki/%E4%BA%91API%E6%96%87%E6%A1%A3) 的 node.js SDK 工具包.

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
    otherParam: 'otherParam'
}, function(error, data) {
    console.log(data)
})

//传入配置以覆盖默认项
capi.request({
    Region: 'gz',
    Action: 'DescribeInstances',
    otherParam: 'otherParam'
}, {
    serviceType: 'cvm'
}, function(error, data) {
    console.log(data)
})

```

SDK API
-------

请访问 [api.md](./api.md)

资源
----

-	[公共函数](http://wiki.qcloud.com/wiki/%E5%85%AC%E5%85%B1%E5%8F%82%E6%95%B0)
-	[API 列表](http://wiki.qcloud.com/wiki/API)
-	[错误码](http://wiki.qcloud.com/wiki/%E9%94%99%E8%AF%AF%E7%A0%81)
