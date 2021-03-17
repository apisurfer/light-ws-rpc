const uuid = require("uuid");
const jsonrpc = require("jsonrpc-lite");

module.exports = class RPC {
  /**
   * Generate unique call id
   * E.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
   * @returns {String}
   */
  static id() {
    return uuid.v4();
  }

  /**
   * Parse RPC message
   * {
   *   type: 'request',
   *   payload: {
   *     jsonrpc: '2.0',
   *     id: 123,
   *     method: 'update',
   *     params: {}
   *   }
   * }
   * @param {String} message Message containing remote procedure call details
   * @returns {Object}
   */
  static parse(message) {
    return jsonrpc.parse(message);
  }

  /**
   * Create request RPC command
   * {
   *   jsonrpc: '2.0',
   *   id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
   *   method: 'update',
   *   params: {list: [1, 2, 3]}
   * }
   * @param {String} method Method name
   * @param {Object|Array} params
   */
  static request(method, params) {
    const callId = RPC.id();
    return jsonrpc.request(callId, method, params);
  }

  /**
   * Create success RPC response
   * {
   *   jsonrpc: '2.0',
   *   id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
   *   result: {state: 'OK'},
   * }
   * @param {String} callId Unique call identifier
   * @param {Mixed} result
   */
  static success(callId, result) {
    return jsonrpc.success(callId, result);
  }

  /**
   * Create error RPC response
   * {
   *   jsonrpc: '2.0',
   *   id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
   *   error: {error: 'Failed to process data'},
   * }
   * @param {callId} callId Unique call identifier
   * @param {String} errorMsg
   * @param {Number} errorCode
   */
  static error(callId, errorMsg, errorCode) {
    return jsonrpc.error(callId, new jsonrpc.JsonRpcError(errorMsg, errorCode));
  }

  /**
   * Create RPC notification
   * {
   *   jsonrpc: '2.0',
   *   method: 'update',
   *   params: {list: [1, 2, 3]}
   * }
   * @param {String} method Method name
   * @param {Object|Array} params
   */
  static notification(method, params) {
    return jsonrpc.notification(method, params);
  }
};
