'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mongo = function () {
    function Mongo() {
        _classCallCheck(this, Mongo);
    }

    _createClass(Mongo, null, [{
        key: 'connect',
        value: function connect() {
            var mongoUri = process.env.MONGO_URI;
            _mongoose2.default.Promise = global.Promise;
            _mongoose2.default.connect(mongoUri);

            var db = _mongoose2.default.connection;

            db.on('error', function (err) {
                console.error('Mongo connection error: ' + err);
            });

            db.once('open', function () {
                console.info('Mongo connection established');
            });
        }
    }]);

    return Mongo;
}();

exports.default = Mongo;