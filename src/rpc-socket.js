const RPC = require("./rpc");

module.exports = class RPCSocket {
  constructor(socket, onMessage) {
    this.socket = socket;

    // Set up socket message handler
    if (this.socket.on) {
      // fastify-websocket wrapped socket
      this.socket.on("message", (msg) => onMessage(this, msg));
    } else if (this.socket.addEventListener) {
      // native web socket
      this.socket.addEventListener("message", (msg) => onMessage(this, msg));
    }
  }

  request(methodName, params) {
    const request = RPC.request(methodName, params);
    return this.send(request);
  }

  notify(methodName, params) {
    const notification = RPC.notification(methodName, params);
    return this.send(notification);
  }

  success(id, result) {
    const success = RPC.success(id, result);
    return this.send(success);
  }

  error(id, err) {
    const error = RPC.error(id, err);
    return this.send(error);
  }

  send(message) {
    return this.socket.send(JSON.stringify(message));
  }
};
