import express from 'express'
import Eureka from 'eureka-js-client'

const app = express()

/* Eureka Set Up */
const client = new Eureka({
  // application instance information
  instance: {
    app: 'app1',
    hostName: 'localhost:3000',
    ipAddr: '127.0.0.1',
    port: {
     '$': 3000,
     '@enabled': 'true',
   },
    vipAddress: 'gamer.microservice.app1',
    dataCenterInfo: {
    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
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
  },
})

client.logger.level('debug')

client.start()

/* End Eureka Set up */

/* Process Setup */
const exitHandler = (options, err) => {
    if (options.exit){

      client.stop()

      setTimeout(() => {

        process.exit()

      }, 100)
    }
}

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}))
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}))

/* Process Setup */

app.get('/', (req, res) => {
    res.send('Hello World')
})

// listen on port
const port = 3001
app.listen(port, () => {
  var listenerWelcomeMessage = `listening on ${port}`
  console.log(listenerWelcomeMessage)
})
