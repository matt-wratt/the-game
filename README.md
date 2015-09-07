# The Game

## Set-up

Install dependencies:

    npm install

Start a watcher:

    npm run dev

Start the server
  
    npm start

Open `http://localhost:8080`


## Messaging Spec

_Still being worked out._

### Format

The client and the server exchange messages encoded with [MessagePack](http://msgpack.org/)\*.

Each message must have the following structure:

    {
        type: "...",
        data: { ... }
    }

\* We're still evaluating the performance of encoding with MessagePack versus the bandwidth of plain JSON.

### Client

The client may send any of the following events:

1. `join` with `{ name: '<name-of-player>'}`
2. `inputState` with `{ <action>: <true|false>, ... }`
3. `leave`

The server may periodically broadcast a `state` event with the following `data`:

```
{
  ships: [
    { x: <float>, y: <float>, rotation: <radians>, name: <string>, hasDoge: <boolean>, ... },
    ...
  ]
}
```
