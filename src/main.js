/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

var config = require('./shared_libs/configuration'),
    log = require('./shared_libs/logger'),
    plugins_loader = require('./shared_libs/plugins_loader');
    ListenerHttp = require('./shared_libs/listener_http').ListenerHttp;
    wakeup_sender = require('./modules/wakeup_sender');

function WU_Local_Server() {
  this.http_listeners = [];
}

WU_Local_Server.prototype = {
  onWakeUpCommand: function(data) {
    wakeup_sender.wakeup(data.ip, data.port, data.protocol);
  },

  start: function() {
    // Start servers
    plugins_loader.load('routers');
    for (var a in config.interfaces) {
      this.http_listeners[a] = new ListenerHttp(
        config.interfaces[a].ip,
        config.interfaces[a].port,
        config.interfaces[a].ssl,
        plugins_loader.getRouters(),
        this.onWakeUpCommand);
      this.http_listeners[a].init();
    }

    log.info('WakeUp local server starting');
  },

  stop: function() {
    log.info('WakeUp local server stopping');

    this.http_listeners.forEach(function(server) {
      server.stop();
    });

    log.info('WakeUp local server waiting 10 secs for all servers stops ...');
    setTimeout(function() {
      log.info('WakeUp local server - Bye !');
      process.exit(0);
    }, 10000);
  }
};

exports.WU_Local_Server = WU_Local_Server;

