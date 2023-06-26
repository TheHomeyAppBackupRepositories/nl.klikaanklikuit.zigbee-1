'use strict';

const BatteryIASZoneReportingDevice = require('../../lib/BatteryIASZoneReportingDevice');

class WirelessLeakageSensor extends BatteryIASZoneReportingDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this._handlers = {
      alarm1On: () => this.setCapabilityValue('alarm_water', true),
      alarm1Off: () => this.setCapabilityValue('alarm_water', false),
      tamperOn: () => this._triggerFlowWithLog('tamper_on'),
      tamperOff: () => this._triggerFlowWithLog('tamper_off'),
      restoreReportsOn: () => null,
      restoreReportsOff: () => null,
    };
  }

  _triggerFlowWithLog(flowId) {
    this.triggerFlow({ id: flowId })
      .then(() => this.log('flow was triggered', flowId))
      .catch(err => this.error('Error: triggering flow', flowId, err));
  }

}

module.exports = WirelessLeakageSensor;
