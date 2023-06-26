'use strict';

const { CLUSTER } = require('zigbee-clusters');
const { ZigBeeDevice } = require('homey-zigbeedriver');

class SmartSocketSwitch extends ZigBeeDevice {

  onNodeInit() {
    // Register onoff capability
    this.registerCapability('onoff', CLUSTER.ON_OFF, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0, // No minimum reporting interval
          maxInterval: 300, // Maximally once every 5 minutes
          minChange: 0,
        },
      },
    });
  }

}

module.exports = SmartSocketSwitch;
