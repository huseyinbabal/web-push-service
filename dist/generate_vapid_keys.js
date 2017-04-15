"use strict";

var _webPush = require("web-push");

var _webPush2 = _interopRequireDefault(_webPush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vapidKeys = _webPush2.default.generateVAPIDKeys();

console.log("Public Key: ", vapidKeys.publicKey);
console.log("Private Key: ", vapidKeys.privateKey);