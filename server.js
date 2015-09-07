import http from 'http'
import ws from 'ws'
import fs from 'fs'
import msgpack from 'msgpack-js'

import Game from './lib/server/game'

const PORT = process.env.PORT || 8080

var app = http.createServer(handler)
var wss = new ws.Server({ server: app })

app.listen(PORT)

console.log('Running on port ' + PORT)

function handler (req, res) {
  var path = '/' + (req.url.replace(/^\//, '') || 'index.html')

  console.log(req.method, path)

  if (path == '/debug.json') {
    let debug = {
      state: game.state
    }
    return res.end(JSON.stringify(debug))
  }

  fs.readFile(__dirname + path, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end('Not found: ' + path);
    }

    res.writeHead(200);
    res.end(data);
  });
}

const timeStepInMs = 20

var game = new Game()

setInterval(function() {
  game.tick(timeStepInMs / 500)
  game.ships.forEach(function(ship) {
    try {
      ship.client.send(msgpack.encode({type: 'state', data: game.state}))
    } catch (e) {
      console.log(e)
    }
  })
}, timeStepInMs)

wss.on('connection', function (client) {
  console.log('Connection registered')
  let ship

  client.on('message', function (encoded) {
    let message = msgpack.decode(encoded)

    switch(message.type) {
      case 'join':
        ship = game.addShip(client, message.data.name)
      case 'inputState':
        ship.thrusting = message.data.thrust
        ship.left = message.data.left
        ship.right = message.data.right
    }

  });

  client.on('close', function() {
    game.removeShip(ship)
    console.log('Connection closed')
  })
});
