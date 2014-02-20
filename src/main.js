/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var config = require('./shared_libs/configuration'),
    log = require('./shared_libs/logger'),
    pluginsLoader = require('./shared_libs/plugins_loader'),
    ListenerHttp = require('./shared_libs/listener_http').ListenerHttp,
    wakeupSender = require('./modules/wakeup_sender');

function WULocalServer() {
    this.httpListeners = [];
}

WULocalServer.prototype = {
    onWakeUpCommand: function(data) {
        wakeupSender.wakeup(data.ip, data.port, data.protocol, data.trackingId);
    },

    start: function() {
        // Start servers
        pluginsLoader.load('routers');
        for (var a in config.interfaces) {
            this.httpListeners[a] = new ListenerHttp(
                config.interfaces[a].ip,
                config.interfaces[a].port,
                config.interfaces[a].ssl,
                pluginsLoader.getRouters(),
                this.onWakeUpCommand);
            this.httpListeners[a].init();
        }
        log.info('WakeUp local server starting');
    },

    stop: function() {
        log.info('WakeUp local server stopping');

        this.httpListeners.forEach(function(server) {
            server.stop();
        });

        log.info('WakeUp local server waiting 10 secs for all servers stops ...');
        setTimeout(function() {
            log.info('WakeUp local server - Bye !');
            process.exit(0);
        }, 10000);
    }
};

exports.WULocalServer = WULocalServer;

