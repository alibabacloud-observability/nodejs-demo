## 通过OpenTelemetry上报Node.js应用数据

1. 通过gRPC协议上报链路数据

```
cd otel-grpc-export 

# 下载依赖
npm install

# 修改 main.js 中的 <gRPC-Endpoint> 和 <token>

# 运行
node main.js
```

浏览器中打开 http://localhost:7001 以访问应用

2.  通过HTTP协议上报链路数据

```
cd otel-http-export

# 下载依赖
npm install 

# 修改 main.js 中的 <HTTP-Endpoint> 

# 运行
node main.js
```

浏览器中打开 http://localhost:7001 以访问应用
