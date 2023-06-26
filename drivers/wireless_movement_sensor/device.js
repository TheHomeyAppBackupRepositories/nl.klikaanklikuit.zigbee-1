'use strict';

const BatteryIASZoneNotificationDevice = require('../../lib/BatteryIASZoneNotificationDevice');

class WirelessMovementSensor extends BatteryIASZoneNotificationDevice {

  onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this.autoResetTimeout = null;
    this.autoReset = this.getSetting('auto_reset_enabled');
    this.autoResetTime = this.getSetting('auto_reset_time')

    this._handlers = {
      alarm2On: () => this.onMotionDetected(),
      alarm2Off: () => this.onMotionGone(),
    };
  }

  async onMotionDetected() {
    this.debug('Motion detected!');
    this.clearResetTimeout();
    await this.setCapabilityValue('alarm_motion', true);
    this.setResetTimeout();
  }

  async onMotionGone() {
    this.debug('Motion gone!');
    this.clearResetTimeout();
    await this.setCapabilityValue('alarm_motion', false);
  }

  setResetTimeout() {
    this.clearResetTimeout();
    if (!this.autoReset) {
      return;
    }

    this.debug('Autoreset activated', this.autoResetTime);
    this.autoResetTimeout = this.homey.setTimeout(
      async() => {
        this.debug('Auto reset triggered');
        await this.onMotionGone().catch(this.error);

        // This line makes sure a new message triggers the alarm2On handler once a new message is received.
        this.currentStatusArray = this.currentStatusArray.filter((s) => s !== 'alarm2');
      },
      this.autoResetTime * 1000,
    );
  }

  clearResetTimeout() {
    if (this.autoResetTimeout === null) {
      return;
    }

    this.debug('Clearing autoreset timeout');
    clearTimeout(this.autoResetTimeout);
    this.autoResetTimeout = null;
  }

  onSettings({ newSettings }) {
    this.debug('New settings received', newSettings);
    this.autoReset = newSettings['auto_reset_enabled'];
    this.autoResetTime = newSettings['auto_reset_time'];

    // Reset timeout when alarm is active
    if (this.getCapabilityValue('alarm_motion')) {
      this.setResetTimeout();
    }
  }
}

module.exports = WirelessMovementSensor;
