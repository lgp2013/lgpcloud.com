angular.module('ui.popover', [])
    .directive('popover', function () {
        return {
            restrict: 'A',
            scope: {
                popoverShow: '=',
                popoverOptions: '@'
            },
            link: function (scope, element) {
                element.popover(JSON.parse(scope.popoverOptions || '{ "placement": "top", "trigger": "manual" }'));
                scope.$watch('popoverShow', function (show) {
                    if (show) {
                        element.popover('show');
                    } else {
                        element.popover('hide');
                    }
                });
            }
        };
    });