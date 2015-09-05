export default class GamepadInput {
  // For PS3 controller
  static get MAPPINGS() {
    return {
      4: 'thrust', // D-pad up
      14: 'thrust', // X
      7: 'left', // D-pad left
      5: 'right' // D-pad right
    }
  }

  static get MS_SAMPLE() {
    return 50
  }

  constructor(eventStream) {
    this.events = eventStream
    this.state = {}
    this.bindToEvents()
  }

  getGamepad() {
    return navigator.getGamepads().find(pad => {
      return pad
    })
  }

  bindToEvents() {
    setInterval(() => {
      const gamepad = this.getGamepad()

      if(!gamepad) {
        return
      }

      this.setStateFromButtons(gamepad.buttons)
    }, GamepadInput.MS_SAMPLE)
  }

  setStateFromButtons(buttons) {
    let newState = {}

    buttons.forEach((button, buttonIndex) => {
      if(button.pressed) {
        let action = GamepadInput.MAPPINGS[buttonIndex]

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
