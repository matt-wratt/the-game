import GamepadAdapters from './gamepad-adapters'

export default class GamepadInput {
  
  static get MS_SAMPLE() {
    return 50
  }

  constructor(eventStream) {
    this.events = eventStream
    this.state = {}
    this.bindToEvents()
  }

  getGamepad() {
    let adapter

    let gamepad = navigator.getGamepads().find(pad => {
      // getGamepads() can return null entries
      if(pad) {
        adapter = GamepadAdapters.find(adapter => adapter.match(pad))
        return adapter
      }
    })

    if(adapter) {
      return { pad: gamepad, adapter: adapter }
    }
  }

  bindToEvents() {
    setInterval(() => {
      let gamepad = this.getGamepad()

      if(!gamepad) {
        return
      }

      this.setStateFromButtons(gamepad.pad.buttons, gamepad.adapter)
    }, GamepadInput.MS_SAMPLE)
  }

  setStateFromButtons(buttons, adapter) {
    let newState = {}

    buttons.forEach((button, buttonIndex) => {
      if(button.pressed) {
        let action = adapter.mappings[buttonIndex]

        if(action) {
          newState[action] = true
        }
      }
    })

    this.setState(newState)
  }

  isDifferent(newState) {
    // Fast comparison
    return JSON.stringify(this.state) !== JSON.stringify(newState)
  }

  setState(newState) {
    if(this.isDifferent(newState)) {
      this.state = newState
      this.events.broadcast('stateChange', this.state)
    }
  }
}
