export default class KeyboardInput {
    constructor(eventStream) {
      this.events = eventStream
      this.state = {}
      this.bindToEvents()
    }

    keyCodeAction(keyCode) {
      var keyCodeToActionMappings = {
        38: 'thrust',
        37: 'left',
        39: 'right'
      }

      return keyCodeToActionMappings[keyCode]
    }

    bindToEvents() {
      window.addEventListener('keydown', this.setState(true))
      window.addEventListener('keyup', this.setState(false))
    }

    setState(value) {
      return function(event) {
        var action = this.keyCodeAction(event.keyCode)

        if(action) {
          this.state[action] = value
        }

        this.events.broadcast('stateChange', this.state)
      }.bind(this)
    }
    
}
