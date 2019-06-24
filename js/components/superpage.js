'use strict';

angular.module('app')

  .component('superpage', {

    templateUrl: '/views/superpage.html',

    controller: function ($log, $scope) {
      'ngInject';
      $scope.hero = [
        {name: "superman"},
        {name: "spiderman"},
        {name: "ironman"},
        {name: "aquaman"},
        {name: "hulk"},
      ];
      this.$onInit = () => {
        $log.info('superpage component loaded');
        
      };
    }
  });