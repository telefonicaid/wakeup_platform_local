/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var log = require('../../shared_libs/logger'),
    dgram = require('dgram');

module.exports.info = {
    name: 'UDPSandman',
    type: 'sandman',
    protocol: 'udp',
    description: 'This sandman will wakeup using UDP datagrams'
};

module.exports.entrypoint = function sandmanUdp(ip, port, payload, trackingId) {
    // UDP Notification Message
    var udp4Client = dgram.createSocket('udp4');
    udp4Client.send(
    payload, 0, payload.length,
    port, ip,
    function(err/*, bytes*/) {
        if (err) {
            log.info(Date.now() + ' -- ' + trackingId + ' -- ' + ip +
            ':' + port + ' -- udp -- KO');
        } else {
            log.info(Date.now() + ' -- ' + trackingId + ' -- ' + ip +
            ':' + port + ' -- udp -- OK');
            udp4Client.close();
        }
    });
};
