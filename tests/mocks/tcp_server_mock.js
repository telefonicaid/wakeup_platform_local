/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var net = require('net');

module.exports = function TCPServerMock(port, callback, ready) {
    var server = net.createServer(function(c) {
        console.log('TCPServerMock: server connected');
        c.on('end', function() {
            console.log('TCPServerMock: server disconnected');
        });
        c.on('data', function(d) {
            console.log('TCPServerMock: data received - ' + d);
            callback(null, d.toString());
            c.end();
        });
    });
    server.listen(port, '127.0.0.1', function() {
        var address = server.address();
        console.log('TCPServerMock: opened server on %j', address);
        ready(server.address().port);
    });
};
