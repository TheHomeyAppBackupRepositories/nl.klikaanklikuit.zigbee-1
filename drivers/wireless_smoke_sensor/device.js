'use strict';

const BatteryIASZoneReportingDevice = require('../../lib/BatteryIASZoneReportingDevice');

class WirelessSmokeSensor extends BatteryIASZoneReportingDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this._handlers = {
      alarm1On: () => this.setCapabilityValue('alarm_smoke', true),
      alarm1Off: () => this.setCapabilityValue('alarm_smoke', false),
    };
  }

}

module.exports = WirelessSmokeSensor;
