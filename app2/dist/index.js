'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _eurekaJsClient = require('eureka-js-client');

var _eurekaJsClient2 = _interopRequireDefault(_eurekaJsClient);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

/* Eureka Set Up */
var client = new _eurekaJsClient2.default({
  // application instance information
  instance: {
    app: 'app2',
    hostName: 'localhost:3001',
    ipAddr: '127.0.0.1',
    port: {
      '$': 3001,
      '@enabled': 'true'
    },
    vipAddress: 'gamer.microservice.app2',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    // eureka server host / port
    host: '127.0.0.1',
    port: 8761,
    servicePath: '/eureka/apps/',
    preferIpAddress: true,
    heartbeatInterval: 2000,
    registryFetchInterval: 2000,
    shouldUseDelta: true
  }
});

client.logger.level('debug');

client.start();

/* End Eureka Set up */

/* Process Setup */
var exitHandler = function exitHandler(options, err) {
  if (options.exit) {

    client.stop();

    setTimeout(function () {

      process.exit();
    }, 100);
  }
};

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

/* Process Setup */

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/app1', function (req, res) {

  var app1 = client.getInstancesByAppId('app1');

  app1 = app1[0].hostName;

  console.log(app1);

  var result = null;

  _axios2.default.get('http://' + app1 + "/").then(function (response) {
    return response.data;
  }).then(function (data) {

    res.json(data);
  });
});

// listen on port
var port = 3001;
app.listen(port, function () {
  var listenerWelcomeMessage = 'listening on ' + port;
  console.log(listenerWelcomeMessage);
});