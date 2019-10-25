"use strict"
const Servient = require("@node-wot/core").Servient;
const HttpClientFactory = require("@node-wot/binding-http").HttpClientFactory;
const HttpsClientFactory = require("@node-wot/binding-http").HttpsClientFactory;
const CoapClientFactory = require("@node-wot/binding-coap").CoapClientFactory;
const CoapsClientFactory = require("@node-wot/binding-coap").CoapsClientFactory;
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;

module.exports = function(RED) {
    function consumedThingNode(config) {
        RED.nodes.createNode(this, config);

        this.tdLink = config.tdLink;
        this.td = config.td;

        this.consumedThing = new Promise((resolve, reject) => {
            let servient = new Servient();

            if (config.http) {
                servient.addClientFactory(new HttpClientFactory());
                servient.addClientFactory(new HttpsClientFactory());
            }
            if (config.coap) {
                servient.addClientFactory(new CoapClientFactory());
                servient.addClientFactory(new CoapsClientFactory());
            }
            if (config.mqtt) {
                servient.addClientFactory(new MqttClientFactory());
            }

            servient.start().then((thingFactory) => {
                let consumedThing = thingFactory.consume(this.td);
                resolve(consumedThing);
            })
        })
    }
    RED.nodes.registerType("consumed-thing",consumedThingNode);
}