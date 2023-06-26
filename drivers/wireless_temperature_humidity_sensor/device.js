'use strict';

const { CLUSTER } = require('zigbee-clusters');
const BatteryDevice = require('../../lib/BatteryDevice');

class WirelessTemperatureHumiditySensor extends BatteryDevice {

  async onNodeInit({ zclNode, node }) {
    // Set up battery capability
    super.onNodeInit({ zclNode });

    // Wait a bit to allow the device to process the queued messages due to the low polling rate
    await new Promise(resolve => setTimeout(() => resolve(), 2000));

    this.registerCapability('measure_temperature', CLUSTER.TEMPERATURE_MEASUREMENT, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          // Maximally every ~16 hours
          maxInterval: 60000,
          // A minimal change of .1 degrees
          minChange: 10,
        },
      },
    });

    // Wait a bit to allow the device to process the queued messages due to the low polling rate
    await new Promise(resolve => setTimeout(() => resolve(), 2000));

    this.registerCapability('measure_humidity', CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          // Maximally every ~16 hours
          maxInterval: 60000,
          // A minimal change of .1 degrees
          minChange: 10,
        },
      },
    });
  }

}

module.exports = WirelessTemperatureHumiditySensor;
