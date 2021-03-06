/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var dgram = require('dgram');

module.exports = function UDPServerMock(port, callback, ready) {
    var server = dgram.createSocket('udp4');

    server.on('error', function(err) {
        console.log('UDPServerMock: server error:\n' + err.stack);
        callback(err.stack);
        server.close();
    });

    server.on('message', function(msg, rinfo) {
        console.log('UDPServerMock: server got: ' + msg + ' from ' +
            rinfo.address + ':' + rinfo.port);
        callback(null, msg.toString());
    });

    server.on('listening', function() {
        var address = server.address();
        console.log('UDPServerMock: server listening ' +
        address.address + ':' + address.port);
        ready(server.address().port);
    });

    server.bind(port);
};

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err.stack);
});
