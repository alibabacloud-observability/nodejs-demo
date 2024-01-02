## 通过 OpenTelemetry 上报 Node.js 应用数据

本文介绍了如何通过OpenTelemetry将Node.js Express应用接入可观测链路 OpenTelemetry 版。

## 1. 方法一：自动埋点（推荐）

1. 下载运行项目所需的依赖
```
cd auto-instrumentation

npm init -y
npm install express
npm install axios
```

2. 下载 OpenTelemetry 自动埋点所需的依赖
```
npm install --save @opentelemetry/api
npm install --save @opentelemetry/auto-instrumentations-node
```

3. 编写应用代码
* 以下是通过 Express 实现的简单应用
```javascript
"use strict";

const axios = require("axios").default;
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const result = await axios.get("http://localhost:7001/hello");
  return res.status(201).send(result.data);
});

app.get("/hello", async (req, res) => {
  console.log("hello world!")
  res.json({ code: 200, msg: "success" });
});

app.use(express.json());

app.listen(7001, () => {
  console.log("Listening on http://localhost:7001");
});
```

4. 运行

通过环境变量设置 OpenTelemetry 参数并运行应用：
* 请将 ${httpEndpoint} 替换为在“前提条件”中获取的 HTTP 接入点
* 请将 ${serviceName} 替换为您的应用名
  
```
export OTEL_TRACES_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="${httpEndpoint}"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,os"
export OTEL_SERVICE_NAME="${serviceName}"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
node main.js
```

>  说明: 有关 OpenTelemetry 环境变量的说明，请参见[OpenTelemetry Node.js 自动埋点配置](https://opentelemetry.io/docs/instrumentation/js/automatic/module-config/)


5. 访问应用
* 通过以下命令访问应用，或者直接在浏览器中访问改地址，即可生成调用链并上报至可观测链路 OpenTelemetry 版。
```
curl localhost:7001/hello
```


## 2. 方法二：手动埋点

### 通过 HTTP 协议上报链路数据

```
cd manual-instrumentation/otel-http-export

# 下载依赖
npm install 

# 修改 main.js 中的 <HTTP-Endpoint> 

# 运行
node main.js
```

浏览器中打开 http://localhost:7001 以访问应用

### 通过 gRPC 上报链路数据

```
cd manual-instrumentation/otel-grpc-export 

# 下载依赖
npm install

# 修改 main.js 中的 <gRPC-Endpoint> 和 <token>

# 运行
node main.js
```

浏览器中打开 http://localhost:7001 以访问应用