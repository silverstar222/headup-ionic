/**
 * Created by nahrae on 11/7/14.
 */

angular.module('MapApp')
.factory('LoaderService', function($rootScope, $ionicLoading) {

  return {
    show : function() { //code from the ionic framework doc
      $rootScope.loading = $ionicLoading.show({
        template: "<i class='ion-loading-d' ng-click='hideLoader()'></i>",
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 500
      });
      $rootScope.hideLoader = function(){ $ionicLoading.hide(); };
    },
    hide : function(){
      $ionicLoading.hide();
    }
  }
});