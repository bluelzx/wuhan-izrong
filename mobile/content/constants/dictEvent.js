
const keyMirror = require('keymirror');

const DictEvent = keyMirror({

  /**
   * Default event.
   */
  Default_EVENT: null,

  /**
   * IM events.
   */

  IM_SESSION: null,
  IM_CHANGE: null,
  IM_ADD: null,
  IM_UPDATE: null,

  /**
   * Market events.
   */
  MARKET_CHANGE: null,

  /**
   * User events.
   */
  USER_CHANGE: null,
});

module.exports = DictEvent;
