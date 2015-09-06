import p2 from 'p2'

export default class Ship {
  get size() {
    return 30
  }

  get body() {
    this._body = this._body || this.buildBody()
    return this._body
  }

  constructor() {
    this.hasDoge = false
  }

  tick(timeStep) {
    if(this.thrusting) {
      this.body.applyForceLocal([0, 20000], [0, -this.size / 2])
    }

    if(this.left) {
      this.body.applyForceLocal([-5000, 0], [0, this.size / 2])
    }

    if(this.right) {
      this.body.applyForceLocal([5000, 0], [0, this.size / 2])
    }
  }

  buildBody() {
    let body = new p2.Body({
      mass: 500,
      allowSleep: false,
      position: [Math.random() * 500, - Math.random() * 200]
    })

    let shape = new p2.Convex({
      vertices: [
        [0, this.size / 2],
        [-this.size / 2, -this.size / 2],
        [this.size / 2, -this.size / 2]
      ]
    })
    body.addShape(shape)

    body.ship = this

    return body
  }

  get rotation() {
    return this.body.angle
  }

  get x() {
    return this.body.position[0]
  }

  get y() {
    return -this.body.position[1]
  }

  get state() {
    return {
      colour: this.colour,
      x: Math.round(this.x),
      y: Math.round(this.y),
      rotation: Number(this.rotation.toFixed(2)),
      thrusting: this.thrusting || null,
      doge: this.hasDoge,
      name: this.name
    }
  }
}
