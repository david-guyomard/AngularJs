'use strict';

angular.module('app')

  .service('AuthService', function ($rootScope, $q, $http, $window) {
    'ngInject';

    const API_URL = 'http://api.project-symfony.fr/login';
    const KEY = 'app-auth';

    this.isAuthenticated = () => {
      var user = angular.fromJson($window.localStorage.getItem(KEY));
      return user && typeof user.id != 'undefined';
    };

    this.getCurrentUser = () => {
      if (this.isAuthenticated()){
        let userAuth = angular.fromJson($window.localStorage.getItem(KEY));
        return userAuth.user;
      }
      return null;
    };

    this.getToken = () => {
      if (this.isAuthenticated() && this.getCurrentUser()){
        let userAuth = angular.fromJson($window.localStorage.getItem(KEY));
        return userAuth.value;
      }
      return null;
    }

    this.getUserByEmail = (email) => {
      var defer = $q.defer();

      $http.get(API_URL + `?email=${email}`).then((response) => {
        if (response.data.length > 0) {
          defer.resolve(response.data);
        } else {
          defer.reject();
        }
      }).catch(() => {
        defer.reject();
      });

      return defer.promise;
    };

    this.createUser = (user) => {

      var defer = $q.defer();

      this.getUserByEmail(user.email).then(() => {
        defer.reject();
      }).catch(() => {
        $http.post(API_URL, user).then((response) => {
          $window.localStorage.setItem(KEY, angular.toJson(response.data));
          $rootScope.$emit('AUTH', true);
          defer.resolve();
        });
      });

      return defer.promise;
    };

    this.connect = (email, pwd) => {

      var defer = $q.defer();
      var data = {
        login : email,
        password: pwd
      }
      $http.post(API_URL, data).then((response) => {
        if (response.data) {
          $window.localStorage.setItem(KEY, angular.toJson(response.data));
          $rootScope.$emit('AUTH', true);
          defer.resolve();
        } else {
          defer.reject();
        }
      }).catch((response) => {
        defer.reject();
      });

      return defer.promise;
      /*$http.get(API_URL + `?email=${email}&password=${pwd}`).then((response) => {
        if (response.data.length > 0) {
          $window.localStorage.setItem(KEY, angular.toJson(response.data[0]));
          $rootScope.$emit('AUTH', true);
          defer.resolve();
        } else {
          defer.reject();
        }
      }).catch((response) => {
        defer.reject();
      });

      return defer.promise;*/
    };

    this.disconnect = () => {
      $window.localStorage.removeItem(KEY);
      $rootScope.$emit('AUTH', false);
    };

  });