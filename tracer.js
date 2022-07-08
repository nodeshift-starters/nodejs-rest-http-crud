'use strict';

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// SDK
const opentelemetry = require('@opentelemetry/sdk-node');

// Express, postgres and http instrumentation
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');

// Collector trace exporter
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: 'fruits' })
});

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new PgInstrumentation()
  ]
});

// Tracer exporter
const traceExporter = new OTLPTraceExporter({ url: 'http://opentel-collector-headless.opentel.svc:4318/v1/traces' });
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
provider.register();

// SDK configuration and start up
const sdk = new opentelemetry.NodeSDK({ traceExporter });

(async () => {
  try {
    await sdk.start();
    console.log('Tracing started.');
  } catch (error) {
    console.error(error);
  }
})();

process.on('SIGINT', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing finished.');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
});
