const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const bluebird = require('bluebird');

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

const createClient = function(protoService) {
    const clientOptions = {
        'grpc.max_send_message_length': 104857600,
        'grpc.max_receive_message_length': 104857600,
        'grpc.keepalive_time_ms': 2000,
        'grpc.keepalive_timeout_ms': 1000,
        'grpc.keepalive_permit_without_calls': 1
    };

    let client = new protoService(`localhost:${port}`, grpc.credentials.createInsecure(), clientOptions);
    client = bluebird.promisifyAll(client);

    return client;
};

const getClient = (protoService) => {
    // It needs to return a new client every time, otherwise lambdas will reuse the instance and get closed channels.
    return () => createClient(protoService);
};

// const start = async () => {
//     while(true) {
//         const client = getClient(examplepackage.Example)();
//         const ret = await client.verifyModelAsync({ model: 'test' });
//         console.log(ret);
//         await bluebird.delay(3000);
//     }
// };

// const multiRequestsSameClient = async () => {
//     const client = getClient(examplepackage.Example)();

//     const req1 = bluebird.delay(0).then(() => client.verifyModelAsync({ model: 'test1' }));
//     const req2 = bluebird.delay(2000).then(() => client.verifyModelAsync({ model: 'test2' }));
//     const req3 = bluebird.delay(4000).then(() => client.verifyModelAsync({ model: 'test3' }));
//     const req4 = bluebird.delay(6000).then(() => client.verifyModelAsync({ model: 'test4' }));

//     const rets = await bluebird.all([ req1, req2, req3, req4 ]);

//     console.log(reqs);
// };

const multiRequestsDifferentClient = async () => {
    const client = getClient(examplepackage.Example);

    const req1 = bluebird.delay(0).then(() => client().verifyModelAsync({ model: 'test1' }));
    const req2 = bluebird.delay(2000).then(() => client().verifyModelAsync({ model: 'test2' }));
    const req3 = bluebird.delay(4000).then(() => client().verifyModelAsync({ model: 'test3' }));
    const req4 = bluebird.delay(6000).then(() => client().verifyModelAsync({ model: 'test4' }));

    const rets = await bluebird.all([ req1, req2, req3, req4 ]);

    console.log(rets);
};

multiRequestsDifferentClient();