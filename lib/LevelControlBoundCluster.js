'use strict';

const { BoundCluster } = require('zigbee-clusters');

class LevelControlBoundCluster extends BoundCluster {

  constructor({
    onStep,
    onStepWithOnOff,
    onMove,
    onStopWithOnOff,
    onStop,
    onMoveWithOnOff,
  }) {
    super();
    this._onStep = onStep;
    this._onStepWithOnOff = onStepWithOnOff;
    this._onMove = onMove;
    this._onStopWithOnOff = onStopWithOnOff;
    this._onStop = onStop;
    this._onMoveWithOnOff = onMoveWithOnOff;
  }

  step(payload, { groupId }) {
    if (typeof this._onStep === 'function') {
      this._onStep(payload, groupId);
    }
  }

  stepWithOnOff(payload, { groupId }) {
    if (typeof this._onStepWithOnOff === 'function') {
      this._onStepWithOnOff(payload, groupId);
    }
  }

  move(payload, { groupId }) {
    if (typeof this._onMove === 'function') {
      this._onMove(payload, groupId);
    }
  }

  moveWithOnOff(payload, { groupId }) {
    if (typeof this._onMoveWithOnOff === 'function') {
      this._onMoveWithOnOff(payload, groupId);
    }
  }

  stop(payload, { groupId }) {
    if (typeof this._onStop === 'function') {
      this._onStop(payload, groupId);
    }
  }

  stopWithOnOff(payload, { groupId }) {
    if (typeof this._onStopWithOnOff === 'function') {
      this._onStopWithOnOff(payload, groupId);
    }
  }

}

module.exports = LevelControlBoundCluster;
