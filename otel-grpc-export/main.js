"use strict";

const { Resource } = require("@opentelemetry/resources");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const grpc = require("@grpc/grpc-js");
const {
    SimpleSpanProcessor,
    ConsoleSpanExporter,
    BatchSpanProcessor
  } = require("@opentelemetry/sdk-trace-base");

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.HOST_NAME]: require("os").hostname(), // your host name
    [SemanticResourceAttributes.SERVICE_NAME]: "<your-service-name>",
  }),
});

registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [new HttpInstrumentation(), ExpressInstrumentation],
});

const metadata = new grpc.Metadata();
metadata.set("Authentication", "<token>");

const exporter = new OTLPTraceExporter({ url: "<gRPC-Endpoint>", metadata });
provider.addSpanProcessor(new BatchSpanProcessor(exporter)); // 通过gRPC上报Trace数据
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter())); // 可选，Trace数据打印到终端
provider.register();

// 应用代码
const api = require("@opentelemetry/api");
const axios = require("axios").default;
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const result = await axios.get("http://localhost:7001/api");
  return res.status(201).send(result.data);
});

app.get("/api", async (req, res) => {
  const currentSpan = api.trace.getSpan(api.context.active());
  currentSpan.addEvent("timestamp", { value: Date.now() });
  currentSpan.setAttribute("tagKey-01", "tagValue-01");
  res.json({ code: 200, msg: "success" });
});

app.use(express.json());

app.listen(7001, () => {
  console.log("Listening on http://localhost:7001");
});