/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

require('./configuration.js');
var sandmanTCP = require('../../src/modules/sandmans/tcp.js'),
    mockTCPServer = require('../mocks/tcp_server_mock'),
    assert = require('assert'),
    vows = require('vows');

var testPayload = new Date().toString();
var serverTimeout = null;
var serverTimeoutGracePeriod = 2000;

vows.describe('Sandman TCP tests').addBatch({
    'Sandman module metadata requirements': {
        'metadata info exists': function() {
            assert.isObject(sandmanTCP.info);
        },
        'metadata info has protocol defined': function() {
            assert.isString(sandmanTCP.info.protocol);
        },
        'metadata info has description defined': function() {
            assert.isString(sandmanTCP.info.description);
        },
        'sandman has an entrypoint function': function() {
            assert.isFunction(sandmanTCP.entrypoint);
        },
        'declared protocol is TCP': function() {
            assert.equal(sandmanTCP.info.protocol, 'tcp');
        }
    },

    'TCP wakeup package': {
        topic: function initTCPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockTCPServer(0, this.callback, function onMockServerStarted(port) {
                // Send some payload using Sandman
                sandmanTCP.entrypoint('127.0.0.1', port, testPayload);
            });
        },

        'Mock server responded (no timeout)': function(err, data) {
            clearTimeout(serverTimeout);
            assert.isNull(err);
            assert.isNotNull(data);
        },

        'Received data is the same we sent': function(err, data) {
            assert.isString(data);
            assert.equal(data, testPayload);
        }
    }
}).export(module);
