(function () {
    'use strict';

    angular.module('tradfri')
        .component('smartLight', {
            templateUrl: 'modules/Tradfri/components/templates/Light.html',            
            bindings: {
                lightIndex: '<',
                lightName: '<',
                lightStatus: '<',
                lightSwitch: '<'
            }
        });   
})();