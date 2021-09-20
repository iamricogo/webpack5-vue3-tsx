export enum Events {
  LOAD = 'game-load',
  LOAD_PROGRESS = 'game-load-progress',
  LOAD_TEXT = 'game-load-text',
  LOAD_ERROR = 'game-load-error',
  LOAD_COMPLETE = 'game-load-complete',

  SOUND_LOAD_PROGRESS = 'game-sound-load-progress',
  SOUND_LOAD_COMPLETE = 'game-sound-load-complete',

  GAME_INIT = 'game-init',
  GAME_ENTER = 'game-enter',
  STATE_CHANGE = 'game-screen-state',
  RESIZE = 'game-resize',

  TICKER = 'ticker'
}
