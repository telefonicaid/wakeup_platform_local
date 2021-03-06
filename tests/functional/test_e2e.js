/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2014 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela at tid dot es>
 * Guillermo López Leal <gll at tid dot es>
 */

'use strict';

var mockUDPServer = require('../mocks/udp_server_mock'),
    mockTCPServer = require('../mocks/tcp_server_mock'),
    assert = require('assert'),
    request = require('request'),
    vows = require('vows');

var serverTimeout = null;
var serverTimeoutGracePeriod = 30000;

vows.describe('Local node E2E tests').addBatch({
    'TCP wakeup package (GET)': {
        topic: function initTCPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockTCPServer(0, this.callback, function onMockServerStarted(port) {
                request({
                    url: 'http://localhost:9000/wakeup?proto=tcp&ip=127.0.0.1&port=' +
                    port,
                    headers: {
                        'x-real-ip': '127.0.0.1',
                        'x-forwarded-for': '127.0.0.1',
                        'x-client-cert-dn': 'DN=Testing',
                        'x-client-cert-verified': 'SUCCESS'
                    }
                });
            });
        },

        'Mock server responded (no timeout)': function(err, data) {
            clearTimeout(serverTimeout);
            assert.isNull(err);
            assert.isNotNull(data);
        },

        'Received data has the expected format': function(err, data) {
            assert.isString(data);
            assert.equal(data.substr(0, 6), 'NOTIFY');
        }
    },

    'UDP wakeup package (GET)': {
        topic: function initUDPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockUDPServer(0, this.callback, function onMockServerStarted(port) {
                request({
                    url: 'http://localhost:9000/wakeup?ip=127.0.0.1&port=' + port,
                    headers: {
                        'x-real-ip': '127.0.0.1',
                        'x-forwarded-for': '127.0.0.1',
                        'x-client-cert-dn': 'DN=Testing',
                        'x-client-cert-verified': 'SUCCESS'
                    }
                });
            });
        },

        'Mock server responded (no timeout)': function(err, data) {
            clearTimeout(serverTimeout);
            assert.isNull(err);
            assert.isNotNull(data);
        },

        'Received data has the expected format': function(err, data) {
            assert.isString(data);
            assert.equal(data.substr(0, 6), 'NOTIFY');
        }
    },

    'TCP wakeup package (POST)': {
        topic: function initTCPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockTCPServer(0, this.callback, function onMockServerStarted(port) {
                var body = 'proto=tcp&ip=127.0.0.1&port=' + port;
                var url = 'http://localhost:9000/wakeup';
                request.post(url, {
                    body: body,
                    headers: {
                        'x-real-ip': '127.0.0.1',
                        'x-forwarded-for': '127.0.0.1',
                        'x-client-cert-dn': 'DN=Testing',
                        'x-client-cert-verified': 'SUCCESS'
                    }
                }, function(error, response/*, body*/) {
                    if (error) {
                        self.callback(error.toString());
                        return;
                    }
                    if (response.statusCode !== 200) {
                        self.callback('Bad statusCode=' + response.statusCode);
                        return;
                    }
                });
            });
        },

        'Mock server responded (no timeout)': function(err, data) {
            clearTimeout(serverTimeout);
            assert.isNull(err);
            assert.isNotNull(data);
        },

        'Received data has the expected format': function(err, data) {
            assert.isString(data);
            assert.equal(data.substr(0, 6), 'NOTIFY');
        }
    },

    'UDP wakeup package (POST)': {
        topic: function initUDPMockServer() {
            var self = this;
            serverTimeout = setTimeout(function() {
                console.log('error');
                self.callback('No response received from server!');
            }, serverTimeoutGracePeriod);
            // Listen on a random PORT
            mockUDPServer(0, this.callback, function onMockServerStarted(port) {
                var body = 'ip=127.0.0.1&port=' + port;
                var url = 'http://localhost:9000/wakeup';
                request.post(url, {
                    body: body,
                    headers: {
                        'x-real-ip': '127.0.0.1',
                        'x-forwarded-for': '127.0.0.1',
                        'x-client-cert-dn': 'DN=Testing',
                        'x-client-cert-verified': 'SUCCESS'
                    }
                }, function(error, response/*, body*/) {
                    if (error) {
                        self.callback(error.toString());
                        return;
                    }
                    if (response.statusCode !== 200) {
                        self.callback('Bad statusCode=' + response.statusCode);
                        return;
                    }
                });
            });
        },

        'Mock server responded (no timeout)': function(err, data) {
            clearTimeout(serverTimeout);
            assert.isNull(err);
            assert.isNotNull(data);
        },

        'Received data has the expected format': function(err, data) {
            assert.isString(data);
            assert.equal(data.substr(0, 6), 'NOTIFY');
        }
    }
}).export(module);
