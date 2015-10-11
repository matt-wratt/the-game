export default {
  // The first adapter in this file to return true from match(gamepad) will be
  // used. If no adapter matches, the gamepad is not supported.
  all: [
    {
      name: "PlayStation 3",
      match: function(gamepad) {
        return gamepad.id.indexOf("PLAYSTATION(R)3 Controller") >= 0
      },
      buttons: {
        4: 'thrust', // D-pad up
        14: 'thrust', // X
        7: 'left', // D-pad left
        5: 'right', // D-pad right
        9: 'thrust'
      },
      axes: {
        0: { negative: 'left', positive: 'right' },
        1: { negative: 'thrust' },
        2: { negative: 'left', positive: 'right' },
        3: { negative: 'thrust' },
      }
    },

    {
      name: "Imitation SNES Controller",
      match: function(gamepad) {
        return gamepad.id.indexOf('810-e501-usb gamepad') >= 0
      },
      buttons: {
        2: 'thrust', // Yellow B button,
        4: 'left', // Shoulder button left
        5: 'right', // Shoulder button right
      },
      axes: {
        1: { negative: 'left', positive: 'right' },
        2: { negative: 'thrust' },
      }
    },
  ]
}
