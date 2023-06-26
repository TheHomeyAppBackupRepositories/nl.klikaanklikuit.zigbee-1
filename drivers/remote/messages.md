on:
- onOff: setOn

off:
- onOff: offWithEffect

dim_up:
- levelControl: move (up)
- (wait)
- levelControl: stop

dim_down:
- levelControl: move (down)
- (wait)
- levelControl: stop
