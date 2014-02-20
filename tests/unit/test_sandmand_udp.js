/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

require('./configuration.js');
var sandmanUDP = require('../../src/modules/sandmans/udp.js'),
    mockUDPServer = require('../mocks/udp_server_mock'),
    assert = require('assert'),
    vows = require('vows');

var testPayload = new Buffer(new Date().toString());
var serverTimeout = null;
var serverTimeoutGracePeriod = 2000;

vows.describe('Sandman UDP tests').addBatch({
    'Sandman module metadata requirements': {
        'metadata info exists': function() {
            assert.isObject(sandmanUDP.info);
        },
        'metadata info has a name defined': function() {
            assert.isString(sandmanUDP.info.name);
        },
        'metadata info has a plugin type defined': function() {
            assert.isString(sandmanUDP.info.type);
        },
        'metadata info has protocol defined': function() {
            assert.isString(sandmanUDP.info.protocol);
        },
        'metadata info has description defined': function() {
            assert.isString(sandmanUDP.info.description);
        },
        'sandman has an entrypoint function': function() {
            assert.isFunction(sandmanUDP.entrypoint);
        },
        'declared protocol is UDP': function() {
            assert.equal(sandmanUDP.info.protocol, 'udp');
        }
    },

    'UDP wakeup package': {
        topic: function initUDPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockUDPServer(0, this.callback, function onMockServerStarted(port) {
                // Send some payload using Sandman
                sandmanUDP.entrypoint('127.0.0.1', port, testPayload);
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
