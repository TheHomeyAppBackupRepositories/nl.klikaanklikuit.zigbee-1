'use strict';

const BatteryIASZoneReportingDevice = require('../../lib/BatteryIASZoneReportingDevice');

class WirelessCOSensor extends BatteryIASZoneReportingDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this._handlers = {
      alarm1On: () => this.setCapabilityValue('alarm_co', true),
      alarm1Off: () => this.setCapabilityValue('alarm_co', false),
    };
  }

}

module.exports = WirelessCOSensor;
