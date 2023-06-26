'use strict';

const { CLUSTER } = require('zigbee-clusters');
const BatteryIASZoneDevice = require('./BatteryIASZoneDevice');

/**
 * Class used for devices that are battery powered and include IASZone cluster functionality based on notifications sent
 */
class BatteryIASZoneNotificationDevice extends BatteryIASZoneDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });
    // Device will send a command when a zone change happens, which we need to handle
    zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = this._zoneStatusChangeNotificationHandler.bind(this);
  }

}

module.exports = BatteryIASZoneNotificationDevice;
