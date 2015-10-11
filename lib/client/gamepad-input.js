import * as GamepadAdapters from './gamepad-adapters'

export default class GamepadInput {

  static get MS_SAMPLE() {
    return 50
  }

  constructor(eventStream) {
    this.events = eventStream
    this.state = {}
    this.pendingState = {}
    this.bindToEvents()
  }

  getGamepad() {
    let adapter, gamepad

    Array.prototype.some.call(navigator.getGamepads(), pad => {
      // getGamepads() can return null entries
      if(pad) {
        gamepad = pad
        adapter = GamepadAdapters.all.find(adapter => adapter.match(pad))
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

      this.resetState()
      this.setStateFromButtons(gamepad.pad.buttons, gamepad.adapter)
      this.setStateFromAxes(gamepad.pad.axes, gamepad.adapter)
      this.flushState()
    }, GamepadInput.MS_SAMPLE)
  }

  setStateFromButtons(buttons, adapter) {
    if(!adapter.buttons) {
      return
    }

    buttons.forEach((button, buttonIndex) => {
      if(button.pressed) {
        let action = adapter.buttons[buttonIndex]

        if(action) {
          this.pendingState[action] = true
        }
      }
    })
  }

  setStateFromAxes(axes, adapter) {
    if(!adapter.axes) {
      return
    }

    axes.forEach((axis, axisIndex) => {
      let reading, action
      let axisActions = adapter.axes[axisIndex]

      if(!axisActions) {
        return
      }

      if(axis == 1) {
        reading = 'positive'
      } else if(axis == -1) {
        reading = 'negative'
      }

      action = axisActions[reading]

      if(action) {
        this.pendingState[action] = true
      }
    })
  }

  isDifferent(newState) {
    // Fast comparison
    return JSON.stringify(this.state) !== JSON.stringify(newState)
  }

  resetState() {
    this.pendingState = {}
  }

  flushState() {
    if(this.isDifferent(this.pendingState)) {
      this.state = this.pendingState
      this.events.broadcast('stateChange', this.state)
    }
  }
}
