MonitorApp.controller("LoginController", function($scope, $window, $state, CommonHttpService) {
    $scope.init = function () {
        $scope.loading = false;
        $state.go('login')
    }
    $scope.login = function() {
        $scope.loading = true;
        var login_api_url = '/api/token/';
        CommonHttpService.post(login_api_url).then(function(data){
            $scope.$parent.loading = false;
            $window.sessionStorage.token = data.token;
            $state.go('console.overview', {'location_id': data['root_folder_id']});
        }, function(data){
            delete $window.sessionStorage.token;
            $scope.$parent.loading = false;
            $scope.error_show = true;
        });
    }
});