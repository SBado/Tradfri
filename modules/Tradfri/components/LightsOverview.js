(function () {
    'use strict';

    angular.module('tradfri')
        .component('lightsOverview', {
            templateUrl: 'modules/Tradfri/components/templates/LightsOverview.html',
            controller: LightsOverviewController
        });

    function LightsOverviewController($timeout) {

        var $ctrl = this;
        $ctrl.lights = [];
        $ctrl.states = [];

        // Create a client instance       

        var client = new Paho.MQTT.Client("sbaldo.monopolepower.com", Number(8884), '/mqtt', 'Browser_' + Math.random().toString());

        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        var options = {
            //connection attempt timeout in seconds
            timeout: 3,        
            //Gets Called if the connection has successfully been established
            onSuccess: onConnect,
            userName: "ste",
            password: "kuM16&5U$rl32S0@Z#qc",
            useSSL: true
        };

        // connect the client
        client.connect(options);

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            client.subscribe("light/name/all");
            client.subscribe("light/state/single/byIndex");
            client.subscribe("light/state/all");
            var message = new Paho.MQTT.Message("");
            message.destinationName = "get/light/name/all";
            client.publish(message);
            message.destinationName = "get/light/state/all";
            client.publish(message);
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {
            console.log(message.destinationName);
            console.log("onMessageArrived:" + message.payloadString);

            if (message.destinationName == 'light/name/all') {
                $timeout(function () {
                    $ctrl.lights = []
                    var payloadList = message.payloadString.split(';');
                    payloadList.map(function (p) {
                        var info = p.split(':');
                        var light = {
                            index: Number(info[0]),
                            name: info[1]
                        }
                        $ctrl.lights.push(light);
                    });
                });
            }
            else if (message.destinationName == 'light/state/single/byIndex') {
                $timeout(function () {
                    var payloadList = message.payloadString.split(':');                    
                    var index = Number(payloadList[0]);
                    var status = Number(payloadList[1]);
                    $ctrl.states[index] = status;
                });
            }
            else if (message.destinationName == 'light/state/all') {
                $timeout(function () {
                    var payloadList = message.payloadString.split(';');
                    $ctrl.states = new Array(payloadList.length);
                    payloadList.map(function (p) {
                        var info = p.split(':');
                        var index = Number(info[0]);
                        var status = Number(info[1]);
                        $ctrl.states[index] = status;
                    });
                });
            }

        }

        function switchLight(lightIndex) {
            var message = new Paho.MQTT.Message(lightIndex.toString());
            message.destinationName = "switch/light/single";
            client.publish(message);
        }

        $ctrl.switchLight = switchLight;
    }

})();