export default [
  // The first adapter in this file to return true from match(gamepad) will be
  // used. If no adapter matches, the gamepad is not supported.

  {
    name: "PlayStation 3",
    match: function(gamepad) {
      return gamepad.id.indexOf("PLAYSTATION(R)3 Controller") != 0
    },
    mappings: {
      4: 'thrust', // D-pad up
      14: 'thrust', // X
      7: 'left', // D-pad left
      5: 'right' // D-pad right
    }
  }

]
