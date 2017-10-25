(function () {
    var app = angular.module('tradfri', ['ngRoute', 'ngResource', 'ngAnimate', 'ngMaterial', 'ui.router']);

    app.config(['$stateProvider', '$urlRouterProvider', '$mdDateLocaleProvider', function ($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/overview");

        $stateProvider
            .state('overview', {
                url: "/overview",
                data: {
                    pageTitle: 'Overview'
                },
                views: {
                    'pages': {
                        template: "<lights-overview>"
                    }
                }
            });
    }])
})();