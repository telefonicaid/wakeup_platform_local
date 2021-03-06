/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var local = require('./main');
var server = new local.WULocalServer();
server.start();

/////////////////////////
// On close application
function onClose() {
    console.info('Received interruption (2) signal');
    server.stop();

}
function onKill() {
    console.info('Received termination (15) signal');
    server.stop();
}
process.on('SIGINT', onClose);    // 2
process.on('SIGTERM', onKill);    // 15
