# light-ws-rpc

**Just testing things; experimental**

Light websockets wrapper that formalizes a RPC message exchange. It's a two way wrapper, so sockets can handle incoming RPC messages but also initiate a RPC message. RPC handler methods receive RPC wrapped socket and call parameters, so they can easily do some processing and respond through a socket.

## Usage

**server example => fastify + fastify-websocket**

```javascript
const LightWsRPC = require("light-ws-rpc");
const wsRPC = new LightWsRPC();

// configure appropriate RPC handlers
wsRPC.setHandler("request", "exampleMethodName", (rpcSocket, payload) => {
  // example of async response
  Promise.resolve().then(() => {
    rpcSocket.success(payload.id, { result: "data" });
  });
});

fastify.get(
  "/websocket-endpoint",
  { websocket: true },
  function wsHandler(connection, req) {
    wsRPC.createRpcSocket(connection.socket);
  }
);
```

**frontend example => native websockets**

```javascript
const LightWsRPC = require("light-ws-rpc");
const wsRPC = new LightWsRPC();
const socket = new WebSocket("ws://localhost:5000/websocket-endpoint");

wsRPC.setHandler("notification", (_rpcSocket, payload) => console.log(payload));

this.socket.addEventListener("open", function (event) {
  const rpcSocket = wsRpc.createRpcSocket(self.socket);
  rpcSocket.request("exampleMethodName", { foo: "bar" });
});
```
