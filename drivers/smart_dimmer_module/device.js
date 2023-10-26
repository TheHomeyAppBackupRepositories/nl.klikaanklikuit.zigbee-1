'use strict';

const { ZigBeeLightDevice } = require('homey-zigbeedriver');
const { debounce, limitValue } = require('homey-zigbeedriver/lib/util');

class SmartDimmerModule extends ZigBeeLightDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({
      zclNode,
      supportsHueAndSaturation: false,
      supportsColorTemperature: false,
    });

    this.onOffCluster.on('attr.onOff', value => this.setCapabilityValue('onoff', value).catch(this.error));

    // Even though it does not seem possible to dim the device with the connected switch directly,
    // it does report its current level, so we need to act on it.
    const debouncedDimSetter = debounce(
      value => this.setCapabilityValue('dim', limitValue(value / 254, 0, 1)).catch(this.error),
      1000, // Largest interval seen between reported levels during dim action
    );
    this.levelControlCluster.on('attr.currentLevel', debouncedDimSetter);
  }

}

module.exports = SmartDimmerModule;
