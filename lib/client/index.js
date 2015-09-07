import msgpack from 'msgpack-js-browser'
import PlayerInput from './player-input'
import KeyboardInput from './keyboard-input'
import GamepadInput from './gamepad-input'
import Rendering from './rendering'
import Stage from './stage'

window.Client = class Client {
  constructor(name) {
    this.name = name
  }

  start() {
    let stage = new Stage(1000, 600)
    let input = new PlayerInput(KeyboardInput, GamepadInput)
    let client = new WebSocket(document.location.protocol.replace('http', 'ws') + '//' + document.location.host)
    let thrusties = []

    window.addEventListener('beforeunload', function() {
      client.close()
    })

    client.binaryType = 'arraybuffer'

    client.onopen = function() {
      client.send(msgpack.encode({type: 'join', data: { name: this.name }}))

      input.events.on('stateChange', function(state) {
        client.send(msgpack.encode({type: 'inputState', data: state}))
      })
    }.bind(this)

    client.onmessage = function(messageEvent) {
      let message = msgpack.decode(messageEvent.data)

      switch(message.type) {
        case 'state':
          new Rendering(stage, message.data, thrusties).perform()
      }
    }
  }

  static start(...params){
    let client = new Client(...params)
    client.start()
  }
}
