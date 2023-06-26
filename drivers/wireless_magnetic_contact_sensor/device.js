'use strict';

const BatteryIASZoneNotificationDevice = require('../../lib/BatteryIASZoneNotificationDevice');

class WirelessMagneticContactSensor extends BatteryIASZoneNotificationDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this._handlers = {
      alarm1On: () => this.setCapabilityValue('alarm_contact', true),
      alarm1Off: () => this.setCapabilityValue('alarm_contact', false),
    };
  }

}

module.exports = WirelessMagneticContactSensor;
