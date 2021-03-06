/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var log = require('../../shared_libs/logger'),
    net = require('net');

module.exports.info = {
    name: 'TCPSandman',
    type: 'sandman',
    protocol: 'tcp',
    description: 'This sandman will wakeup using TCP packets'
};

module.exports.entrypoint = function sandmanTcp(ip, port, payload, trackingID) {
    // TCP Notification Message
    var tcp4Client = net.createConnection({host: ip, port: port},
        function() { //'connect' listener
            log.debug('TCP Client connected');
            tcp4Client.write(payload);
            tcp4Client.end();
        });
    tcp4Client.on('error', function(e) {
        log.debug('TCP Client error ' + JSON.stringify(e));
        log.info(Date.now() + ' -- ' + trackingID + ' -- ' + ip +
            ':' + port + ' -- tcp -- KO');
    });
    tcp4Client.on('end', function() {
        log.debug('TCP Client disconected');
        log.info(Date.now() + ' -- ' + trackingID + ' -- ' + ip +
          ':' + port + ' -- tcp -- OK');
    });
};
