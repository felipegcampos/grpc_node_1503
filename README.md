## How to reprudce?

1. `npm install`
2. Start the server with `node ./src/server.js` in one terminal.
3. Open 4 terminals and run `while true; do node ./src/client.js ; sleep 3; done`

## Explanation
In the `./src/client.js` there are 4 requests executed with `Promise.all` and each request has a delay to make sure the client will request the server with intervals of **2 seconds**. The client get a new client and requests the server. The server before replying the request runs a Promise delay of **3 seconds** ( that should not block event loop ) and a sleep of **3 seconds** ( that should block the event loop ). After a few seconds running 4 instances of the client you will get `assertion failed: cur != GRPC_CHANNEL_SHUTDOWN`.

## Note
If we remove `max_connection_age_ms` the problem go away but we then get `RST_STREAM` if working with NLB.

