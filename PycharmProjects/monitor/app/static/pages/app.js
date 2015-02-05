
var MonitorApp = angular.module("MonitorApp", ["ui.router", "ui.bootstrap", "ngTable",
        "angular-growl", "ngAnimate"],
    function($interpolateProvider, $stateProvider, $urlRouterProvider, $httpProvider){
        $interpolateProvider.startSymbol("{$");
        $interpolateProvider.endSymbol("$}");

        $urlRouterProvider.otherwise('/login/');
        $stateProvider.state('login', {
            url: "/login/",
            templateUrl: "/static/pages/login.html",
            controller: "LoginController"
        });
        $httpProvider.interceptors.push('AuthInterceptor');
    });

MonitorApp.factory('AuthInterceptor', function($rootScope,$q, $window){
    return {
        request: function(config){
            config.headers = config.headers || {};
            if($window.sessionStorage.token){
                config.headers.Authentication = $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function(rejection){
            if (rejection.status == 401){
                delete $window.sessionStorage.token;
                window.location.href = '/#/login/';
            }
            return $q.reject(rejection);
        }
    }
}).factory('CommonHttpService', function($http, $q) {
    return {
        'get': function (api_url) {
            var defer = $q.defer();
            $http({
                method: "GET",
                url: api_url
            }).success(function (data, status, headers) {
                defer.resolve(data, status, headers);
            }).error(function (data, status, headers) {
                defer.reject(data, status, headers);
            });

            return defer.promise;
        },
        'delete': function (api_url) {
            var defer = $q.defer();
            $http({
                method: "DELETE",
                url: api_url
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        },
        'post': function (api_url, post_data) {
            var defer = $q.defer();
            $http({
                method: "POST",
                url: api_url,
                data: post_data
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        },
        'put': function (api_url, put_data){
            var defer = $q.defer();
            $http({
                method: "PUT",
                url: api_url,
                data: put_data
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        }
    }
}).config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});

MonitorApp.run(function($http,  $rootScope, $state){
    $rootScope.$on("$stateChangeStart", function(event, toState){
        // 弹出页面转换效果
        $rootScope.loading=true;
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState){
        // 取消页面转换效果
        $rootScope.loading=false;
    });

    $rootScope.$state = $state;
});

MonitorApp.config(['growlProvider', function(growlProvider){
    growlProvider.globalTimeToLive(5000);
    growlProvider.globalReversedOrder(true);
}]);


