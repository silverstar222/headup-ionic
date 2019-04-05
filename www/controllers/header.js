/**
 * Created by nahrae on 10/20/14.
 */

/**
 * HEADER - handle menu toggle
 */
MapApp.controller('HeaderCtrl', function($scope) {
  // Main app controller, empty for the example
  $scope.leftButtons = [
    {
      type: 'button-clear',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
        $scope.sideMenuController.toggleLeft();
      }
    }
  ];
});
