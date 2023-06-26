'use strict';

const BatteryDevice = require('./BatteryDevice');

/**
 * Class used for devices that are battery powered and include IASZone cluster functionality
 */
class BatteryIASZoneDevice extends BatteryDevice {

  /**
     * @typedef {object} HandlerConfiguration
     * @property {function} [alarm1On]
     * @property {function} [alarm1Off]
     * @property {function} [alarm2On]
     * @property {function} [alarm2Off]
     * @property {function} [tamperOn]
     * @property {function} [tamperOff]
     * @property {function} [batteryOn]
     * @property {function} [batteryOff]
     * @property {function} [supervisionReportsOn]
     * @property {function} [supervisionReportsOff]
     * @property {function} [restoreReportsOn]
     * @property {function} [restoreReportsOff]
     * @property {function} [troubleOn]
     * @property {function} [troubleOff]
     * @property {function} [acMainsOn]
     * @property {function} [acMainsOff]
     * @property {function} [testOn]
     * @property {function} [testOff]
     * @property {function} [batteryDefectOn]
     * @property {function} [batteryDefectOff]
     *
     */
    /**
     * Contains the handlers for each status change
     * @type HandlerConfiguration
     */
    _handlers = {};

    /**
     * Handle any change seen in the zone status
     * @param zoneStatus
     * @protected
     */
    _zoneStatusChangeNotificationHandler({ zoneStatus }) {
      const statusArray = zoneStatus.getBits();
      this.log('Zone Status change seen: ', zoneStatus, statusArray);
      // Determine the differences with the previous status, as a status might be added or removed and needs to be handled in both cases
      let onChangesArray = [];
      let offChangesArray = [];
      if (this.currentStatusArray) {
        // These are new
        onChangesArray = statusArray.filter(status => !this.currentStatusArray.includes(status));
        // These are removed
        offChangesArray = this.currentStatusArray.filter(status => !statusArray.includes(status));
      } else {
        // No previous status, so all statuses are new
        onChangesArray = statusArray;
      }
      // Determine handlers for differences seen
      const handlerNames = [];
      onChangesArray.forEach(status => {
        handlerNames.push(`${status}On`);
      });
      offChangesArray.forEach(status => {
        handlerNames.push(`${status}Off`);
      });
      // Invoke handlers for all actions in this change
      handlerNames.forEach(handlerName => {
        // Invoke the right handler
        const handler = this._handlers[handlerName];
        if (handler) {
          this.log('Invoking handler:', handlerName);
          Promise.resolve(handler.call(this)).catch(e => this.error('Error invoking handler:', handlerName, e));
        } else {
          this.log('No handler for:', handlerName);
        }
      });
      this.currentStatusArray = statusArray;
    }

}

module.exports = BatteryIASZoneDevice;
