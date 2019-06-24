'use strict';

angular.module('app')

  .service('UsersService', function ($q, $http, AuthService) {
    'ngInject';

    const API_URL = 'http://api.project-symfony.fr/users/list';

    this.getUsers = () => {
      var defer = $q.defer();
      var token = AuthService.getToken();
      $http.get(API_URL, {
        headers: {
          'X-Auth-Token': token
       },
      }).then((response) => {
        defer.resolve(response.data);
      }).catch((response) => {
        defer.reject(response.statusText);
      });

      return defer.promise;
    };

    this.getUser = (id) => {
      var defer = $q.defer();

      $http.get(API_URL + `/${id}`).then((response) => {
        defer.resolve(response.data);
      }).catch((response) => {
        defer.reject(response.statusText);
      });

      return defer.promise;
    };
  });