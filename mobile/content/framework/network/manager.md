
## API

### Manager(url:String, opts:Object)

  A `Manager` represents a connection to a given WebSocket server. One or
  more `WebSocket` instances are associated with the manager. The manager
  can be accessed through the `io` property of each `WebSocket` instance.

  The `opts` are also passed to the underlying `WebSocket`.

  Options:
  - `reconnection` whether to reconnect automatically (`true`)
  - `reconnectionAttempts` (`Infinity`) before giving up
  - `reconnectionDelay` how long to initially wait before attempting a new
    reconnection (`1000`). Affected by +/- `randomizationFactor`,
    for example the default initial delay will be between 500 to 1500ms.
  - `reconnectionDelayMax` maximum amount of time to wait between
    reconnections (`5000`). Each attempt increases the reconnection delay by 2x
    along with a randomization as above
  - `randomizationFactor` (`0.5`), 0 <= randomizationFactor <= 1
  - `timeout` connection timeout before a `connect_error`
    and `connect_timeout` events are emitted (`20000`)
  - `autoConnect` by setting this false, you have to call `manager.open`
    whenever you decide it's appropriate

#### Events

  - `connect_error`. Fired upon a connection error.
    Parameters:
      - `Object` error object
  - `connect_timeout`. Fired upon a connection timeout.
  - `reconnect`. Fired upon a successful reconnection.
    Parameters:
      - `Number` reconnection attempt number
  - `reconnect_attempt`. Fired upon an attempt to reconnect.
  - `reconnecting`. Fired upon an attempt to reconnect.
    Parameters:
      - `Number` reconnection attempt number
  - `reconnect_error`. Fired upon a reconnection attempt error.
    Parameters:
      - `Object` error object
  - `reconnect_failed`. Fired when couldn't reconnect within `reconnectionAttempts`


The events above are also emitted on the individual sockets that
reconnect that depend on this `Manager`.

### Manager#reconnection(v:Boolean):Manager

  Sets the `reconnection` option, or returns it if no parameters
  are passed.

### Manager#reconnectionAttempts(v:Boolean):Manager

  Sets the `reconnectionAttempts` option, or returns it if no parameters
  are passed.

### Manager#reconnectionDelay(v:Boolean):Manager

  Sets the `reconectionDelay` option, or returns it if no parameters
  are passed.

### Manager#reconnectionDelayMax(v:Boolean):Manager

  Sets the `reconectionDelayMax` option, or returns it if no parameters
  are passed.

### Manager#timeout(v:Boolean):Manager

  Sets the `timeout` option, or returns it if no parameters
  are passed.
