/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var log = require('../shared_libs/logger'),
    pluginsLoader = require('../shared_libs/plugins_loader');

pluginsLoader.load('modules/sandmans');
var sandmans = pluginsLoader.getSandmans();

function WakeupSender() {
}

WakeupSender.prototype = {
    wakeup: function _wakeup(ip, port, protocol, trackingId) {
        log.debug('WU_Sender::wakeup => ' + trackingId + ', ' +
          ip + ':' + port + ' through ' + protocol);
        var message = new Buffer('NOTIFY ' + ip + ':' + port);

        if (sandmans[protocol]) {
            sandmans[protocol](ip, port, message, trackingId);
        } else {
            log.error('Protocol (' + protocol + ') not supported');
        }
    }
};

var wusender = new WakeupSender();
function getWakeUpSender() {
    return wusender;
}
module.exports = getWakeUpSender();
