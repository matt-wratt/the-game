import msgpack from 'msgpack-js-browser'
import InputListener from './input-listener'
import Rendering from './rendering'
import Stage from './stage'

window.Client = class Client {
  constructor(name) {
    this.name = name
  }

  start() {
    let stage = new Stage(1000, 600)
    let input = new InputListener()
    let client = new WebSocket(document.location.protocol.replace('http', 'ws') + '//' + document.location.host)
    let thrusties = []

    window.addEventListener('beforeunload', function() {
      client.close()
    })

    client.binaryType = 'arraybuffer'

    client.onopen = function() {
      client.send(msgpack.encode({ join: { name: this.name } }))

      input.events.on('stateChange', function(state) {
        client.send(msgpack.encode({ inputState: state }))
      })
    }.bind(this)

    client.onmessage = function(message) {
      const gameState = msgpack.decode(message.data).state
      new Rendering(stage, gameState, thrusties).perform()
    }
  }

  static start(...params){
    let client = new Client(...params)
    client.start()
  }
}
