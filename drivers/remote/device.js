'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');

const { CLUSTER } = require('zigbee-clusters');

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster');
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster');

class Remote extends ZigBeeDevice {

    static GROUPS_STORE_KEY = 'groups';

    async onNodeInit({ zclNode }) {
      // Bind on/off button commands
      zclNode.endpoints[1].bind(CLUSTER.ON_OFF.NAME, new OnOffBoundCluster({
        offWithEffect: this._onOffCommandHandler.bind(this, 'off'),
        onSetOn: this._onOffCommandHandler.bind(this, 'on'),
      }));

      // Bind long press on/off button commands
      zclNode.endpoints[1].bind(CLUSTER.LEVEL_CONTROL.NAME, new LevelControlBoundCluster({
        onMove: this._moveCommandHandler.bind(this),
      }));

      // Get groups, either from device on first init or from store if init was already done. If getting these groups during pairing failed, device can not be used and must be repaired.
      zclNode.endpoints[1].clusters[CLUSTER.TOUCHLINK.NAME]['onGetGroups.response'] = this._handleGroupsResponse.bind(this);
      if (this.isFirstInit()) {
        // Request from device. Will fail if the device is sleeping, but this should not happen on first init as has just been paired.
        await zclNode.endpoints[1].clusters.touchlink.getGroups().catch(err => this._handleGroupError(zclNode));
      } else if (this.getStoreValue(Remote.GROUPS_STORE_KEY)) {
        this.groups = this.getStoreValue(Remote.GROUPS_STORE_KEY);
        this.log('Groups found', this.groups);
      } else {
        this._handleGroupError(zclNode);
      }
    }

    /**
     * Trigger a Flow based on the `type` parameter.
     * @param {'on'|'off'} type
     * @param args
     * @param groupId
     * @private
     */
    _onOffCommandHandler(type, args, groupId) {
      if (type !== 'on' && type !== 'off') throw new Error('invalid_onoff_type');
      this._triggerFlowWithLog(type, groupId);
    }

    /**
     * Handles `onMove` and `onMoveWithOnOff` commands and triggers a Flow based on the `mode`
     * parameter.
     * @param {'up'|'down'} moveMode
     * @param groupId
     * @private
     */
    _moveCommandHandler({ moveMode }, groupId) {
      if (typeof moveMode === 'string') {
        this._triggerFlowWithLog(`dim_${moveMode}`, groupId);
      }
    }

    _triggerFlowWithLog(flowId, groupId) {
      if (this.groups === undefined) return; // No groups found, device must be repaired
      this.log('Group ID', groupId);
      const flowIndex = this.groups.findIndex(id => id === groupId);
      this.log('Flow index:', flowIndex);
      if (flowIndex === -1) return; // Unknown group, ignore. Might be that a button was pressed too fast after pairing.
      this.triggerFlow({ id: flowId + flowIndex })
        .then(() => this.log('flow was triggered', flowId + flowIndex))
        .catch(err => this.error('Error: triggering flow', flowId + flowIndex, err));
    }

    _handleGroupsResponse({ groups }) {
      this.log('Groups received: ', groups);
      const groupIds = groups.map(group => group.groupId).sort((a, b) => a - b);
      this.setStoreValue(Remote.GROUPS_STORE_KEY, groupIds);
      this.groups = groupIds;
      this.log('Group IDs stored: ', groupIds);
    }

    _handleGroupError(zclNode) {
      this.setUnavailable(this.homey.__('flow_unknown_no_groups'));
      this.error('Groups not found, device must be repaired', zclNode);
    }

}

module.exports = Remote;
