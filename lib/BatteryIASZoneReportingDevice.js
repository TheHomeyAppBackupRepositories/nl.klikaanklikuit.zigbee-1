'use strict';

const { CLUSTER } = require('zigbee-clusters');
const BatteryIASZoneDevice = require('./BatteryIASZoneDevice');

/**
 * Class used for devices that are battery powered and include IASZone cluster functionality based on attribute reports
 */
class BatteryIASZoneReportingDevice extends BatteryIASZoneDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });
    if (this.isFirstInit()) {
      // Device will send a report when a change happens, so we need to configure this
      this.configureAttributeReporting([
        {
          endpointId: 1,
          cluster: CLUSTER.IAS_ZONE,
          attributeName: 'zoneStatus',
          minInterval: 0,
          maxInterval: 60000,
          minChange: 0,
        },
      ]).catch(e => this.error('Error: could not configure attribute reporting', e));
    }

    // Handle a report
    zclNode.endpoints[1].clusters.iasZone.on(
      'attr.zoneStatus',
      this._zoneStatusChangeHandler.bind(this),
    );
  }

  _zoneStatusChangeHandler(zoneStatus) {
    super._zoneStatusChangeNotificationHandler({ zoneStatus });
  }

}

module.exports = BatteryIASZoneReportingDevice;
