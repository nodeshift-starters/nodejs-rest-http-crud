'use strict';

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
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: 'fruits' })
});
provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new PgInstrumentation()
  ]
});

// Tracer exporter
const traceExporter = new OTLPTraceExporter();
provider.addSpanProcessor(new BatchSpanProcessor(traceExporter, {
  maxQueueSize: 100,
  maxExportBatchSize: 10,
  scheduledDelayMillis: 500,
  exportTimeoutMillis: 30000
}));

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
