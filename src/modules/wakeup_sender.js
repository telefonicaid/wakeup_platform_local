/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

var log = require('../shared_libs/logger'),
    fs = require('fs'),
    plugins_loader = require('../shared_libs/plugins_loader');

plugins_loader.load('modules/sandmans');
var sandmans = plugins_loader.getSandmans();

function wakeup_sender() {
}

wakeup_sender.prototype = {
  wakeup: function _wakeup(ip, port, protocol, tracking_id) {
    log.debug('WU_Sender::wakeup => ' + tracking_id + ', ' +
      ip + ':' + port + ' through ' + protocol);
    var message = new Buffer('NOTIFY ' + ip + ':' + port);

    if (sandmans[protocol]) {
      sandmans[protocol](ip, port, message, tracking_id);
    } else {
      log.error('Protocol (' + protocol + ') not supported');
    }
  }
};

var wusender = new wakeup_sender();
function getWakeUpSender() {
  return wusender;
}
module.exports = getWakeUpSender();
