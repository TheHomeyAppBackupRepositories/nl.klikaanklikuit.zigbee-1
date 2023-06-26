'use strict';

const { BoundCluster } = require('zigbee-clusters');

class OnOffBoundCluster extends BoundCluster {

  constructor({
    onSetOff, onSetOn, onWithTimedOff, onToggle, offWithEffect,
  }) {
    super();
    this._onToggle = onToggle;
    this._onWithTimedOff = onWithTimedOff;
    this._onSetOff = onSetOff;
    this._onSetOn = onSetOn;
    this._offWithEffect = offWithEffect;
  }

  toggle(args, { groupId }) {
    if (typeof this._onToggle === 'function') {
      this._onToggle(args, groupId);
    }
  }

  onWithTimedOff({ onOffControl, onTime, offWaitTime }, { groupId }) {
    if (typeof this._onWithTimedOff === 'function') {
      this._onWithTimedOff({ onOffControl, onTime, offWaitTime }, groupId);
    }
  }

  setOn(args, { groupId }) {
    if (typeof this._onSetOn === 'function') {
      this._onSetOn(args, groupId);
    }
  }

  setOff(args, { groupId }) {
    if (typeof this._onSetOff === 'function') {
      this._onSetOff(args, groupId);
    }
  }

  offWithEffect({ effectIdentifier, effectVariant }, { groupId }) {
    if (typeof this._offWithEffect === 'function') {
      this._offWithEffect({ effectIdentifier, effectVariant }, groupId);
    }
  }

}

module.exports = OnOffBoundCluster;
