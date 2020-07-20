const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const exampleService = require('./services/example');

const port = process.env.PORT || '50051';

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    isClient: false
};

const exampleProto = './proto/example.proto';
const examplePackageDefinition = protoLoader.loadSync(exampleProto, options);
const { examplepackage } = grpc.loadPackageDefinition(examplePackageDefinition);

async function start() {
    const server = new grpc.Server({
        'grpc.max_send_message_length': 104857600,
        'grpc.max_receive_message_length': 104857600,
        'grpc.max_connection_idle_ms': 5000,
        'grpc.max_connection_age_ms': 240000, // MAX_INT = 2147483647
        'grpc.keepalive_time_ms': 2000,
        'grpc.keepalive_timeout_ms': 1000,
        'grpc.keepalive_permit_without_calls': 1,
        'grpc.http2.min_ping_interval_without_data_ms': 0
    });

    server.addService(examplepackage.Example.service, { verifyModel: exampleService.verifyModel });

    server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
    server.start();

    console.log(`server stated at port ${port}`);

    return server;
}

start();