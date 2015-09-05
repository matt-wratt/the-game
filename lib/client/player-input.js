import EventStream from './event-stream'

export default class PlayerInput {
  constructor(...inputSources) {
    this.events = new EventStream()
    this.state = {}
    this.inputSources = inputSources
    this.bindToEvents()
  }

  bindToEvents() {
    this.inputSources.forEach(source => new source(this.events))
  }
}
