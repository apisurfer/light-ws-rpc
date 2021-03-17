const RPCSocket = require("./rpc-socket");
const RPC = require("./rpc");

module.exports = class LightWsRPC {
  static defaultRpcMethods() {
    return {
      request: {},
      notification: {},
      success: undefined,
      error: undefined,
      invalid: undefined,
    };
  }

  constructor() {
    this.rpcMethods = LightWsRPC.defaultRpcMethods();
  }

  createRpcSocket(socket) {
    return new RPCSocket(socket, this._messageHandler.bind(this));
  }

  setHandler(type, methodName, methodFn) {
    const valid = this._isValidRpcType(type);
    if (!valid) return false;

    if (type === "success" || type === "error" || type === "invalid") {
      this.rpcMethods[type] = methodFn;
    } else {
      this.rpcMethods[type][methodName] = methodFn;
    }

    return true;
  }

  removeHandler(type, methodName) {
    const valid = this._isValidRpcType(type);
    if (!valid) return false;
    if (!this.rpcMethods[type][methodName]) return false;

    if (type === "success" || type === "error" || type === "invalid") {
      this.rpcMethods[type] = undefined;
    } else {
      delete this.rpcMethods[type][methodName];
    }

    return true;
  }

  _messageHandler(rpcSocket, message) {
    const { type, payload } = RPC.parse(message);
    const handler = this._getHandler(type, payload.method);
    handler(rpcSocket, payload);
  }

  _getHandler(type, methodName) {
    if (type === "success" || type === "error" || type === "invalid") {
      return this.rpcMethods[type];
    } else {
      return this.rpcMethods[type][methodName];
    }
  }

  _isValidRpcType(type) {
    return ["request", "notification", "success", "error", "invalid"].includes(
      type
    );
  }
};
